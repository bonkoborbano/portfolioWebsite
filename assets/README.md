# Assets

Sources came from `~/Desktop/Portfolio` and were re-encoded for the web
(max 1400px on the long edge, JPEG q80–82, EXIF stripped). Total ~2.2 MB,
down from ~9.5 MB. The originals on the Desktop were not modified.

| File | Where | Notes |
|---|---|---|
| `mark-spiral.png` | Front page | kept as PNG for its transparency |
| `tacet-vr-1..3.png` | Tacet VR | supplied pre-cropped — no CSS crop applied |
| `ipasif-1.jpg` | IPASIF | |
| `ipasif-2.jpg` | IPASIF | rotated 90° CW to match the mockup |
| `ipasif-3.png` | IPASIF | kept as PNG — it's a diagram with fine text |
| `spellbound-1..3.jpg` | SpellBound | |

## Still missing

- `b2b-1.mp4` — the B2B vignette. Renders as a dashed placeholder until
  it's here.
- `b2b-1-poster.jpg` — optional still frame shown before the video plays.

## Resolution

The Tacet VR images are 262px wide and the column renders at roughly
245px, so they're sharp at 1x but slightly soft on a retina screen. If
you have the crops at ~600px wide, drop them in over the same filenames
and nothing else needs to change.

## Dimensions

Each entry in `app.js` carries the file's intrinsic `w` and `h`. They're
emitted as `width`/`height` attributes so the browser reserves a
correctly-shaped box before the image downloads — without them the media
column collapses to nothing and snaps open as each file decodes, shoving
the copy column sideways as it goes.

CSS still controls the rendered size; these only supply the ratio. **If
you swap an image for one with a different shape, update `w` and `h` to
match**, or the reserved box will be the wrong shape and the layout will
jump again. `sips -g pixelWidth -g pixelHeight <file>` reads them.

## Cropping

No crop is baked into the files. `crop` in `app.js` sets an aspect ratio
and fills it with `object-fit: cover`; `pos` moves the crop window. So
reframing is a one-line change and the pixels stay intact — e.g.
`crop: "4 / 3"` plus `pos: "center 60%"` would reframe a portrait source
to landscape without touching the file.

Note `sips -r` on macOS writes an EXIF orientation tag instead of rotating
pixels, which browsers then apply a second time. If you rotate anything
here, re-encode and strip EXIF afterwards.
