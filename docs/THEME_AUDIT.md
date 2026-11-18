# Theme audit

The initial audit found hardcoded colours in the legacy `src/extra-pages.css`, `src/directory-pages.css`, legacy page JSX, the previous logo stylesheet, and the previous one-off frontend stylesheet. The unused legacy page files were removed. The active frontend now centralizes UI colours in `src/styles.css` tokens and uses CSS variables for poster/tile accents.

Changed in the theme rebuild:

- `index.html`: pre-paint theme script, color-scheme metadata, dynamic theme-color metadata.
- `src/theme.js`: two-mode store, localStorage, OS-based first-visit default, cross-tab sync, resolved theme application.
- `src/main.jsx`: accessible toggle, keyboard shortcut, live announcement, semantic accent data.
- `src/styles.css`: light/dark token system, contrast-safe components, forced-colors, high-contrast, reduced-motion, print rules.
- `src/Logo.jsx`, `src/logo.css`, `public/showscout-mark.png`: theme-aware logo lockup.
- Removed unused legacy hardcoded-color page styles.

Remaining non-token colour values are limited to static PWA/offline metadata and the token declarations themselves.
