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
