# 2026-10-20 personal-profile preview

This revision restructures the non-portfolio pages for a 2027 graduate applying
for publicity, communications, party affairs, and administrative roles.

## Scope

- Home, education/profile, experience list and details, contact, capabilities,
  and journal pages use `components/professional/resume.module.css`.
- Existing public photographs are reused. Two generated decorative images are
  added under `public/assets/profile-20261020/`; their prompts are recorded in
  `asset-prompts.json`. No generated portraits, metrics, or resume placeholders
  are introduced.
- `/portfolio` and every portfolio subroute, component, dataset, model, image,
  stylesheet, and dependency remain the deployed originals.

## Source preservation and deployment

The live deployment is newer than the repository snapshot. **Do not deploy this
branch checkout directly**: it does not contain the entire current portfolio.

The preview is built from the complete original deployment
`dpl_9rpmmsW9wSMz5r376WsNQo75U36Z`, using the generated `apply.cjs` from a pinned
commit of this branch as the deployment build command. The deployment target is
preview; the production custom domain is not promoted or reassigned.

`apply.cjs` embeds 25 explicitly approved source files, and downloads two exact
new image paths from the same immutable GitHub commit. The image sizes, WebP
headers and SHA256 checksums are checked before writing. New paths must be absent;
existing assets cannot be replaced. It also changes exactly
one route array in each of `site-frame.tsx` and `site-chrome.tsx`, moving only
`/inventory` and `/journal` into the professional shell. `/portfolio` retains its
existing route predicate and rendering branch byte for byte.

Before writing, the script verifies original deployment SHA1 anchors. It hashes
all other application source and all public assets, compares them after the patch
and after the original `npm run build`, and aborts if protected bytes change.
It never uploads source, reads credentials, changes environment variables, or
changes project settings itself.

The hosted build adds the known project `name` to `vercel.json`. Identity checks
allow only the original schema and alias, this exact project name, and an exact
pinned build command if present. The runtime config bytes remain protected for
the entire patch and build. Other changes are rejected.

## Regenerate the patch

After editing only the authorized files:

```sh
python -B revisions/20261020/create-patch.py
node --check revisions/20261020/apply.cjs
```

The generator reads `original-source-manifest.json` and
`original-site-frame.txt` as immutable provenance for the original deployment.
It does not create missing page content or perform a deployment.

The inherited-source deployment's build command downloads `apply.cjs` at a fixed
commit, then invokes `node` on it. The script runs `npm run build` itself.

## Validation

- TypeScript `tsc --noEmit` passed for all new page and component imports.
- Contact copy actions handle success, unavailable clipboard access, component
  unmount, and stale asynchronous completion.
- New CSS is module-scoped, with responsive rules and visible keyboard focus.
- Portfolio preservation is checked against the original deployed source and
  all assets by the build script, rather than against the older Git checkout.

## Visual follow-up

The first preview was rejected as visually awkward. The follow-up replaces the
small resume card with a large editorial workspace image, returns to warm white
and brick red, uses open sections in place of tinted cards, and keeps the real
portrait in the about page. Experience lists link to their details instead of
repeating them; skills use two open columns; journal entries follow a single
reading column. Contact uses the second generated image and a prominent email.
All new styling remains scoped to the non-portfolio page root.

### Compact contact and UI details

The next follow-up keeps the accepted warm editorial direction and adds a small,
consistent UI vocabulary in `editorial-ui.tsx`: decorative line icons in muted
brick, bronze and sage; compact numbered section labels; tool tags; and a few
contextual emoji. No dependency or factual resume content was added.

Contact now uses a normal page heading with a 176 x 110 decorative image, a short
profile aside, and three aligned contact rows. The desktop email is 23 px instead
of 42 px. Copy controls retain the original guarded asynchronous logic and now
show a checkmark and muted green success state. Experience disclosures expose
plus/minus indicators; tool chips wrap naturally; reduced-motion preferences and
visible keyboard focus remain supported.

- URL: https://yexinmei-portfolio-if36ojb9p-luoyes-projects-a7639a71.vercel.app/
- Contact: https://yexinmei-portfolio-if36ojb9p-luoyes-projects-a7639a71.vercel.app/contact
- Deployment: `dpl_GrJKjc7SR712ZwvGKG5VZ6yqKH2t`; READY; preview (`target: null`).
- Build patch commit: `21157054d84bb685bef4305378799930024b7ddb`.
- Patch includes 25 explicitly approved source files, two exact shared route
  edits, and the same two pinned new images: 29 writes in total.
- The 442 protected original files have the same manifest before the patch,
  after the patch and after the successful build:
  `79db1cd9486e488b70b58e05e2861f0be86a8268305c0367fcc0dfb92116a15e`.
- TypeScript, patch syntax and whitespace checks passed. An independent source
  review checked responsive contact widths, mobile feature cards, icon/title
  specificity, and nested tool-tag spacing. The project-category specificity
  issue found in review was corrected before deployment.
- Desktop browser inspection covered home, contact, profile, capabilities,
  journal and experience. Contact has nine small SVG elements, a 36 px heading
  and 23 px email; the heading is fully below the 95 px navigation. No horizontal
  overflow was observed. Navigation from a lower-page link to capabilities still
  restores the title below the sticky navigation (184 px from the viewport top).
- Email and WeChat copy show success and yield their correct clipboard strings.
  Clipboard reads are taken after the browser bridge has synchronized, in a
  separate observation call. Experience expands by click and collapses by Enter,
  with matching minus/plus indicators; section navigation reaches its target.
- Portfolio retains `portfolio-studio-page`, has zero professional module classes,
  and root scroll padding returns to `auto`. Its photography route still exposes
  35 photo controls. The existing inspection-browser WebGL limitation is unchanged.
- Mobile layouts were reviewed in source; this environment did not provide a
  separate phone viewport. Production remains on the original deployment.

### Verified visual follow-up

- URL: https://yexinmei-portfolio-3xfeafw8c-luoyes-projects-a7639a71.vercel.app/
- Deployment: `dpl_BzsmKUz9uDndEokDKKLcEcKwuFBM`; READY; preview (`target: null`).
- Build patch commit: `3f9f275356559591f23fccf1c8c356ff5747dec3`.
- The final build generated 31 static pages and finished successfully. The 442
  protected original files retain the same manifest before patching, after
  patching and after build:
  `79db1cd9486e488b70b58e05e2861f0be86a8268305c0367fcc0dfb92116a15e`.
- Both image payloads were retrieved from the pinned commit and verified. The
  homepage hero is 1536 x 1024 / 121270 bytes. The contact image is 2172 x 724 /
  76088 bytes. WebP conversion retained their dimensions without retouching.
- Desktop visual review covered home, profile, experience, contact, skills and
  journal. Email and WeChat copy produced correct text and success feedback;
  experience disclosure and detail navigation worked; journal article navigation
  worked. All eight curated practices retain an entry point.
- Review found and fixed a stale contact-row padding rule, and a sticky-navigation
  overlap after entering an inner page from the homepage footer. The final browser
  check measured the skills title at 184 px, below the 95 px navigation, with
  `scrollY=0`. The scroll offset uses `html:has(.page)` and becomes `auto` on the
  portfolio route; no professional page root is present there.
- The original photography view still exposes 35 photo controls. The inspection
  browser's known WebGL limitation remains; no portfolio renderer was changed.
- Mobile breakpoints received code review. A separate phone viewport was not
  available in this browser environment.
- Production `luoyexinmei.top` remains on the original deployment; this link is a
  separately reviewable preview.

### Previously verified preview

- URL: https://yexinmei-portfolio-r4fe02r48-luoyes-projects-a7639a71.vercel.app/
- Deployment: `dpl_Ghm1mA7Ysss76y3D9bqFCnHTzsg9`; READY; preview (`target: null`).
- Build patch commit: `9a61df50bfebb92043a059f62b7352d876d31826`.
- Production `luoyexinmei.top` still resolves to the original deployment.
- 442 protected files had the same SHA256 manifest before the patch, after the
  patch, and after the successful Next.js build:
  `79db1cd9486e488b70b58e05e2861f0be86a8268305c0367fcc0dfb92116a15e`.
- Browser checks covered home, profile, experience, curated detail, legacy
  detail, red-leaf, contact, skills, journal list/article, and navigation into
  the original portfolio. Both copy buttons produced the correct clipboard
  text and success status. Both home images loaded.
- The original portfolio photography view still contains 35 photo controls;
  the professional shell and new page classes are absent from that route.
- Desktop viewport checked at 1363 px. Responsive CSS was reviewed; a separate
  phone viewport was not available in the browser inspection environment.

The inspection browser has WebGL disabled, so it cannot render the existing 3D
scene. The same WebGL error occurs on the untouched production deployment;
the portfolio renderer chunk is unchanged in the preview.
