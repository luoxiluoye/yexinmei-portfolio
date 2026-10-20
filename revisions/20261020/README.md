# 2026-10-20 personal-profile preview

This revision restructures the non-portfolio pages for a 2027 graduate applying
for publicity, communications, party affairs, and administrative roles.

## Scope

- Home, education/profile, experience list and details, contact, capabilities,
  and journal pages use `components/professional/resume.module.css`.
- Existing public photographs are reused. No generated portraits, metrics, or
  downloadable-resume placeholders are introduced.
- `/portfolio` and every portfolio subroute, component, dataset, model, image,
  stylesheet, and dependency remain the deployed originals.

## Source preservation and deployment

The live deployment is newer than the repository snapshot. **Do not deploy this
branch checkout directly**: it does not contain the entire current portfolio.

The preview is built from the complete original deployment
`dpl_9rpmmsW9wSMz5r376WsNQo75U36Z`, using the generated `apply.cjs` from a pinned
commit of this branch as the deployment build command. The deployment target is
preview; the production custom domain is not promoted or reassigned.

`apply.cjs` embeds 24 explicitly approved source files. It also changes exactly
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

Visual and navigation checks are performed on the resulting preview. The
browser used for inspection has WebGL disabled, so it cannot render the existing
3D scene; that limitation also occurs on the untouched production deployment.
