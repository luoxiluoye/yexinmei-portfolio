"use client";

import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { useTransitionRouter } from "next-view-transitions";

import { PixelIcon } from "@/components/ui/pixel-icon";
import {
  openQuickProfile,
  openSaveFile,
  SYSTEM_MENU_EVENT,
} from "@/lib/rpg-events";

const quickTravel = [
  { code: "01", label: "HOME", subtitle: "返回世界入口", href: "/", keywords: ["首页", "主页", "home"] },
  { code: "02", label: "PLAYER", subtitle: "角色资料与 Journey", href: "/player", keywords: ["关于我", "经历", "player", "journey"] },
  { code: "03", label: "QUESTS", subtitle: "项目与案例", href: "/quests", keywords: ["项目", "作品", "案例", "quests", "知乎", "ccd", "摄影"] },
  { code: "04", label: "INVENTORY", subtitle: "技能与工具箱", href: "/inventory", keywords: ["技能", "工具", "inventory"] },
  { code: "05", label: "JOURNAL", subtitle: "笔记与记录", href: "/journal", keywords: ["文章", "笔记", "journal"] },
  { code: "06", label: "CONTACT", subtitle: "找到我", href: "/contact", keywords: ["联系", "微信", "邮箱", "contact"] },
] as const;

function copyFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

export function SystemMenu() {
  const router = useTransitionRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const openSystemPanel = useCallback((openPanel: () => void) => {
    setOpen(false);
    window.setTimeout(openPanel, 0);
  }, []);

  useEffect(() => {
    const openMenu = () => setOpen(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener(SYSTEM_MENU_EVENT, openMenu);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(SYSTEM_MENU_EVENT, openMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const copyWechat = async () => {
    let success = false;
    try {
      await navigator.clipboard.writeText("luoxiluoye");
      success = true;
    } catch {
      try {
        success = copyFallback("luoxiluoye");
      } catch {
        success = false;
      }
    }
    setCopied(success);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="System Menu / Quick Travel"
      loop
      className="rpg-command-root"
    >
      <div className="rpg-command-shell pixel-cut-frame">
        <div className="pixel-cut-surface overflow-hidden bg-paper">
          <header className="flex items-center justify-between gap-3 border-b border-divider px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-divider bg-soft">
                <PixelIcon assetId="items.chest" decorative width={30} height={30} />
              </div>
              <div className="min-w-0">
                <p className="font-pixel text-[8px] text-accent">PAUSE / SYSTEM</p>
                <h2 className="mt-0.5 font-pixel text-[14px] leading-5">QUICK TRAVEL</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex min-h-10 min-w-10 items-center justify-center border-2 border-border bg-paper font-pixel text-[11px] hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="关闭 System Menu"
            >
              ×
            </button>
          </header>

          <div className="border-b border-divider bg-soft p-3">
            <div className="flex items-center gap-2 border-2 border-border bg-paper px-3">
              <span aria-hidden="true" className="font-pixel text-[11px] text-accent">&gt;</span>
              <Command.Input
                autoFocus
                placeholder="Search page, action, keyword..."
                className="h-11 min-w-0 flex-1 border-0 bg-transparent font-pixel text-[10px] text-foreground outline-none placeholder:text-muted"
              />
              <kbd className="hidden border border-divider bg-soft px-1.5 py-1 font-pixel text-[8px] text-muted sm:block">ESC</kbd>
            </div>
          </div>

          <Command.List className="rpg-command-list no-scrollbar max-h-[min(58vh,420px)] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center">
              <p className="font-pixel text-[10px] text-accent">NOT FOUND</p>
              <p className="mt-2 text-[12px] text-muted">换个关键词试试。</p>
            </Command.Empty>

            <Command.Group heading="PLAYER SYSTEM" className="rpg-command-group">
              <Command.Item
                value="Save File achievement collection progress achievements"
                keywords={["存档", "成就", "进度", "save", "achievement"]}
                onSelect={() => openSystemPanel(openSaveFile)}
                className="rpg-command-item"
              >
                <PixelIcon assetId="player.achievementBadge" decorative width={20} height={20} className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-pixel text-[10px]">SAVE FILE</span>
                  <span className="block text-[11px] text-muted">探索进度与成就图鉴</span>
                </span>
                <span aria-hidden="true" className="font-pixel text-[9px] text-muted">→</span>
              </Command.Item>
              <Command.Item
                value="Quick Profile 60 sec recruiter resume summary"
                keywords={["60秒", "快速", "招聘", "hr", "resume", "summary"]}
                onSelect={() => openSystemPanel(openQuickProfile)}
                className="rpg-command-item"
              >
                <PixelIcon assetId="ui.sparkle" decorative width={20} height={20} className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-pixel text-[10px]">QUICK PROFILE · 60 SEC</span>
                  <span className="block text-[11px] text-muted">给招聘方的快速阅读模式</span>
                </span>
                <span aria-hidden="true" className="font-pixel text-[9px] text-muted">→</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-divider" />

            <Command.Group heading="QUICK TRAVEL" className="rpg-command-group">
              {quickTravel.map((item) => (
                <Command.Item
                  key={item.href}
                  value={`${item.label} ${item.subtitle}`}
                  keywords={[...item.keywords]}
                  onSelect={() => go(item.href)}
                  className="rpg-command-item"
                >
                  <span className="w-7 shrink-0 font-pixel text-[8px] text-accent">{item.code}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-pixel text-[10px] leading-4">{item.label}</span>
                    <span className="block truncate text-[11px] leading-4 text-muted">{item.subtitle}</span>
                  </span>
                  <span aria-hidden="true" className="font-pixel text-[9px] text-muted">→</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-divider" />

            <Command.Group heading="ACTIONS" className="rpg-command-group">
              <Command.Item
                value="Copy WeChat luoxiluoye"
                keywords={["微信", "wechat", "复制"]}
                onSelect={copyWechat}
                className="rpg-command-item"
              >
                <PixelIcon assetId="ui.heart" decorative width={20} height={20} className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-pixel text-[10px]">{copied ? "WECHAT COPIED" : "COPY WECHAT"}</span>
                  <span className="block text-[11px] text-muted">luoxiluoye</span>
                </span>
              </Command.Item>
              <Command.Item
                value="Send Email 2657351670@qq.com"
                keywords={["邮箱", "邮件", "email", "联系"]}
                onSelect={() => {
                  window.location.href = "mailto:2657351670@qq.com";
                  setOpen(false);
                }}
                className="rpg-command-item"
              >
                <PixelIcon assetId="items.mail" decorative width={20} height={20} className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-pixel text-[10px]">SEND EMAIL</span>
                  <span className="block truncate text-[11px] text-muted">2657351670@qq.com</span>
                </span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <footer className="flex items-center justify-between gap-3 border-t border-divider bg-soft px-4 py-2 font-pixel text-[8px] text-muted">
            <span>↑↓ SELECT · ENTER OPEN</span>
            <span>⌘K / CTRL K</span>
          </footer>
        </div>
      </div>
    </Command.Dialog>
  );
}
