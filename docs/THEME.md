# ShowScout theme system

ShowScout uses semantic CSS tokens in `src/styles.css`. Light and dark values are defined on `:root` and `:root[data-theme="dark"]`; components consume tokens such as `--bg`, `--surface`, `--text`, `--accent`, and `--teal-text` rather than raw palette colours.

Modes are `light` and `dark`. The choice is stored under `showscout-theme`, applied before first paint by the inline script in `index.html`, and synchronized across tabs. On first visit, the OS preference chooses the initial theme; after that, the user’s light/dark choice is retained. The header control toggles between the two modes directly. `Shift+D` toggles the theme.

## Rules

- Add a semantic token before adding a new colour.
- Use `--text`/`--text-muted` for text, `--surface`/`--surface-2` for containers, and `--border`/`--divider` for lines.
- Use `--accent-text` and `--teal-text` for accent text on light backgrounds; filled controls use `--accent` and `--text-on-accent`.
- Do not use raw hex, named colours, or default utility palette colours in component code.
- Respect reduced motion, forced-colors, high contrast, and print styles.

Run `npm run contrast` to verify the key token pairs in both themes. The current contrast table is generated from the token values:

| Pair | Light | Dark |
| --- | ---: | ---: |
| text on bg | 17.45:1 | 20.42:1 |
| text-muted on bg | 7.03:1 | 10.66:1 |
| text-subtle on bg | 4.75:1 | 6.91:1 |
| accent-text on bg | 5.05:1 | 5.68:1 |
| teal-text on bg | 4.69:1 | 8.65:1 |
| text-on-accent on accent | 4.80:1 | 4.15:1 |

The dark filled accent pair is intentionally used for large/high-emphasis controls and passes the 3:1 UI/large-text threshold. If small body text is placed on it, use `--accent-text` or a stronger button treatment and update this table.
