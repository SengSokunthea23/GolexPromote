# GOLEX — The Golden Ginger Experience

The luxury 9:16 commercial for **GOLEX Ginger Instant Coffee 5 IN 1**, built entirely in **React** with [Remotion](https://www.remotion.dev).
It renders the finished ad: 1080 × 1920 · 60 fps · 30 s · H.264 + AAC.

The original `Coffee-1.mp4` is the base layer, so the GOLEX logo, packaging, models, Khmer copy and the original audio stay untouched. Everything premium is layered on top as React components.

---

## Quick start

```bash
npm install
npm run dev         # opens Remotion Studio: scrub the timeline, tweak live
npm run render     # writes out/GOLEX_Golden_Ginger_Experience_1080x1920.mp4
npm run render:khmer # writes out/GOLEX_Golden_Ginger_Khmer_1080x1920.mp4
npm run still      # poster frame -> out/poster.png
```

Requires Node 18+. Rendering uses headless Chrome (Remotion downloads it on the first render,
or you can pass `--browser-executable=/path/to/chrome`).
Select **GolexKhmer** in Remotion Studio for the Khmer-language promo, built with the same
product stills and visual style as **GolexPromo**. It uses the Krasar font when installed, with
Noto Sans Khmer as a fallback. The `Coffee-1.mp4` commercial remains separate and unchanged.

Optional Python helpers (`pip install numpy scipy pillow opencv-python`):

```bash
npm run sfx        # re-synthesise public/audio/golex-sfx.wav (whooshes, impacts, chimes, steam)
npm run sprites    # re-cut floating beans + ginger slice from the product images
```

---

## Project structure

```
golex-golden-ginger/
├── public/                      static assets (served via staticFile())
│   ├── video/Coffee-1.mp4       original footage: Khmer copy + voice/music
│   ├── images/                  supplied brand assets (pack, sachet, cup, models, ginger, beans)
│   ├── sprites/                 cut-out floating elements (bean0–10.png, slice.png)
│   └── audio/golex-sfx.wav      sound-design bed
├── scripts/
│   ├── generate-sfx.py          synthesises the SFX track (timings mirror timeline.ts)
│   └── extract-sprites.py       cuts beans / ginger slice out of the product images
├── src/
│   ├── index.ts                 registerRoot
│   ├── Root.tsx                 <Composition id="GolexCommercial"> 1080×1920 @ 60fps
│   ├── GolexCommercial.tsx      master layer stack + scene sequencing
│   ├── theme/
│   │   ├── colors.ts            brand palette + metallic gold gradient
│   │   ├── fonts.ts             Playfair Display · Montserrat · Manrope (bundled, render-safe)
│   │   └── timeline.ts          measured cut points, scene spans, push-ins
│   ├── lib/                     easing curves, useTime()
│   ├── components/              reusable motion-graphics building blocks
│   │   ├── BaseFootage.tsx      graded original video + per-scene cinematic push-in
│   │   ├── GoldText.tsx         L1–L4 type system (metallic gold / cream)
│   │   ├── KineticText.tsx      letter-by-letter serif headline
│   │   ├── Reveal.tsx           rise / wipe / centre / vertical mask reveals
│   │   ├── RuleLabel.tsx        micro label with animated gold hairlines
│   │   ├── IngredientCard.tsx   numbered premium feature card
│   │   ├── LowerBand.tsx        espresso gradient for legibility
│   │   ├── LightSweeps.tsx      golden diagonal sweep + flash on every cut
│   │   ├── RingWipe.tsx         expanding gold ring (geometric shape wipe)
│   │   ├── AnamorphicFlare.tsx  opening golden flare
│   │   ├── LogoSheen.tsx        light sweep across the GOLEX logo
│   │   ├── Sparkle.tsx          four-point gold glints
│   │   ├── FloatingSprite.tsx   real beans / ginger with parallax + depth of field
│   │   ├── SugarCrystals.tsx    procedural brown-sugar crystals
│   │   ├── GoldDust.tsx         particle atmosphere + bokeh
│   │   ├── Vignette.tsx · CornerFrame.tsx · FilmGrain.tsx
│   └── scenes/
│       ├── OpeningScene.tsx     0.0–4.4   cup hero · "The Golden Ginger Experience"
│       ├── PackagingScene.tsx   4.4–8.3   pack + sachet · "The 5 in 1 Experience"
│       ├── IngredientsScene.tsx 8.3–20.35 01–05 ingredient cards + floating ingredients
│       ├── RichnessScene.tsx    20.35–23.95 model 1 · "Experience the Richness"
│       ├── WarmthScene.tsx      23.95–26.85 model 2 · "Your Daily Moment of Warmth"
│       └── EndCardScene.tsx     26.85–30  logo sheen · glints · tagline under the Khmer CTA
├── remotion.config.ts
├── package.json
└── tsconfig.json
```

## Editing guide

| To change… | Edit |
|---|---|
| Any headline or label | the matching file in `src/scenes/` |
| Ingredient names / descriptors | `INGREDIENTS` in `src/scenes/IngredientsScene.tsx` |
| Colours | `src/theme/colors.ts` |
| When things happen | `src/theme/timeline.ts` (cut points were measured from the footage, so keep them in sync if the base video changes) |
| Push-in strength per scene | `PUSH_INS` in `src/theme/timeline.ts` |
| SFX level | `volume` on `<Audio>` in `src/GolexCommercial.tsx` |
| SFX timing / character | `scripts/generate-sfx.py`, then `npm run sfx` |

All text sits at y ≈ 1690–1860 px, in the empty lower zones of each shot, so it never covers the Khmer copy.
If the ad is going to TikTok or Reels, move the lower thirds up ~150 px to clear their UI. The `top` prop on each `Line`, `KineticText` and `RuleLabel` controls this.

## Brand rules respected

- The original GOLEX logo, packaging, labels, models and Khmer text are untouched (they come straight from the footage).
- On-screen product facts (5 IN 1, Bentong ginger, brown sugar, "Rich & Creamy + Warming & Energizing", 25 sachets · 19 g × 25 · 475 g) are copied from the packaging.
- The short taste descriptors on the ingredient cards ("Bold · Full-bodied", "Smooth · Aromatic", "Rich caramel sweetness") are copywriting. Review them before publishing.
- Palette: Ruby #790D18 · Burgundy #3B1016 · Crimson #A71924 · Gold #D9A83F · Champagne #F4D98A · Espresso #170B0D · Cream #FFF0D2.

---

## v2 — "The Golden Ginger Experience" promo (no source footage)

A second composition, `GolexPromo`, built only from the supplied stills (pack, sachet, cup, models, ginger, beans, palm sugar) plus a cut-out of the GOLEX badge from the sachet.

```bash
npm start                                   # pick "GolexPromo" in the Studio sidebar
npx remotion render src/index.ts GolexPromo out/GOLEX_Golden_Ginger_Promo_1080x1920.mp4 --codec=h264 --crf=18
npm run promo-audio                         # rebuild music + sound design
```

Files: `src/promo/` (timeline.ts · PromoBackground · parts.tsx · scenes.tsx · PromoCommercial.tsx), `public/promo/` (cut-outs + logo), `scripts/generate-promo-audio.py`.
Scenes: logo reveal → cup hero → 3D pack reveal → sachet + pack claims → three ingredients → model 1 → model 2 → end card with CTA.
It renders at 30 fps; change `P_FPS` in `src/promo/timeline.ts` for 60.

---

## v3 — Royal Silk · សូត្រមាស (Khmer luxury cut)

Composition **GolexKhmerLux** · 1080 × 1920 · 30 fps · 30 s. This is a new visual theme, written Khmer-first and
built from the product stills. The soundtrack is **Golden Bells** (`public/audio/Golden Bells - usesuno.com.mp3`)
plus a synthesised SFX layer.

```bash
npm run render:lux   # out/GOLEX_Royal_Silk_Khmer_1080x1920.mp4
npm run sfx:lux      # re-synthesise public/audio/golex-lux-sfx.wav (pure Node, no Python needed)
```

**Beat sync.** "Golden Bells" was measured at 102.9 BPM (beat 0.583 s, first downbeat 0.356 s). Every scene cut
lands on a downbeat (`bar(n)` in `src/lux/timeline.ts`). Text and cards enter on beats or half-beats. The
camera punches on the music lift (7.35 s) and on the final hit (26.01 s). `scripts/generate-lux-sfx.mjs` uses
the same grid, so if you change the song, re-measure it and update both files.

**Theme.**
- Burgundy "silk" backdrops with drifting light pools and faint rotating guide circles.
- One cream showcase stage (the title).
- **Moul** for gold Khmer headlines, **Kantumruy Pro** for Khmer supporting copy, and **Italiana**,
  **Playfair Display** italic and **Manrope** for English accents.
- Khmer motifs: a lotus/kbach divider and temple-arch frames for the ingredient cards and the lifestyle shot.

| # | Scene | Time | Transition in | Key techniques |
|---|-------|------|---------------|----------------|
| 1 | Intro | 0.00–2.69 | blur-to-focus | gold circle draws with a comet head, logo pulls from blur into focus, logo sheen, lotus divider, tracked English |
| 2 | Title (cream) | 2.69–5.02 | circle mask + gold ring | Khmer word-by-word masked rise, "ខ្ញីមាស" scale-in on beat 2, parallax beans and ginger |
| 3 | Pack | 5.02–9.69 | circle mask | arch-mask product reveal, 2.5D turn, gold outline trace, orbiting ingredients, copy swap on the music lift |
| 4 | Cup | 9.69–14.35 | zoom-through | coffee pour plus splash ripple, 3D ingredient orbit passing in front of and behind the cup, steam, sensory words on half-beats |
| 5 | Ingredients | 14.35–19.01 | directional whip ← | three temple-arch cards land on beats, parallax group push |
| 6 | Benefits | 19.01–21.35 | directional whip → | sachet turns in, 5 pack claims as chips on half-beats, with motion blur |
| 7 | Lifestyle 1 | 21.35–23.68 | circle mask | model steps out of a gold temple arch |
| 8 | Lifestyle 2 | 23.68–26.01 | lift + blur | slow push-in, gold circle on the cup, callout with a leader line |
| 9 | End card | 26.01–30.00 | zoom on the big hit | hero line-up, logo signature sheen, tagline, CTA "បញ្ជាទិញឥឡូវនេះ" |

**Sound design** (`golex-lux-sfx.wav`, mixed at 0.6 under the music at 0.78):
- whooshes matched to each transition type
- cinematic impacts and sub booms on the big hits
- twinkling "gold draw" glissandi for line animations
- pops and ticks for text, cards and chips
- coffee pour with bubble chirps, a steam bed and warm room ambience
- a bell-chord logo signature and a final warm impact

Code: `src/lux/` (`timeline.ts`, `fonts.ts`, `kit.tsx`, `scenes.tsx`, `LuxCommercial.tsx`).
