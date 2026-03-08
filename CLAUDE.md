# carlotasoto.com — Project Reference

## Stack
- **Framework**: Next.js 14 (App Router), React 18, TypeScript 5
- **Styling**: Plain CSS only — `app/globals.css`. No Tailwind, no CSS modules, no styled-components.
- **Image lightbox**: `lightgallery` v2.8.2
- **Package manager**: npm (package-lock.json present)
- **Deploy target**: Vercel (implied by .gitignore)

## i18n
- Languages: `en` (English), `fr` (French)
- Pattern: `app/[lang]/` — all routes are under this segment
- Dictionaries: `app/lib/dictionaries/en.ts`, `fr.ts`, `index.ts`
- `getDictionary(lang)` returns the full dict (sync, no async needed)
- `Lang` type = `"en" | "fr"` — imported from `app/lib/dictionaries`
- Root `app/page.tsx` redirects `/` → `/en`
- All pages call `generateStaticParams()` returning `[{lang:"en"},{lang:"fr"}]`
- Language switcher: `app/components/LanguageSwitcher.tsx` (client) — reads `usePathname()`, swaps lang segment
- To add a language: add a file in `app/lib/dictionaries/` and add it to the `dictionaries` map in `index.ts`

## Project Structure
```
app/
  layout.tsx              # Root layout — fonts, globals.css (no Header/Footer here)
  page.tsx                # Redirects / → /en
  globals.css             # All styles — single CSS file, BEM-ish class names
  [lang]/
    layout.tsx            # Lang layout — Header + Footer with dict props
    page.tsx              # Home page (Server Component)
    gallery/
      page.tsx            # All works with search
      illustrations/page.tsx
      digital-art/page.tsx
      paintings/page.tsx
      sketches/page.tsx
    shop/page.tsx
  components/
    Header.tsx            # "use client" — accepts dict+lang props, scroll/mobile menu
    Footer.tsx            # "use client" — deep-link handling for Instagram/TikTok
    LightboxGrid.tsx      # "use client" — dynamic import of lightgallery/react
    SearchableGallery.tsx # "use client" — search input + LightboxGrid
    LanguageSwitcher.tsx  # "use client" — EN/FR toggle via usePathname
  sections/
    HeroSection.tsx       # Accepts dict["hero"]
    AboutSection.tsx      # Accepts dict["about"] + lang
    GallerySection.tsx    # Accepts dict["gallery"] (not used on home currently)
    NarrativeSection.tsx  # (not used currently)
  data/
    artworks.ts           # All artwork data — primaryWorks, altWorks, narrativeWorks, sketchWorks, allWorks
  lib/
    cn.ts                 # Minimal class-name helper
    constants.ts          # CONTACT_EMAIL, CONTACT_EMAIL_MAILTO
    dictionaries/
      en.ts               # English strings (source of truth / Dictionary type)
      fr.ts               # French strings
      index.ts            # getDictionary(), isValidLang(), Lang type
public/
  assets/images/          # Logo, hero bg, signature, profile pic
  artworks/               # Artwork images — all kebab-case, no spaces
  fonts/                  # TheSeasons.woff2 + .woff (custom font)
```

## Design Tokens (CSS variables)
```css
--bg: #eae8ef          /* page background */
--panel: #f7f2f8       /* panel/card background */
--ink: #1d1417         /* primary text */
--muted: #453a40       /* secondary text */
--border: #cbbbd3
--accent: #b88ac7      /* hover/interactive purple */
--accent-2: #d4b2d9
--shadow: 0 24px 60px rgba(43,21,45,0.16)
--shadow-soft: 0 10px 30px rgba(43,21,45,0.08)
```

## Fonts
| CSS variable      | Google Font          | Use                        |
|-------------------|----------------------|----------------------------|
| `--font-display`  | Playfair Display     | Section titles, card titles |
| `--font-serif`    | Cormorant Garamond   | Body, nav                  |
| `--font-sans`     | Manrope              | UI labels, meta, kickers   |
| `--font-script`   | Caveat               | Handwritten accent         |
| `--font-seasons`  | TheSeasons (local)   | Hero title, hero subtitle  |

## Artwork Data Shape
```ts
type Artwork = {
  title: string;
  slug: string;
  medium?: string;
  size?: string;
  image?: string;       // path under /public
  palette?: string[];
  description?: string;
};
```
Data exports: `primaryWorks` (paintings) · `altWorks` (illustrations) · `narrativeWorks` (digital-art) · `sketchWorks` · `allWorks` (all combined)

## Key Patterns
- CSS class naming: BEM-ish — `section-title`, `art-card__visual`, `site-header--bg`
- All pages use `with-header-offset` class on `<main>` for fixed-header clearance (except home which uses `homepage` wrapper + full hero)
- `"use client"` components: Header, Footer, LightboxGrid, GallerySection, gallery/page.tsx, gallery/sketches/page.tsx
- Images use native `<img>` (not Next.js `<Image>`), especially inside LightboxGrid where lightgallery controls the `<a>` wrapper
- Path alias `@/*` → `./*` (from tsconfig)

---

## Issues & Optimization Notes

### Open
- **`GallerySection` and `NarrativeSection` exist in `sections/`** but are not rendered on `app/page.tsx` — verify if intentionally removed or planned for the home page later.
- **`digital-art/page.tsx` uses `narrativeWorks`** — naming mismatch between route and data key. Not a bug but worth renaming when data is restructured.
- **`about-visual` is a CSS background-image div** — has `aria-label` already; consider adding `role="img"` for stricter accessibility.

### Fixed ✓
- Image paths renamed to kebab-case (no spaces, lowercase extensions)
- Unused `cn` import removed from `AboutSection.tsx`
- Dead `heroPalette` export removed from `artworks.ts`
- Duplicate search logic extracted to `app/components/SearchableGallery.tsx`
- `"use client"` removed from `gallery/sketches/page.tsx`
- `LightboxGrid` `as any` replaced with `ComponentType<LightGalleryProps>`
- Metadata added to all subpages (gallery/*, shop)
- Root metadata description updated (was placeholder text)
- TikTok footer link given `aria-label="TikTok"`
- Unused remote image patterns removed from `next.config.mjs`
- `about-grid` CSS fixed to 2 columns (was 3, only 2 children)

## Commands
```bash
npm run dev    # local dev server
npm run build  # production build
npm run lint   # ESLint
```
