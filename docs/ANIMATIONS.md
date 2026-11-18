# Motion tokens

Motion is deliberately subtle on the comparison surface: transform and opacity only, no layout-thrashing effects.

```css
--ease-out-expo: cubic-bezier(.16,1,.3,1);
--duration-fast: 120ms;
--duration-standard: 200ms;
--duration-slow: 320ms;
```

The frontend disables large movement when `prefers-reduced-motion` is enabled. Future map, seat-map, and page-transition work should preserve this rule.
