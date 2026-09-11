# Font

`sohne-buch.otf` — Söhne Buch (Book), from the family you supplied.
Declared in `styles.css` as the family `Sohne`, with Helvetica Neue /
Arial as the fallback stack.

The file is only 14 KB, so it's served as OTF directly; converting to
WOFF2 would save very little. If you'd rather have WOFF2 anyway, it needs
`fonttools` + `brotli`, which aren't installed on this machine.

## Licensing

These are the **trial** cuts (`TestSohne-*`), and the folder they came
from ships a "Personal Use Only" licence. That covers local development,
but publishing the site with this file embedded would need a webfont
licence from Klim Type Foundry. Worth sorting before it goes live —
until then the fallback stack renders the site fine.
