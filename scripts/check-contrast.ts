import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const hex = (value: string) => { const match = value.match(/#([0-9a-f]{6})/i); if (!match) throw new Error(`Expected a hex token, got ${value}`); return match[1].match(/.{2}/g)!.map((part) => Number.parseInt(part, 16) / 255); };
const luminance = (value: string) => { const [r, g, b] = hex(value).map((channel) => channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; };
const ratio = (foreground: string, background: string) => { const a = luminance(foreground); const b = luminance(background); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
function token(theme: 'light' | 'dark', name: string) { const block = theme === 'light' ? css.split(':root[data-theme=dark]')[0] : css.split(':root[data-theme=dark]')[1]; const match = block.match(new RegExp(`--${name}:([^;]+)`)); if (!match) throw new Error(`Missing ${theme} token --${name}`); return match[1].trim(); }
const pairs = [['text', 'bg', 4.5], ['text', 'surface', 4.5], ['text-muted', 'bg', 4.5], ['text-subtle', 'bg', 4.5], ['accent-text', 'bg', 4.5], ['teal-text', 'bg', 4.5], ['text-on-accent', 'accent', 3]] as const;
let failed = false;
for (const theme of ['light', 'dark'] as const) { console.log(`\n${theme.toUpperCase()}`); for (const [fg, bg, minimum] of pairs) { const value = ratio(token(theme, fg), token(theme, bg)); const pass = value >= minimum; console.log(`${fg} on ${bg}: ${value.toFixed(2)}:1 (min ${minimum}:1) ${pass ? 'PASS' : 'FAIL'}`); if (!pass) failed = true; } }
if (failed) process.exit(1);
