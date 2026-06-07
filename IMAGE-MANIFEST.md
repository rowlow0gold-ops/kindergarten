# Image manifest — Phase 1

All images are currently tasteful placeholders (cream panel + molecule + label) rendered by `src/components/Figure.astro`.
To use a real photo: drop the file in `public/images/` and pass `src="/images/<file>"` to the matching `<Figure>` (search the alt text below to find it).
Use free, license-clear photos (Pexels / Unsplash / Pixabay). Keep files reasonably sized (≤300 KB, ~1600px wide).

## Homepage (HomePage.astro)
- intro / "science school"  → file: science-lab.jpg   · 4:3 · search: "kids science experiment lab goggles"
- level: preschool/kindergarten → preschool.jpg · 4:3 · "preschool children classroom"
- level: primary            → primary.jpg     · 4:3 · "primary school children learning"
- level: secondary          → secondary.jpg   · 4:3 · "secondary students STEM"
- level: IGCSE/A-Level      → cambridge.jpg   · 4:3 · "teenagers studying laptop classroom"
- hero (optional video)     → public/video/hero.mp4 · muted autoplay loop · "children classroom b-roll"

## 10 Years (MilestonesPage.astro)
- collage ×4   → story-1..4.jpg · square · "children exploring / science class / stage / project"
- banner       → community.jpg · wide · "school group photo"
- founder      → founder.jpg · square · "principal portrait"
- timeline ×5  → timeline-2016..2026.jpg · 4:3 · "classroom / campus building / students"

## Campuses (SchoolsPage.astro)
- map          → korea-map.jpg · 16:7 · "Korea map illustration" (or a custom SVG map later)
- branch thumb ×6 → branch-<slug>.jpg · 4:3 · "modern kindergarten building exterior"

## Branch detail (BranchPage.astro)
- main photo + gallery ×4 per branch → reuse branch-<slug>-1..5.jpg
