import { chromium } from "playwright";
import fs from "node:fs/promises";

const target = process.env.PLAYER_URL || "https://yexinmei-portfolio-git-player-j-af5caf-luoyes-projects-a7639a71.vercel.app/player";
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900, desktop: true },
  { name: "desktop-1280x800", width: 1280, height: 800, desktop: true },
  { name: "desktop-1920x1080", width: 1920, height: 1080, desktop: true },
  { name: "mobile-390x844", width: 390, height: 844, desktop: false },
  { name: "mobile-430x932", width: 430, height: 932, desktop: false },
];

const expectedTitles = [
  "编导与影像",
  "传统媒体",
  "国际传播",
  "新媒体运营",
  "社区与新品",
  "个人项目",
  "NOW",
];

const results = [];
await fs.mkdir("qa/screenshots", { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(target, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForSelector("h1", { timeout: 20_000 });

    const bodyText = await page.locator("body").innerText();
    assert(!bodyText.includes("SELECTED EXPERIENCE"), `${viewport.name}: SELECTED EXPERIENCE still rendered`);
    assert(!bodyText.includes("CAREER LOG"), `${viewport.name}: CAREER LOG still rendered`);
    assert(!bodyText.includes("05 RECORDS"), `${viewport.name}: 05 RECORDS still rendered`);
    for (const heading of ["CHARACTER STORY", "JOURNEY", "FUN FACTS"]) {
      assert(bodyText.includes(heading), `${viewport.name}: missing ${heading}`);
    }
    assert(bodyText.includes("CURRENT POSITION"), `${viewport.name}: missing CURRENT POSITION`);
    assert(bodyText.includes("07 · NOW"), `${viewport.name}: missing 07 · NOW endpoint`);
    assert(bodyText.includes("NEXT QUEST"), `${viewport.name}: missing NEXT QUEST`);
    assert(bodyText.includes("TBD"), `${viewport.name}: missing TBD`);
    assert(!bodyText.includes("MEMORY FOUND"), `${viewport.name}: MEMORY FOUND toast text still present`);

    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(horizontalOverflow <= 2, `${viewport.name}: horizontal overflow ${horizontalOverflow}px`);

    const journeyButtons = page.locator('button[aria-haspopup="dialog"]');
    assert((await journeyButtons.count()) === 7, `${viewport.name}: expected 7 journey buttons`);
    for (let i = 0; i < 7; i += 1) {
      const label = await journeyButtons.nth(i).getAttribute("aria-label");
      assert(label?.includes(expectedTitles[i]), `${viewport.name}: stage ${i + 1} title/order mismatch: ${label}`);
    }

    if (viewport.desktop) {
      const heights = await page.evaluate(() => {
        const headings = ["CHARACTER STORY", "JOURNEY", "FUN FACTS"];
        return headings.map((heading) => {
          const h2 = [...document.querySelectorAll("h2")].find((node) => node.textContent?.trim() === heading);
          const card = h2?.closest("section.pixel-cut-frame");
          return card?.getBoundingClientRect().height ?? -1;
        });
      });
      const maxHeight = Math.max(...heights);
      const minHeight = Math.min(...heights);
      assert(minHeight > 0 && maxHeight - minHeight <= 2, `${viewport.name}: lower cards not equal height ${heights.join(", ")}`);

      await journeyButtons.first().hover();
      const openMemory = page.getByText("OPEN MEMORY", { exact: true }).first();
      assert(await openMemory.isVisible(), `${viewport.name}: OPEN MEMORY hover feedback not visible`);
    } else {
      assert(
        await page.getByText("← SWIPE · TAP A STAGE TO OPEN MEMORY →", { exact: true }).isVisible(),
        `${viewport.name}: mobile tap/swipe hint missing`
      );
    }

    for (let i = 0; i < 7; i += 1) {
      for (const closeMode of ["button", "overlay", "escape"]) {
        const trigger = journeyButtons.nth(i);
        await trigger.click();
        const dialog = page.locator('[role="dialog"][aria-labelledby^="memory-dialog-title-"]');
        await dialog.waitFor({ state: "visible", timeout: 5_000 });
        assert((await dialog.count()) === 1, `${viewport.name}: stage ${i + 1} has overlapping dialogs`);

        const dialogText = await dialog.innerText();
        assert(dialogText.includes(expectedTitles[i]), `${viewport.name}: stage ${i + 1} opened wrong memory`);
        assert(dialogText.includes(`STAGE ${String(i + 1).padStart(2, "0")}`), `${viewport.name}: missing stage number ${i + 1}`);
        assert(dialogText.includes("KEY ABILITIES"), `${viewport.name}: stage ${i + 1} missing abilities`);

        const geometry = await dialog.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const overlay = element.parentElement;
          return {
            x: box.x,
            y: box.y,
            right: box.right,
            bottom: box.bottom,
            overlayPosition: overlay ? getComputedStyle(overlay).position : "",
            overlayZ: overlay ? Number.parseInt(getComputedStyle(overlay).zIndex || "0", 10) : 0,
            bodyOverflow: document.body.style.overflow,
          };
        });
        assert(geometry.x >= -1 && geometry.y >= -1, `${viewport.name}: modal starts outside viewport ${JSON.stringify(geometry)}`);
        assert(geometry.right <= viewport.width + 1, `${viewport.name}: modal exceeds viewport width ${JSON.stringify(geometry)}`);
        assert(geometry.bottom <= viewport.height + 1, `${viewport.name}: modal exceeds viewport height ${JSON.stringify(geometry)}`);
        assert(geometry.overlayPosition === "fixed", `${viewport.name}: overlay is not fixed`);
        assert(geometry.overlayZ >= 1000, `${viewport.name}: overlay z-index below 1000`);
        assert(geometry.bodyOverflow === "hidden", `${viewport.name}: body scroll not locked while modal open`);

        if (closeMode === "button") {
          await dialog.getByRole("button", { name: "关闭记忆档案" }).click();
        } else if (closeMode === "overlay") {
          await dialog.locator("xpath=..").click({ position: { x: 4, y: 4 } });
        } else {
          await page.keyboard.press("Escape");
        }

        await dialog.waitFor({ state: "detached", timeout: 5_000 });
        const closedState = await page.evaluate(() => ({
          overflow: document.body.style.overflow,
          dialogs: document.querySelectorAll('[role="dialog"][aria-labelledby^="memory-dialog-title-"]').length,
        }));
        assert(closedState.overflow !== "hidden", `${viewport.name}: body scroll lock remained after ${closeMode}`);
        assert(closedState.dialogs === 0, `${viewport.name}: transparent/dialog blocker remained after ${closeMode}`);

        if (closeMode === "button") {
          await page.waitForTimeout(32);
          const focusedLabel = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || "");
          assert(focusedLabel.includes(expectedTitles[i]), `${viewport.name}: focus did not return to stage ${i + 1}; got ${focusedLabel}`);
        }
      }
    }

    for (const index of [0, 2, 6]) {
      await journeyButtons.nth(index).click();
      const dialog = page.locator('[role="dialog"][aria-labelledby^="memory-dialog-title-"]');
      await dialog.getByRole("button", { name: "关闭记忆档案" }).click();
      await dialog.waitFor({ state: "detached" });
    }

    const funFactButton = page.getByRole("button", { name: /卖过 20W\+ 的 CCD/ }).first();
    await funFactButton.click();
    const inspectDialog = page.getByRole("dialog", { name: /CCD CAMERA Inspect Item/ });
    await inspectDialog.waitFor({ state: "visible", timeout: 5_000 });
    await page.keyboard.press("Escape");
    await inspectDialog.waitFor({ state: "detached", timeout: 5_000 });
    await page.waitForTimeout(32);

    const scrollResult = await page.evaluate(async () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo(0, 0);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const top = window.scrollY;
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      return {
        maxScroll,
        top,
        after: window.scrollY,
        bodyOverflow: document.body.style.overflow,
      };
    });
    assert(scrollResult.bodyOverflow !== "hidden", `${viewport.name}: body remained locked after Fun Facts close`);
    if (scrollResult.maxScroll > 1) {
      assert(scrollResult.after > scrollResult.top, `${viewport.name}: page could not scroll after modal close ${JSON.stringify(scrollResult)}`);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await journeyButtons.nth(0).click();
    const reopened = page.locator('[role="dialog"][aria-labelledby^="memory-dialog-title-"]');
    await reopened.waitFor({ state: "visible", timeout: 5_000 });
    await page.keyboard.press("Escape");
    await reopened.waitFor({ state: "detached", timeout: 5_000 });

    if (viewport.desktop) {
      await page.getByRole("link", { name: "CONTACT", exact: true }).click();
    } else {
      await page.locator('nav[aria-label="Mobile navigation"] a[href="/contact"]').click();
    }
    await page.waitForURL(/\/contact$/, { timeout: 10_000 });
    await page.goBack({ waitUntil: "networkidle" });
    assert(new URL(page.url()).pathname === "/player", `${viewport.name}: navbar recovery did not return to PLAYER`);

    assert(pageErrors.length === 0, `${viewport.name}: page errors: ${pageErrors.join(" | ")}`);
    await page.screenshot({ path: `qa/screenshots/${viewport.name}.png`, fullPage: true });

    results.push({ viewport: viewport.name, status: "PASS" });
    console.log(`PASS ${viewport.name}`);
    await context.close();
  }

  await fs.writeFile("qa/qa-results.json", JSON.stringify({ target, results }, null, 2));
  console.log(`ALL PLAYER QA PASSED: ${results.length}/${viewports.length} viewports`);
} finally {
  await browser.close();
}
