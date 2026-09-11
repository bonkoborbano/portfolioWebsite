# Blake Jordan — portfolio

Static site built from the Figma mockups. No build step, no dependencies —
plain HTML, CSS and one JS file, so it can be dropped on any host
(Netlify, GitHub Pages, a folder on a server).

## Run it

```bash
python3 -m http.server 4321
```

Then open <http://localhost:4321>.

## Deploying to GitHub Pages

Nothing to build — the repo *is* the site. Push it, then in the repo's
**Settings → Pages**, set Source to *Deploy from a branch* and pick
`main` / `/ (root)`. It's live a minute or so later at
`https://<user>.github.io/<repo>/`.

Every path in the site is relative, so it works served from a subpath
(a project page) or from the domain root (a `<user>.github.io` repo or a
custom domain) with no changes. Routing is all in the URL hash, so there
are no server rewrites to configure and no 404 fallback to set up.

`.nojekyll` tells Pages to serve the files verbatim rather than running
them through Jekyll.

Favicon paths are relative like everything else, so they resolve on a
project subpath. Regenerate them from the spiral with
`sips -Z <size> assets/mark-spiral.png --out icons/<name>.png`.

**Before making the repo public**, see the licensing note in
`fonts/README.md` — the bundled Söhne file is a trial cut licensed for
personal use, and publishing the site serves it to every visitor.

## Files

| File | What's in it |
|---|---|
| `index.html` | Shell — one `<main>` the router fills in |
| `styles.css` | All layout, the three page palettes, responsive rules |
| `app.js` | Page copy, project list, and the hash router |
| `assets/` | Photos and video — see `assets/README.md` |
| `icons/` | Favicons, downscaled from `assets/mark-spiral.png` |
| `fonts/` | Söhne Buch — see `fonts/README.md` |

## Routes

`#/` front page · `#/work` project index · `#/work/<slug>` project · `#/about`

## How the layout works

The nav is pinned (`position: fixed`, vertically centred at `--name-x`),
so "Blake Jordan", "Work" and "About" hold exactly the same spot on every
page — nothing shifts as you move between them. Media and copy are
centred in the space left over to its right.

The nav itself is a two-column grid, and the "Work" row splits around the
active item so the active item always lands in the main column — which is
why "Work" slides into the left gutter once you open a project, exactly as
in the mockups.

Below 900px the nav returns to normal flow and everything stacks.

Nav links carry padding with an equal negative margin: the target grows,
the text stays put. `.nav__about` also needs `justify-self: start`, or as
a grid item it stretches to the full column width and ends up with a hit
area twice its own word — which made the front-page spiral look like it
only responded to About.

Backgrounds are per-view (`gray` / `light` / `dark`) and cross-fade on
navigation.

## The spiral

The mark sits in the orientation it was drawn in and turns left while a
nav item is hovered — 30° for Work, 60° for About — easing back to rest
once neither is. Keyboard focus drives it the same way, so it isn't
mouse-only.

The three angles are `REST` and `TILT` in `app.js`, keyed by href.
Negative turns left. An item not in `TILT` leaves the mark alone, which is
why the name does nothing.

`REGRIP` holds off the return to rest for a moment, so moving from Work
to About doesn't bounce back toward zero while the pointer crosses the gap
between them.

`EASE` is how quickly it arrives — raise toward 1 for snappier, lower for
heavier. The rAF loop parks once the angle settles (`frame` back to 0) and
restarts on the next hover, so an idle front page isn't running a frame
loop. It only exists on the front page at all: `renderMedia()` stops it
and unbinds its listeners on every route change. Reduced-motion users get
a static mark.

## The work row

Picking a project slides the row into place rather than redrawing it:
"Work" moves out into the gutter, the selected name slides across to the
name column, and the names that drop out fade where they stood.

The nav is rebuilt on every route change, so the links can't just
transition. `measureNav()` records each link's box first, then `playNav()`
inverts and plays it (FLIP) — each link is snapped back to its old
position with transitions off, then released. Links that left the DOM are
cloned into `#ghosts`, a fixed full-screen layer, and faded out in place.

The ghost layer sits outside `.nav`, so the nav's padding rules don't
reach it. `measureNav()` carries each link's computed padding across and
`playNav()` reapplies it, because the ghost is positioned by a box that
was measured *with* padding — without it every name that drops out hops up
and left as it starts to fade.

The nav starts moving on the click; media and copy cross-fade under it
(`FADE_MS`) so the two don't compete. That split is why the geometry
tokens live on two separate body attributes: `data-view` drives the nav
and flips immediately, `data-content` drives `--col-gap` and flips later,
with the content swap. Flipping `--col-gap` on the click re-centres
`.layout` while the outgoing photos are still fully visible, so they jump
sideways before fading — 65px at a 1440px viewport. Keep anything that
affects the media or copy columns on `data-content`. Both durations are mirrored in
`styles.css` (`--slide`, `.layout`) — change them in pairs. Reduced-motion
users get the end state with no animation.

## Editing content

Everything is in the `site` and `projects` objects at the top of `app.js`.
Adding a project means adding one entry — the index, route, title and
media column all follow from it. `mediaWidth` sets that project's image
column width, matched to the mockup.
