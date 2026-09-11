/* ---------------------------------------------------------------
   Blake Jordan — content + router
   Everything on the site is driven by the data below. To add a
   project, add an entry to `projects`; to swap an image, drop the
   file into /assets and point `src` at it.

   `crop` is optional: it forces an aspect ratio and fills it with
   object-fit: cover, so the source file is never modified. Use it to
   trim letterboxing or to match the framing in the mockups; `pos`
   moves the crop window (any object-position value).
   --------------------------------------------------------------- */

const site = {
  name: ["Blake", "Jordan"],
  mark: { src: "assets/mark-spiral.png", w: 426, h: 426, alt: "Hand-drawn spiral" },
  about: {
    text: [
      "Multidisciplinary artist working with auditory and visual media.",
      "Interactive Technology and Design Master\u2019s student.",
      "Residing in Copenhagen."
    ],
    email: "blakejordan@email.dk"
  }
};

const projects = [
  {
    slug: "tacet-vr",
    title: "Tacet VR",
    mediaWidth: "clamp(14rem, 17vw, 19rem)",
    media: [
      { type: "image", src: "assets/tacet-vr-1.png", w: 262, h: 257, alt: "Glowing hands reaching out of darkness" },
      { type: "image", src: "assets/tacet-vr-2.png", w: 262, h: 195, alt: "Rehearsal on a darkened stage" },
      { type: "image", src: "assets/tacet-vr-3.png", w: 262, h: 257, alt: "Lit forms in a dark virtual landscape" }
    ],
    text: [
      "What happens when stories break the confines of their medium to pursue a new reality?",
      "Tacet VR is built upon the short film Tacet by director Ahmed El Kholy, to challenge the classical narrative structure and experiment with the audience as the driving force of its progression.",
      "Developed in collaboration with Kholy, the experience allow for players to embody the film\u2019s main character on a journey through the unknown and the uncertain."
    ]
  },
  {
    slug: "ipasif",
    title: "IPASIF",
    mediaWidth: "clamp(15rem, 24vw, 26rem)",
    media: [
      { type: "image", src: "assets/ipasif-1.jpg", w: 1400, h: 787, alt: "Two figures before a projected blue visual" },
      { type: "image", src: "assets/ipasif-2.jpg", w: 1400, h: 758, alt: "Sensor enclosures and the control box, seen from above" },
      { type: "image", src: "assets/ipasif-3.png", w: 1200, h: 691, alt: "The Pure Data control interface" }
    ],
    text: [
      "An interactive proof of concept created in collaboration with sound artist Lars Greve and play director Tina Tarpgaard.",
      "At the intersection of technology and artistry we sought to find a common language and demonstrate the capabilities of tangible and digital interfaces within creation.",
      "A modular framework that allowed artists to grasp the possibilities of working with an instrument beyond their immediate abilities."
    ]
  },
  {
    slug: "spellbound",
    title: "SpellBound",
    mediaWidth: "clamp(15rem, 21vw, 23rem)",
    media: [
      { type: "image", src: "assets/spellbound-1.jpg", w: 1400, h: 786, alt: "Low-poly daylight game level" },
      { type: "image", src: "assets/spellbound-2.jpg", w: 1271, h: 1400, alt: "CAD render of the controller housing" },
      { type: "image", src: "assets/spellbound-3.jpg", w: 1400, h: 785, alt: "Night-time castle level with a glowing rune" }
    ],
    text: [
      "SpellBound was created to investigate collaborative tendencies in video games.",
      "Together players must cast spells consisting of combinations of symbols unique to their controller. The act of teamwork was intended to bring the players closer together and create trust between them.",
      "Designed on the principles of the classic arcade game Time Crisis, players are moved through the landscape facing levels increasing difficulty."
    ]
  },
  {
    slug: "b2b",
    title: "B2B",
    mediaWidth: "clamp(16rem, 28vw, 31rem)",
    media: [
      { type: "video", src: "assets/b2b-1.mp4", poster: "assets/b2b-1-poster.jpg", ar: "16 / 9" }
    ],
    text: [
      "Through B2B, Blake Jordan and close collaborator, Ahmed El Kholy, explore their shared language in film and sound with these short vignettes."
    ]
  }
];

/* --- routing ---------------------------------------------------- */

const THEMES = { home: "gray", work: "light", project: "light", about: "dark" };

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!raw) return { view: "home" };
  const parts = raw.split("/");
  if (parts[0] === "about") return { view: "about" };
  if (parts[0] === "work") {
    if (!parts[1]) return { view: "work" };
    const project = projects.find(p => p.slug === parts[1]);
    if (project) return { view: "project", project };
    return { view: "work" };
  }
  return { view: "home" };
}

/* --- rendering -------------------------------------------------- */

const el = {
  layout: document.getElementById("layout"),
  nav: document.getElementById("nav"),
  media: document.getElementById("media"),
  copy: document.getElementById("copy"),
  ghosts: document.getElementById("ghosts")
};

function link(href, label, current) {
  const a = document.createElement("a");
  a.className = "link" + (current ? " is-current" : "");
  a.href = href;
  a.textContent = label;
  if (current) a.setAttribute("aria-current", "page");
  return a;
}

function renderNav(route) {
  el.nav.replaceChildren();

  const name = document.createElement("a");
  name.className = "nav__name link" + (route.view === "home" ? " is-current" : "");
  name.href = "#/";
  name.append(site.name[0], document.createElement("br"), site.name[1]);
  if (route.view === "home") name.setAttribute("aria-current", "page");
  el.nav.append(name);

  // The work row splits around the active item so that the active
  // item always sits in the main column, as in the mockups.
  const before = document.createElement("div");
  before.className = "nav__before";
  const after = document.createElement("div");
  after.className = "nav__after";

  const workLink = link("#/work", "Work", route.view === "work");

  if (route.view === "project") {
    before.append(workLink);
    projects.forEach(p => {
      if (p.slug === route.project.slug) after.append(link("#/work/" + p.slug, p.title, true));
    });
  } else if (route.view === "work") {
    after.append(workLink);
    projects.forEach(p => after.append(link("#/work/" + p.slug, p.title, false)));
  } else {
    after.append(workLink);
  }

  const about = link("#/about", "About", route.view === "about");
  about.classList.add("nav__about");

  el.nav.append(before, after, about);
}

/* --- front-page mark ---------------------------------------------
   The spiral sits in the orientation it was drawn in and turns left while
   a nav item is hovered — 30° for Work, 60° for About — easing back to
   rest once neither is. Keyboard focus drives it the same way. Only ever
   running on the front page. */

const REST = 0;         /* degrees; the orientation the mark was drawn in */

const TILT = {          /* degrees by href; negative turns left */
  "#/work": -30,
  "#/about": -60
};

const EASE = 0.12;      /* 0 = never arrives, 1 = jumps straight there */
const SETTLED = 0.05;   /* degrees; below this the loop parks */
const REGRIP = 140;     /* ms of grace before returning to rest, so moving
                           from Work to About doesn't bounce back on the
                           way across the gap */

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
let spin = null;

function stopSpin() {
  if (!spin) return;
  cancelAnimationFrame(spin.frame);
  clearTimeout(spin.timer);
  spin.unbind();
  spin = null;
}

function startSpin(img) {
  stopSpin();
  img.style.transform = `rotate(${REST}deg)`;
  if (reduceMotion.matches) return;

  const s = { angle: REST, target: REST, frame: 0, timer: 0, unbind: null };

  const run = () => {
    const delta = s.target - s.angle;
    if (Math.abs(delta) < SETTLED) {   // arrived — park until the next hover
      s.angle = s.target;
      s.frame = 0;
    } else {
      s.angle += delta * EASE;
      s.frame = requestAnimationFrame(run);
    }
    img.style.transform = `rotate(${s.angle.toFixed(2)}deg)`;
  };

  const aim = (deg) => {
    clearTimeout(s.timer);
    s.target = deg;
    if (!s.frame) s.frame = requestAnimationFrame(run);   // 0 means idle
  };

  const release = () => {
    clearTimeout(s.timer);
    s.timer = setTimeout(() => aim(REST), REGRIP);
  };

  const undo = [];
  el.nav.querySelectorAll("a").forEach(a => {
    const deg = TILT[a.getAttribute("href")];
    if (deg === undefined) return;

    const on = () => aim(deg);
    a.addEventListener("pointerenter", on);
    a.addEventListener("pointerleave", release);
    a.addEventListener("focus", on);
    a.addEventListener("blur", release);
    undo.push(() => {
      a.removeEventListener("pointerenter", on);
      a.removeEventListener("pointerleave", release);
      a.removeEventListener("focus", on);
      a.removeEventListener("blur", release);
    });
  });

  s.unbind = () => undo.forEach(fn => fn());
  spin = s;
}

/* Intrinsic size, so the browser reserves the right-shaped box before the
   file arrives. Without it the media column collapses to nothing and then
   snaps open as each image decodes, shunting the copy column as it goes.
   CSS still drives the rendered size — these only supply the ratio. */
function setBox(img, item) {
  if (!item.w || !item.h) return;
  img.width = item.w;
  img.height = item.h;
}

function renderMedia(route) {
  stopSpin();
  el.media.replaceChildren();
  el.media.className = "media";
  el.media.style.removeProperty("--project-media-w");

  if (route.view === "home") {
    el.media.className = "mark";
    const img = document.createElement("img");
    img.src = site.mark.src;
    img.alt = site.mark.alt;
    setBox(img, site.mark);
    img.addEventListener("error", () => img.replaceWith(placeholder(site.mark.src, "1 / 1")));
    el.media.append(img);
    el.media.hidden = false;
    startSpin(img);
    return;
  }

  if (route.view !== "project") { el.media.hidden = true; return; }

  if (route.project.mediaWidth) {
    el.media.style.setProperty("--project-media-w", route.project.mediaWidth);
  }

  route.project.media.forEach(item => {
    if (item.type === "video") {
      const v = document.createElement("video");
      v.src = item.src;
      if (item.poster) v.poster = item.poster;
      v.autoplay = true; v.loop = true; v.muted = true;
      v.playsInline = true; v.controls = true;
      if (item.crop) { v.style.aspectRatio = item.crop; v.style.objectFit = "cover"; }
      else if (item.ar) v.style.aspectRatio = item.ar;
      v.addEventListener("error", () => v.replaceWith(placeholder(item.src, item.crop || item.ar)));
      el.media.append(v);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "";
      img.loading = "lazy";
      setBox(img, item);
      if (item.crop) {
        img.style.aspectRatio = item.crop;
        img.style.objectFit = "cover";
        if (item.pos) img.style.objectPosition = item.pos;
      }
      img.addEventListener("error", () => img.replaceWith(placeholder(item.src, item.crop || item.ar)));
      el.media.append(img);
    }
  });
  el.media.hidden = false;
}

function placeholder(src, ar) {
  const div = document.createElement("div");
  div.className = "placeholder";
  if (ar) div.style.setProperty("--ar", ar);
  div.textContent = src;
  return div;
}

function renderCopy(route) {
  el.copy.replaceChildren();

  if (route.view === "about") {
    site.about.text.forEach(t => {
      const p = document.createElement("p");
      p.textContent = t;
      el.copy.append(p);
    });
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.className = "email";
    a.href = "mailto:" + site.about.email;
    a.textContent = site.about.email;
    p.append(a);
    el.copy.append(p);
    el.copy.hidden = false;
    return;
  }

  if (route.view !== "project") { el.copy.hidden = true; return; }

  route.project.text.forEach(t => {
    const p = document.createElement("p");
    p.textContent = t;
    el.copy.append(p);
  });
  el.copy.hidden = false;
}

function titleFor(route) {
  if (route.view === "project") return route.project.title + " — Blake Jordan";
  if (route.view === "work") return "Work — Blake Jordan";
  if (route.view === "about") return "About — Blake Jordan";
  return "Blake Jordan";
}

let current = null;
let pending = 0;

const FADE_MS = 180;   /* media/copy cross-fade, matches .layout in styles.css */
const SLIDE_MS = 500;  /* nav slide, matches --slide in styles.css */

/* --- nav transitions ---------------------------------------------
   The nav is rebuilt from scratch on every route change, so its links
   can't simply transition from one layout to the next. Measure where
   each one sat beforehand, then invert-and-play (FLIP): "Work" and the
   selected project slide to their new places, and the names that
   dropped out of the row fade out where they stood. */

function measureNav() {
  const before = new Map();
  el.nav.querySelectorAll("a").forEach(a => {
    before.set(a.getAttribute("href"), {
      rect: a.getBoundingClientRect(),
      node: a.cloneNode(true),
      // The ghost layer is outside .nav, so the padding rules there don't
      // reach it. Carry the real padding across, or the clone renders its
      // text tight to a box that was measured with padding — and every
      // name that drops out visibly hops up and left as it fades.
      pad: getComputedStyle(a).padding
    });
  });
  return before;
}

function playNav(before) {
  const kept = new Set();

  el.nav.querySelectorAll("a").forEach(a => {
    const href = a.getAttribute("href");
    kept.add(href);
    const was = before.get(href);

    if (!was) {                    // wasn't on the last page — fade it in
      a.style.transition = "none";
      a.style.opacity = "0";
      void a.offsetWidth;
      a.style.transition = "";
      a.style.opacity = "";
      return;
    }

    const now = a.getBoundingClientRect();
    const dx = was.rect.left - now.left;
    const dy = was.rect.top - now.top;
    if (!dx && !dy) return;        // name and About never move

    a.style.transition = "none";   // invert: put it back where it was
    a.style.transform = `translate(${dx}px, ${dy}px)`;
    void a.offsetWidth;            // flush that, then let CSS play it out
    a.style.transition = "";
    a.style.transform = "";
  });

  before.forEach((was, href) => {
    if (kept.has(href)) return;
    const g = was.node;
    g.removeAttribute("aria-current");
    g.style.padding = was.pad;
    g.style.margin = "0";          // left/top place the box directly
    g.style.left = was.rect.left + "px";
    g.style.top = was.rect.top + "px";
    el.ghosts.append(g);
    void g.offsetWidth;
    g.style.opacity = "0";
    setTimeout(() => g.remove(), SLIDE_MS);
  });
}

/* --- render ------------------------------------------------------ */

function render() {
  const route = parseRoute();
  document.body.dataset.theme = THEMES[route.view];
  document.body.dataset.view = route.view;
  document.body.dataset.content = route.view;
  document.title = titleFor(route);
  renderNav(route);
  renderMedia(route);
  renderCopy(route);
  current = route;
}

function navigate() {
  if (!current) { render(); return; }

  const route = parseRoute();
  const before = measureNav();

  // Nav and palette change on the click, so the row starts moving at once.
  // data-content is deliberately left alone here — see styles.css.
  document.body.dataset.theme = THEMES[route.view];
  document.body.dataset.view = route.view;
  document.title = titleFor(route);
  renderNav(route);
  playNav(before);

  // Media and copy cross-fade underneath it.
  const token = ++pending;
  el.layout.classList.add("is-leaving");
  setTimeout(() => {
    if (token !== pending) return;   // a newer click already took over
    document.body.dataset.content = route.view;
    renderMedia(route);
    renderCopy(route);
    el.layout.classList.remove("is-leaving");
    current = route;
  }, FADE_MS);
}

window.addEventListener("hashchange", navigate);
render();
