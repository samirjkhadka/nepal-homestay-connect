

# Visual Polish & Nepal Map Fix

## Part 1: Fix the Nepal Map (Critical)

The current "map" in `InteractiveProvinceMap.tsx` is a generic blob shape — not Nepal at all. Replace it with an accurate SVG path of Nepal's borders, with each of the 7 provinces as **separate clickable polygon regions** (not just dots floating on a blob).

- Use a real GeoJSON-derived SVG path for Nepal's outline + 7 province sub-paths
- Each province becomes a hoverable/clickable `<path>` that fills with terracotta on hover
- Province name labels positioned at each region's centroid
- Small marker dot showing homestay count badge per province
- Mini-legend showing "X homestays" color scale
- Keep the existing info side-panel (it works well)

---

## Part 2: Visual & UI Upgrades

### A. Color & Theme Refinements
- **Dark mode contrast pass** — several sections still have low-contrast text on dark backgrounds (testimonial cards, footer links, badge text). Audit and fix.
- **Primary color softening** — current terracotta `15 65% 45%` is slightly harsh. Shift to `15 60% 48%` for warmer feel; add a deeper variant for hovers.
- **Accent gradient additions** — introduce a subtle saffron→terracotta gradient utility (`bg-gradient-warm`) for CTAs and section dividers.

### B. Hero Section Polish
- Add a subtle **mountain silhouette SVG** at the bottom of the hero for depth
- Slow Ken-Burns zoom on hero images (already has carousel, add scale animation)
- Refine hero text shadow for better legibility on bright photos
- Add scroll-indicator chevron at bottom

### C. Card & Component Upgrades
- **Homestay cards**: add subtle border-glow on hover, image zoom on hover, "New" / "Popular" ribbons for featured items
- **Section dividers**: add decorative SVG dividers (mountain peaks, mandala motifs) between major sections instead of plain spacing
- **Badge redesign**: ExperienceBadges currently flat — add soft colored backgrounds matching each badge's meaning (green for eco, purple for women-led, etc.)
- **Buttons**: add micro-interaction (slight scale + shadow) on hover for all primary CTAs

### D. Typography & Spacing
- Increase headline letter-spacing on display fonts (-0.02em) for premium feel
- Tighten line-height on body text from default to `1.65`
- Add consistent section padding scale (`py-16 md:py-24`) — currently inconsistent across sections

### E. Section-Specific Improvements
- **TrustStrip**: animate the numbers counting up when scrolled into view
- **PartnersSection**: replace plain text with styled logo placeholder cards (rounded boxes with gradient borders)
- **TestimonialsSection**: add quote-mark decorative SVG, alternate card alignment
- **ImpactSection**: add animated progress bars/circles for impact metrics
- **Footer**: add a "Made with ❤️ in Nepal" strip with prayer-flag color accent line on top

### F. Micro-Interactions & Motion
- Page transition fade between routes (already has `PageTransition.tsx` — verify it's wired)
- Add subtle parallax on hero photos
- Stagger animations on grid items as they enter viewport
- Loading skeleton shimmer effect (currently static)

### G. Accessibility & Polish
- Visible focus rings on all interactive elements (terracotta outline)
- Increase tap targets to min 44px on mobile
- Add `prefers-reduced-motion` support for motion components

---

## Files to Modify

**Major rewrite:**
- `src/components/InteractiveProvinceMap.tsx` — proper Nepal SVG with 7 province paths

**Theme/global:**
- `src/index.css` — color refinements, gradient utilities, focus rings, divider styles
- `tailwind.config.ts` — add gradient-warm utility, refined shadow tokens

**Component polish:**
- `src/components/HeroSection.tsx` — mountain silhouette, scroll indicator
- `src/components/FeaturedHomestays.tsx` — card hover upgrades, ribbons
- `src/components/ExperienceBadges.tsx` — colored backgrounds per badge type
- `src/components/TrustStrip.tsx` — animated counters
- `src/components/PartnersSection.tsx` — styled logo cards
- `src/components/TestimonialsSection.tsx` — quote SVG, layout variation
- `src/components/ImpactSection.tsx` — animated progress visuals
- `src/components/Footer.tsx` — Nepal pride strip
- `src/components/HomestayCardSkeleton.tsx` — shimmer effect

**New utility component:**
- `src/components/SectionDivider.tsx` — reusable mountain/mandala dividers

---

## Approach
All changes are **frontend-only**, additive, and use existing design tokens. No data structure changes. Motion respects `prefers-reduced-motion`. The Nepal map uses an accurate simplified SVG (lightweight, no external map library needed).

