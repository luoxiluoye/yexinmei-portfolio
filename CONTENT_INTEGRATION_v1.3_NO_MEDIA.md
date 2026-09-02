# Content Integration — YEXINMEI_CONTENT_MASTER_v1.3_NO_MEDIA

## Scope

This revision only connects the supplied content master and implements the approved no-media Quest Detail state. No new product features, interaction patterns, animations, or information-architecture sections were added.

## Quest Detail no-media rule

All six current quests use:

```ts
gallery: []
```

When `gallery.length === 0`, `QuestGallery` returns `null`, so the Gallery section is absent from the rendered page.

Removed from the Quest implementation:

- project-cover pending UI
- image pending UI
- project image placeholders
- decorative pixel assets used as fake project screenshots
- fake Quest progress / XP data

## Quest Detail order

```text
Meta
→ 项目简介
→ Objective
→ Challenge
→ Actions
→ Outcomes
→ Learnings
→ Gallery (conditional; currently hidden)
→ CTA
```

The Gallery component remains wired to `quest.gallery`; future real project images only require data registration and do not require a page restructure.

## Data outcome cards

Explicit metrics are promoted to result cards while the source outcome statements remain visible:

- CCD: `20W+ GMV`, `50%+ 利润率`
- 国际传播: `1000+ 海外社媒内容`, `8000+ 账号涨粉`, `40%+ 推文浏览破 5000`, `10% 推文浏览破 2W`
- 灵感编辑室: `32 字段`, `8 看板视图`

No unsupported follower/read/traffic figures were added to 科技有后话.

## Content files connected

- `data/home.ts`
- `data/profile.ts`
- `data/experience.ts`
- `data/quests.ts`
- `data/skills.ts`
- `data/journal.ts`
- `data/contact.ts`

The original supplied content documents are preserved under `content-master/` for handoff reference.
