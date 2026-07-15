import {
  animate,
  createTimeline,
  stagger,
  splitText,
  utils,
} from "https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm";

/* ════════════════════════════════════════════════════════════
   DEMO MODE

   true  — every slot is filled with placeholder content so the
           design can be judged without orange TK chips in the
           way. NOT SHIPPABLE. Nothing here is a band fact.
   false — real content only. Anything still missing shows a
           loud orange TK chip, so it can't ship unfinished.

   The placeholders are deliberately unconvincing — Doe and Roe
   names, "City, ST", "Working Title", copy that announces what
   it is. That is not laziness, it's the point. An earlier
   version of this site invented a record called "Midnight Tide",
   a full four-person roster, and seven tour dates. It read as
   real, survived into git history, and was later mistaken for
   fact. Placeholder content must never be plausible.
   ════════════════════════════════════════════════════════════ */
const DEMO = true;
/* ════════════════════════════════════════════════════════════
   CONTENT — the only part you need to edit.
   Everything below the CONTENT block is machinery.

   "TK" is a newsroom mark for "to come". Leave a field as "TK"
   (or null) and it renders as an orange chip when DEMO is off.
   ════════════════════════════════════════════════════════════ */

const REAL = {
  /* NOTICES — announcements, newest first. Sits under the
     waterline. Keep it to 1–3; it's a notice board, not a feed.
     An empty array [] renders a prompt. */
  notices: [],

  /* SHOWS — soonest first. Empty renders the "no dates" state,
     which is true right now, so it ships. */
  shows: [],

  /* LIVE — photos from stage. The Live section stays hidden
     until at least one entry has a real src, so there are never
     empty frames waiting on files. Landscape crops best. */
  live: [],

  /* THE RECORD */
  record: {
    blurb: "TK",                             // what it sounds like, where, with whom
    title: "TK",
    studio: "TK",
    out: "TK",
  },

  /* THE BAND */
  band: {
    since: "TK",                             // e.g. "2023"
    bio1: "TK",
    bio2: "TK",
  },

  /* PEOPLE — add or remove freely; the grid adapts. */
  members: [
    { name: "TK", role: "TK", photo: null },
    { name: "TK", role: "TK", photo: null },
    { name: "TK", role: "TK", photo: null },
    { name: "TK", role: "TK", photo: null },
  ],

  /* ELSEWHERE */
  links: [
    { label: "Instagram", href: "TK" },
    { label: "Bandcamp", href: "TK" },
    { label: "Booking", href: "TK" },
  ],
};

/* Placeholder only. See DEMO MODE above. None of this is true. */
const PLACEHOLDER = {
  /* Three so the gallery can be judged with something to page
     through. The first is true; the other two announce themselves
     as placeholder in their own text, per the rule above. The photo
     is the only real one there is — it is reused here to prove the
     layout, which is exactly what DEMO is for and exactly what must
     never reach REAL. */
  notices: [
    {
      date: "14 Jul 2026",
      kind: "Record",
      text: "We're recording our first record.",
      cta: "What we know",
      href: "#record",
      image: { src: "assets/images/notices/01-1200.webp", alt: "Something Blue on stage" },
    },
    {
      date: "02 Jun 2026",
      kind: "News",
      text: "Placeholder notice. A second announcement sits here, about this long.",
      cta: null,
      href: null,
      image: { src: "assets/images/notices/02-1200.webp", alt: "Something Blue on stage" },
    },
    {
      date: "18 Apr 2026",
      kind: "Show",
      text: "Placeholder notice. This one has no picture, to prove a card without one still works.",
      cta: "Placeholder link",
      href: "#",
      image: null,
    },
  ],

  shows: [
    { date: "12 Sep", city: "City, ST", venue: "Venue Name", href: "#", sold: false },
    { date: "04 Oct", city: "City, ST", venue: "Venue Name", href: "#", sold: true },
    { date: "22 Nov", city: "City, ST", venue: "Venue Name", href: "#", sold: false },
  ],

  live: [],

  record: {
    blurb:
      "Placeholder copy. This is where the record's story goes — what it sounds like, " +
      "where it's being tracked, and who's making it with you. A paragraph about this " +
      "long sits well in this column.",
    title: "Working Title",
    studio: "Studio Name",
    out: "Date TBD",
  },

  band: {
    since: "20XX",
    bio1:
      "Placeholder copy. How the band started and what you're going for goes here — " +
      "two or three sentences, in your own words.",
    bio2:
      "Placeholder copy. A second paragraph if you want one: where you play, what you " +
      "sound like, what you're chasing.",
  },

  members: [
    { name: "Jane Doe", role: "Guitar, vocals", photo: null },
    { name: "John Doe", role: "Bass", photo: null },
    { name: "Jane Roe", role: "Drums", photo: null },
    { name: "John Roe", role: "Keys, harmonica", photo: null },
  ],

  links: [
    { label: "Instagram", href: "#" },
    { label: "Bandcamp", href: "#" },
    { label: "Booking", href: "#" },
  ],
};

const { notices, shows, live, record, band, members, links } = DEMO ? PLACEHOLDER : REAL;

/* ════════════════════════════════════════════════════════════
   THE STAGE — the photograph in the sky.

   This sits outside the DEMO switch on purpose. There is no such
   thing as a placeholder photograph: a fake one would either be a
   grey box (useless for judging the design) or someone else's
   band (a lie). It's a real picture or it's nothing.

   And nothing is a supported state. Rule 2: the sky is drawn, so
   a missing, slow, or broken file costs the page a photograph and
   not a hero. src: null ships a finished site.

   focus is the vertical crop bias — 0 keeps the top of the frame
   (the bulb grid), 1 keeps the floor. The photo is 3:2 and the
   sky is much wider than that, so something has to go.
   ════════════════════════════════════════════════════════════ */
const banner = {
  /* Add or remove freely. One image is a photograph and it simply
     sits there; two or more and it becomes a slow rotation. Zero,
     or a folder of broken paths, and the sky is just drawn. */
  images: [
    { src: "assets/images/banner/01-1600.webp", src2x: "assets/images/banner/01-2400.webp" },
    { src: "assets/images/banner/02-1600.webp", src2x: "assets/images/banner/02-2400.webp" },
    { src: "assets/images/banner/03-1600.webp", src2x: "assets/images/banner/03-2400.webp" },
  ],
  focus: 0.34,   /* 0 keeps the bulb grid, 1 keeps the floor */
  hold: 6500,    /* ms each image holds still */
  fade: 2000,    /* ms to cross into the next one */
};

/* ════════════════════════════════════════════════════════════
   MACHINERY
   ════════════════════════════════════════════════════════════ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel) => document.querySelector(sel);

const isTK = (v) => !v || String(v).trim().toUpperCase() === "TK";
const chip = '<span class="tk">TK</span>';

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = String(str);
  return d.innerHTML;
}

/* Render a field: the real value, or a TK chip plus a hint. */
const field = (value, hint) => (isTK(value) ? `${chip}${hint}` : escapeHtml(value));

/* Render a paragraph that may still be TK. A TK paragraph gets
   the dashed block treatment; a real one is just a paragraph. */
const para = (value, hint, cls) =>
  isTK(value)
    ? `<p class="${cls} tk-block">${chip}${hint}</p>`
    : `<p class="${cls}">${escapeHtml(value)}</p>`;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ── footer year ─────────────────────────────────────────── */
$("#year").textContent = new Date().getFullYear();

/* ── nav ─────────────────────────────────────────────────── */
const nav = $("#nav");
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

const onNavScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
onNavScroll();
window.addEventListener("scroll", onNavScroll, { passive: true });

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName !== "A") return;
  navLinks.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
});

/* ── NOW ── the signpost at the waterline ────────────────────
   It carries a count and an arrow, and deliberately no news. That
   is the whole trick: the gallery below owns every notice, photo
   and all, and this points at it. Put the headline here too and
   the page says the same thing twice — which is what was wrong
   with the version before this one.

   So: no date, no kind, no text. If you find yourself adding the
   notice's words here, you are rebuilding the redundancy. */
$("#nowBody").innerHTML = notices.length
  ? `<a class="signpost" href="#notices">
       <span class="signpost-count">${notices.length} notice${
         notices.length === 1 ? "" : "s"
       }</span>
       <span class="signpost-arrow" aria-hidden="true">&darr;</span>
     </a>`
  : `<span class="notice-empty">${chip}Your first announcement goes here — add it to
     <code>notices</code> in script.js.</span>`;

/* ── the notice gallery ──────────────────────────────────────
   Paged by hand and, if there is more than one, also on a slow
   timer. The timer is the part that has to behave: it stops on
   hover, on focus, once you take the wheel, and entirely under
   reduced motion. Auto-advancing text that cannot be stopped
   fails WCAG 2.2.2 and, worse, is rude — it takes a sentence away
   from someone in the middle of reading it.
   ──────────────────────────────────────────────────────────── */
const gallery = $("#gallery");
const track = $("#galleryTrack");

/* Every notice lives here, newest first — including the one the
   signpost above is counting. The signpost carries no words, so
   nothing is repeated. */
if (notices.length) {
  $("#notices").hidden = false;
  $("#noticesCount").textContent =
    `${notices.length} notice${notices.length === 1 ? "" : "s"}`;

  track.innerHTML = notices
    .map((n) => {
      const img = n.image && n.image.src;
      const cta =
        n.cta && n.href
          ? `<a class="notice-cta" href="${escapeHtml(n.href)}">${escapeHtml(n.cta)} &rarr;</a>`
          : "";
      return `
        <li class="notice-card${img ? "" : " no-image"}">
          ${img
          ? `<figure class="notice-figure">
                   <img src="${escapeHtml(n.image.src)}"
                        alt="${escapeHtml(n.image.alt || "")}" loading="lazy" />
                 </figure>`
          : ""
        }
          <div class="notice-body">
            <div class="notice-meta">
              <span class="notice-date">${field(n.date, "date")}</span>
              <span class="notice-kind">${field(n.kind, "kind")}</span>
            </div>
            <p class="notice-headline">${field(n.text, "what's happening")}</p>
            ${cta}
          </div>
        </li>`;
    })
    .join("");

  /* a picture that 404s takes its own frame with it, rather than
     leaving a broken-image icon in the middle of the card */
  track.querySelectorAll(".notice-figure img").forEach((im) => {
    im.addEventListener("error", () => {
      const card = im.closest(".notice-card");
      im.closest(".notice-figure").remove();
      card.classList.add("no-image");
    });
  });
}

/* One notice is not a gallery: no arrows, no dots, no timer. */
if (notices.length > 1) {
  const dots = $("#galleryDots");
  const prev = $("#galleryPrev");
  const next = $("#galleryNext");
  $("#galleryNav").hidden = false;
  dots.hidden = false;

  let at = 0;
  let timer = null;
  let stopped = reduceMotion;   /* reduced motion never starts it */
  const HOLD = 7000;

  dots.innerHTML = notices
    .map(
      (n, i) =>
        `<li><button class="gallery-dot" type="button" data-i="${i}"
           aria-label="Notice ${i + 1}: ${escapeHtml(String(n.text).slice(0, 60))}"
           aria-current="${i === 0}"></button></li>`
    )
    .join("");

  const cards = () => [...track.children];

  const paint = () => {
    prev.disabled = at === 0;
    next.disabled = at === notices.length - 1;
    [...dots.querySelectorAll(".gallery-dot")].forEach((d, i) =>
      d.setAttribute("aria-current", String(i === at))
    );
  };

  /* scrollLeft is the single source of truth — the arrows, the dots
     and a finger on the glass all move the same number, and the
     scroll handler reads it back. Nothing keeps its own idea of
     where the gallery is. */
  const goTo = (i, smooth = true) => {
    at = clamp(i, 0, notices.length - 1);
    const card = cards()[at];
    if (card) {
      gallery.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: smooth && !reduceMotion ? "smooth" : "auto",
      });
    }
    paint();
  };

  const stop = () => {
    stopped = true;
    clearInterval(timer);
    timer = null;
  };
  const start = () => {
    if (stopped || timer) return;
    timer = setInterval(() => goTo((at + 1) % notices.length), HOLD);
  };

  prev.addEventListener("click", () => { stop(); goTo(at - 1); });
  next.addEventListener("click", () => { stop(); goTo(at + 1); });
  dots.addEventListener("click", (e) => {
    const b = e.target.closest(".gallery-dot");
    if (!b) return;
    stop();
    goTo(Number(b.dataset.i));
  });

  /* take the wheel and the timer gets out of the way for good */
  gallery.addEventListener("pointerdown", stop, { passive: true });
  gallery.addEventListener("wheel", stop, { passive: true });
  gallery.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") stop();
  });

  /* pause while it is being read or tabbed through */
  const hold = () => { clearInterval(timer); timer = null; };
  $("#notices").addEventListener("pointerenter", hold);
  $("#notices").addEventListener("pointerleave", start);
  $("#notices").addEventListener("focusin", hold);
  $("#notices").addEventListener("focusout", start);

  /* a finger-drag lands wherever it lands; read the index back out
     of the scroll position rather than assuming it obeyed us */
  let settle;
  gallery.addEventListener(
    "scroll",
    () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const x = gallery.scrollLeft;
        let best = 0;
        let bestD = Infinity;
        cards().forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - track.offsetLeft - x);
          if (d < bestD) { bestD = d; best = i; }
        });
        at = best;
        paint();
      }, 90);
    },
    { passive: true }
  );

  paint();
  if (!reduceMotion) { stopped = false; start(); }
}

/* ── live ── the section only exists once photos do ──────── */
const realShots = live.filter((s) => s.src);
if (realShots.length) {
  $("#liveSection").hidden = false;
  $("#liveStrip").innerHTML = realShots
    .map(
      ({ src, caption }) => `
      <li class="live-shot">
        <img src="${escapeHtml(src)}" alt="Something Blue live${caption ? ` — ${escapeHtml(caption)}` : ""
        }" loading="lazy" />
        ${caption ? `<span class="live-caption">${escapeHtml(caption)}</span>` : ""}
      </li>`
    )
    .join("");

  /* a photo that 404s removes its own frame rather than showing
     a broken-image icon; if they all fail, the section goes away */
  document.querySelectorAll(".live-shot img").forEach((img) => {
    img.addEventListener("error", () => {
      img.closest(".live-shot").remove();
      if (!document.querySelectorAll(".live-shot").length) {
        $("#liveSection").hidden = true;
      }
    });
  });
}

/* ── shows ───────────────────────────────────────────────── */
const showsEyebrow = $("#showsEyebrow");
const showsBody = $("#showsBody");

if (shows.length) {
  const n = shows.length;
  showsEyebrow.textContent = `${n} date${n === 1 ? "" : "s"} on the books`;
  showsBody.innerHTML = `<ul class="show-list">${shows
    .map(
      (s) => `
      <li class="show">
        <span class="show-date">${field(s.date, "date")}</span>
        <span class="show-where">
          <span class="show-city">${field(s.city, "city")}</span>
          <span class="show-venue">${field(s.venue, "venue")}</span>
        </span>
        ${s.sold
          ? `<span class="show-sold">Sold out</span>`
          : `<a class="show-cta" href="${escapeHtml(s.href || "#")}">Tickets</a>`
        }
      </li>`
    )
    .join("")}</ul>`;
} else {
  /* Not a placeholder — this is true right now, so it ships. */
  showsEyebrow.textContent = "No dates on the books";
  showsBody.innerHTML = `
    <div class="shows-empty">
      <p>We're in the studio. When we play, the dates land here first.</p>
      <a href="#stay">Get told about the first one</a>
    </div>`;
}

/* ── the record ──────────────────────────────────────────── */
$("#recordBlurb").innerHTML = para(
  record.blurb,
  "What it sounds like, where you're tracking it, and who's making it with you. " +
  "A paragraph in your own words — this is the most interesting thing about the " +
  "band right now, so it's worth writing well.",
  "body-text"
);

$("#recordFacts").innerHTML = [
  ["Title", record.title],
  ["Studio", record.studio],
  ["Out", record.out],
]
  .map(
    ([term, value]) => `
    <div class="fact">
      <dt>${term}</dt>
      <dd>${field(value, "")}</dd>
    </div>`
  )
  .join("");

/* ── the band ────────────────────────────────────────────── */
$("#bandSince").innerHTML = isTK(band.since)
  ? `${chip}Together since`
  : `Together since ${escapeHtml(band.since)}`;

$("#bandBio").innerHTML =
  para(
    band.bio1,
    "How the band started, and what you're going for. Two or three sentences. " +
    "Say the specific thing, not the impressive thing.",
    "lead"
  ) +
  para(
    band.bio2,
    "A second paragraph if you want one — where you play, what you sound like, " +
    "what you're chasing.",
    "body-text"
  );

$("#members").innerHTML = members
  .map(
    (m) => `
    <li class="member">
      <div class="member-photo">
        ${m.photo
        ? `<img src="${escapeHtml(m.photo)}" alt="${escapeHtml(m.name)}" loading="lazy" />`
        : /* there's no such thing as a dummy photograph — in demo the
                 frame just sits there quietly rather than shouting TK */
        DEMO
          ? ""
          : `<span class="member-photo-empty">Photo TK</span>`
      }
      </div>
      <div>
        <span class="member-name">${field(m.name, "Name")}</span>
        <span class="member-role">${field(m.role, "Instrument")}</span>
      </div>
    </li>`
  )
  .join("");

document.querySelectorAll(".member-photo img").forEach((img) => {
  img.addEventListener("error", () => {
    img.parentElement.innerHTML = `<span class="member-photo-empty">Photo TK</span>`;
  });
});

/* ── elsewhere ───────────────────────────────────────────── */
$("#footerLinks").innerHTML = links
  .map(({ label, href }) =>
    isTK(href)
      ? `<a href="#">${chip}${escapeHtml(label)}</a>`
      : `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`
  )
  .join("");

/* ── newsletter ──────────────────────────────────────────── */
const form = $("#signup");
const email = $("#email");
const formMsg = $("#formMsg");
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* The form is a dead end: nothing is stored or sent. Until it's
   wired to a real list, the page says so out loud rather than
   thanking people for an address it threw away. */
if (!DEMO) {
  $("#formNote").innerHTML = `
    <p class="form-note">${chip}This form isn't wired to a list yet — nothing typed into
    it is stored or sent anywhere. Connect it before launch, or take it down.</p>`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = email.value.trim();
  if (!validEmail(value)) {
    formMsg.textContent = "That email needs an @ and a domain.";
    formMsg.classList.add("error");
    email.focus();
    return;
  }
  formMsg.classList.remove("error");
  /* TK — wire this to Buttondown / Mailchimp / ConvertKit, then
     delete the #formNote block above and this message. */
  formMsg.textContent = "Saved nowhere — the list isn't connected yet.";
  form.reset();
});

/* ════════════════════════════════════════════════════════════
   THE WATERLINE — the signature.

   One line across the page. It is an ocean swell and it is an
   audio waveform; those are the same shape, which is the whole
   idea. Three summed sines: a long swell, a mid chop, and a
   fast ripple that gives it the character of a waveform rather
   than a decorative curve.

   The sun sits low and warm behind it and sinks as you scroll.
   It is the only warm thing on the page and the only thing that
   moves. Everything is drawn — nothing here waits on an image.
   ════════════════════════════════════════════════════════════ */
const canvas = $("#sea");
const ctx = canvas.getContext("2d");
const hero = $(".hero");
const heroWater = $("#heroWater");

let w = 0;
let h = 0;
let baseY = 0;       /* the waterline, tied to where the layout turns over */
let ampBase = 8;
let skyGrad = null;
let waterGrad = null;
let progress = 0;    /* 0 at the top of the hero, 1 at the bottom */
let t = 0;

/* THE LOAD, as scene state rather than CSS.
   sun:   0 = high and pale, 1 = down at its resting place.
   lamps: 0 = the stage is dark, 1 = the band is lit.
   The timeline animates these two numbers and the draw loop reads
   them. Nothing here loops; at rest it sits at {sun:1, lamps:1}. */
const scene = { sun: reduceMotion ? 1 : 0, lamps: reduceMotion ? 1 : 0 };

/* The photograph is composited into the canvas, not layered behind
   it — the sky is painted opaque, so a DOM image underneath would
   simply be buried. On the canvas it lands in the right place in
   the stack: under the dusk, under the sun, over the sky. If it
   never arrive, stageBaked stays empty and the sky is just drawn. */
let stageImgs = [];      /* the ones that actually arrived */
let stageBaked = [];     /* each graded to the sky, rendered once */

/* where the rotation is, in real milliseconds */
let bannerAt = 0;        /* index of the image currently held */
let bannerClock = 0;
let bannerMix = 0;       /* 0 = holding, 1 = fully crossed into the next */

if (banner && banner.images && banner.images.length) {
  /* the 2x file only earns its bytes on a wide or dense screen */
  const dense = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) > 1700;
  banner.images.forEach((entry, i) => {
    const img = new Image();
    img.decoding = "async";
    img.src = dense && entry.src2x ? entry.src2x : entry.src;
    img.addEventListener("load", () => {
      /* keep authored order however the network returns them —
         a rotation that reshuffles itself per load is a bug */
      stageImgs[i] = img;
      bakeStage();
      /* the photos land long after the one still frame that reduced
         motion gets, and no loop is coming to pick them up — so that
         frame has to be painted again or the band never arrives. */
      if (reduceMotion) draw();
    });
    /* a file that 404s costs the rotation one frame, not the hero */
    img.addEventListener("error", () => { stageImgs[i] = null; bakeStage(); });
  });
}

/* ── BAKING THE STAGE ──────────────────────────────────────
   The grade is expensive and it never changes, so it is paid once
   here instead of sixty times a second in draw(). Filtering a
   2400px photograph every frame is a real cost on a phone, and it
   buys nothing: the pixels are identical each time.

   It is also what keeps the framing still. The photo is baked to
   the sky's own height (baseY), not to skyBottom — skyBottom grows
   with the swell as you scroll, so cover-fitting to it re-crops the
   band on every scroll frame. The band should not breathe.

   The grade closes on the sky's horizon tone at the bottom, so the
   baked image ends on exactly the colour the drawn sky already is
   there and the two are indistinguishable at the join. */
function bakeStage() {
  stageBaked = [];
  if (w <= 0 || baseY <= 0) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  stageImgs.forEach((img) => {
    if (!img) return;   /* a hole in the array is a file that failed */
    const off = document.createElement("canvas");
    off.width = Math.round(w * dpr);
    off.height = Math.round(baseY * dpr);
    const b = off.getContext("2d");
    b.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* cover-fit, biased so the crop keeps what matters */
    const ir = img.width / img.height;
    let dw = w;
    let dh = w / ir;
    if (dh < baseY) { dh = baseY; dw = baseY * ir; }
    b.filter = "saturate(.66) contrast(1.08) brightness(.5)";
    b.drawImage(img, (w - dw) / 2, (baseY - dh) * banner.focus, dw, dh);
    b.filter = "none";

    /* what turns a photograph into weather: hold the top down so the
       nav and wordmark stay legible, let the middle through where the
       band is, and close to the horizon so the stage dissolves into
       the far shore rather than ending on a photographic edge. */
    const grd = b.createLinearGradient(0, 0, 0, baseY);
    grd.addColorStop(0, "rgba(5, 12, 18, .58)");
    grd.addColorStop(0.42, "rgba(9, 24, 38, .26)");
    grd.addColorStop(0.78, "rgba(28, 68, 92, .62)");
    grd.addColorStop(1, "rgba(58, 106, 131, 1)");
    b.fillStyle = grd;
    b.fillRect(0, 0, w, baseY);

    stageBaked.push(off);
  });

  if (bannerAt >= stageBaked.length) { bannerAt = 0; bannerClock = 0; bannerMix = 0; }
}

/* The rotation runs on real elapsed time, not frame count, so it
   keeps the same pace on a 60Hz and a 120Hz screen. Reduced motion
   never calls this: it holds on the first frame forever. */
function advanceBanner(dt) {
  if (stageBaked.length < 2) { bannerMix = 0; return; }
  bannerClock += dt;
  if (bannerClock < banner.hold) {
    bannerMix = 0;
    return;
  }
  bannerMix = clamp((bannerClock - banner.hold) / banner.fade, 0, 1);
  if (bannerClock >= banner.hold + banner.fade) {
    bannerAt = (bannerAt + 1) % stageBaked.length;
    bannerClock = 0;
    bannerMix = 0;
  }
}

/* The water is drawn here but continues in CSS, so both halves
   must agree on where the handoff happens. Reading the tones from
   the stylesheet keeps one source of truth: change --surface or
   --depth-0 in styles.css and the canvas follows. Duplicating the
   hex here is how a seam gets born. */
const tone = (name, fallback) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/* ── THE NAV IS WATER TOO ──────────────────────────────────
   A single tint cannot sit on a ramp. Matched at the top of the
   descent it is invisible; by the floor the same colour is a
   lighter slab laid across the gradient. So the bar samples the
   ramp at its own position each scroll and wears that colour —
   below the hero it simply dissolves into the water it floats on.

   Over the hero it holds at --depth-0 rather than sampling, because
   the wordmark passes under it at full size and would eat the links
   behind a matching tint. That costs nothing: --depth-0 is the
   colour the ramp starts on, so the handoff at the hero's bottom
   edge is continuous anyway.

   The stops below MUST match the .depths gradient in styles.css.
   A CSS gradient can't be read back out, so this is the one place
   on the page where a value is knowingly written twice. Change one,
   change the other. */
const NAV_ALPHA = 0.88;
const hexRgb = (hex) => {
  const s = String(hex).replace("#", "").trim();
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const mixRgb = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));

function rampAt(k) {
  const stops = [
    [0, hexRgb(tone("--depth-0", "#10293A"))],
    [0.38, hexRgb(tone("--depth-1", "#0C1F2C"))],
    [0.72, hexRgb(tone("--depth-2", "#091620"))],
    [1, hexRgb(tone("--deep", "#060F16"))],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [at, from] = stops[i];
    const [to, dest] = stops[i + 1];
    if (k >= at && k <= to) return mixRgb(from, dest, (k - at) / (to - at));
  }
  return stops[stops.length - 1][1];
}

function tintNav() {
  /* untinted until it sticks — over the open sky it is just letters */
  if (!nav.classList.contains("scrolled")) {
    nav.style.backgroundColor = "";
    return;
  }
  const depths = $(".depths");
  if (!depths) return;
  const y = window.scrollY + nav.offsetHeight;
  const top = depths.offsetTop;
  const c =
    y <= top
      ? hexRgb(tone("--depth-0", "#10293A"))
      : rampAt(clamp((y - top) / Math.max(1, depths.offsetHeight), 0, 1));
  nav.style.backgroundColor = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${NAV_ALPHA})`;
}

/* registered after onNavScroll, so .scrolled is already correct
   by the time this reads it */
tintNav();
window.addEventListener("scroll", tintNav, { passive: true });

function measure() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = hero.offsetWidth;
  h = hero.offsetHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  /* the drawn line lands exactly where the sky stops and the
     notice board begins — the scene and the layout agree */
  baseY = Math.round(heroWater.offsetTop);
  ampBase = clamp(h * 0.016, 5, 15);

  skyGrad = ctx.createLinearGradient(0, 0, 0, baseY);
  skyGrad.addColorStop(0, "#050C12");
  skyGrad.addColorStop(0.45, "#0C2033");
  skyGrad.addColorStop(0.78, "#1B4460");
  skyGrad.addColorStop(1, "#3A6A83");

  /* The hero holds the first few feet: lit at the waterline, already
     dimming by the time the hero ends. It stops on exactly the tone
     .depths starts on, and the page carries the fall-off from there
     down to the floor — one gradient, drawn half then styled half.

     The darkening is not only perspective. The glitter below is
     additive warm light, and it only stays warm while the water
     under it stays dark enough (see --depth-0). Bright water here
     turns the sun grey. */
  waterGrad = ctx.createLinearGradient(0, baseY, 0, h);
  waterGrad.addColorStop(0, tone("--surface", "#1B3F56"));
  waterGrad.addColorStop(1, tone("--depth-0", "#10293A"));

  /* the sky changed size, so the photo has to be re-baked to fit it */
  bakeStage();
}

function waveY(x, amp) {
  const k1 = (Math.PI * 2) / (w * 0.9);
  const k2 = (Math.PI * 2) / (w * 0.4);
  const k3 = (Math.PI * 2) / (w * 0.16);
  return (
    baseY +
    amp * 0.55 * Math.sin(x * k1 + t * 0.6) +
    amp * 0.3 * Math.sin(x * k2 - t * 0.9 + 1.3) +
    amp * 0.15 * Math.sin(x * k3 + t * 1.7 + 0.5)
  );
}

/* the surface, left edge to right edge */
function traceSurface(amp) {
  ctx.beginPath();
  ctx.moveTo(0, waveY(0, amp));
  for (let x = 4; x <= w; x += 4) ctx.lineTo(x, waveY(x, amp));
}

/* the surface, closed down to the bottom — the body of water */
function traceBody(amp) {
  traceSurface(amp);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
}

function draw() {
  const amp = ampBase * (1 + progress * 1.5);
  const sunX = w * 0.72;
  const sun = scene.sun;
  const day = 1 - sun;   /* the light that hasn't left yet */

  /* The sun sets twice. Once on load, as the intro drops it from
     high in a pale sky to its resting place on the horizon; then
     again, forever after, a little more as you scroll the hero.
     Same sun, same direction of travel — the intro is just the
     first part of the same movement. */
  const sunRest = baseY - h * 0.1 + progress * h * 0.1;
  const sunY = sunRest - day * h * 0.42;

  /* the sky is painted past the waterline by the full wave
     amplitude — a trough dips below baseY, and anything short of
     this leaves a torn seam of page background in the hollows */
  const skyBottom = baseY + amp + 6;

  ctx.clearRect(0, 0, w, h);

  /* sky */
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, skyBottom);

  /* ── THE STAGE ── the band, lit, inside the sky ───────────
     It comes up as the daylight goes: the sun hands its warmth to
     the bulbs. Graded down hard, because it is atmosphere here and
     not a gallery — the sun still has to be the brightest thing on
     the page, and the wordmark still has to be readable across it. */
  if (stageBaked.length && scene.lamps > 0) {
    const held = stageBaked[bannerAt];
    ctx.globalAlpha = scene.lamps * (1 - bannerMix);
    ctx.drawImage(held, 0, 0, w, baseY);
    if (bannerMix > 0) {
      const next = stageBaked[(bannerAt + 1) % stageBaked.length];
      ctx.globalAlpha = scene.lamps * bannerMix;
      ctx.drawImage(next, 0, 0, w, baseY);
    }
    ctx.globalAlpha = 1;
  }

  /* the daylight that is leaving. warm and low toward the horizon,
     gone by the time the intro settles. */
  if (day > 0.001) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const wash = ctx.createLinearGradient(0, 0, 0, skyBottom);
    wash.addColorStop(0, `rgba(26, 56, 84, ${day * 0.26})`);
    wash.addColorStop(0.62, `rgba(120, 92, 74, ${day * 0.30})`);
    wash.addColorStop(1, `rgba(196, 124, 72, ${day * 0.40})`);
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w, skyBottom);
    ctx.restore();
  }

  /* dusk falls across the hero as you scroll */
  ctx.fillStyle = `rgba(6, 15, 22, ${progress * 0.55})`;
  ctx.fillRect(0, 0, w, skyBottom);

  /* the sun: a small hot disc inside a wide bloom. the wordmark
     sits in front of it, backlit. */
  ctx.globalCompositeOperation = "lighter";
  const bloom = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, h * 0.42);
  bloom.addColorStop(0, "rgba(226, 137, 74, .55)");
  bloom.addColorStop(0.18, "rgba(214, 122, 66, .26)");
  bloom.addColorStop(0.5, "rgba(150, 110, 96, .09)");
  bloom.addColorStop(1, "rgba(150, 110, 96, 0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, w, skyBottom);

  const disc = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, h * 0.035);
  disc.addColorStop(0, "rgba(255, 226, 190, .95)");
  disc.addColorStop(0.55, "rgba(238, 163, 98, .5)");
  disc.addColorStop(1, "rgba(226, 137, 74, 0)");
  ctx.fillStyle = disc;
  ctx.fillRect(0, 0, w, skyBottom);
  ctx.globalCompositeOperation = "source-over";

  /* the water */
  traceBody(amp);
  ctx.fillStyle = waterGrad;
  ctx.fill();

  /* the sun's glitter path: a broken column of light on the
     water, widening and fading as it comes toward you. this is
     what a low sun actually does to a sea surface. clipped to
     the body, or it paints over the sky wherever a trough sits
     below the dashes.

     The column only exists once the sun is low enough to lie along
     the surface, so it ignites during the intro rather than being
     there from the first frame — a high sun doesn't do this. */
  const glint = clamp((sun - 0.4) / 0.6, 0, 1);
  if (glint > 0) {
    ctx.save();
    traceBody(amp);
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 30; i++) {
      const yy = baseY + 5 + i * (h * 0.011);
      if (yy > h) break;
      const wob = Math.sin(t * 1.1 + i * 0.85) * (w * 0.012);
      const wd = w * (0.012 + i * 0.0032);
      const a = (1 - i / 30) * 0.42 * glint;
      ctx.fillStyle = `rgba(238, 168, 106, ${a})`;
      ctx.fillRect(sunX + wob - wd / 2, yy, wd, 1.5);
    }
    ctx.restore();
  }

  /* the line itself — the last light catching the surface */
  traceSurface(amp);
  ctx.strokeStyle = "rgba(198, 224, 240, .9)";
  ctx.lineWidth = 1.25;
  ctx.shadowColor = "rgba(168, 205, 235, .75)";
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function onSeaScroll() {
  progress = clamp(window.scrollY / Math.max(1, hero.offsetHeight), 0, 1);
}

measure();
onSeaScroll();

if (reduceMotion) {
  /* one still frame: the scene is drawn, nothing moves */
  draw();
} else {
  let last = 0;
  const loop = (now) => {
    /* clamped: a backgrounded tab returns with a huge gap, and an
       unclamped delta would jump the rotation several images on the
       first frame back */
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    t += 0.006;
    advanceBanner(dt);
    draw();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.addEventListener("scroll", onSeaScroll, { passive: true });
}

/* the display face loads after first paint and reflows the hero,
   which moves the waterline. measure again once it lands, or the
   drawn line sits where the layout used to be. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    measure();
    onSeaScroll();
    if (reduceMotion) draw();
  });
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    measure();
    onSeaScroll();
    if (reduceMotion) draw();
  }, 150);
});

/* ════════════════════════════════════════════════════════════
   THE LOAD — the light arrives, then the name rises out of it.
   One sequence, nothing loops.
   ════════════════════════════════════════════════════════════ */

const chars = (() => {
  try {
    return splitText(".wm-blue", { chars: true }).chars;
  } catch {
    return [$(".wm-blue")];
  }
})();

if (reduceMotion) {
  /* the scene is already at rest ({sun:1, lamps:1}); nothing hides,
     so nothing needs restoring. */
  utils.set([canvas, chars, ".wm-something", ".now-heading", ".now-body"], {
    opacity: 1,
    y: 0,
  });
} else {
  utils.set(canvas, { opacity: 0 });
  utils.set([chars, ".wm-something", ".now-heading", ".now-body"], {
    opacity: 0,
  });

  const tl = createTimeline({ defaults: { ease: "outQuint" } })
    /* the scene arrives first and is watched, not waited through */
    .add(canvas, { opacity: [0, 1], duration: 800, ease: "inOutQuad" }, 0)
    /* THE SUNSET. one long fall; everything else is timed off it. */
    .add(scene, { sun: [0, 1], duration: 1900, ease: "inOutSine" }, 150)
    /* the sun's warmth hands off to the bulbs as the daylight goes */
    .add(scene, { lamps: [0, 1], duration: 1300, ease: "outQuad" }, 1150)
    /* the name rises out of the light that's left */
    .add(
      chars,
      { y: [40, 0], opacity: [0, 1], duration: 1050, delay: stagger(34, { from: "center" }) },
      1700
    )
    .add(".wm-something", { opacity: [0, 1], duration: 800 }, 2050)
    /* the notice board surfaces last, quietly, under the waterline */
    /* the news surfaces last, under the waterline */
    .add(".now-heading", { opacity: [0, 1], duration: 650 }, 2400)
    .add(".now-body", { opacity: [0, 1], y: [12, 0], duration: 650 }, 2550);
}

/* ── scroll reveals ──────────────────────────────────────── */
if (!reduceMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".show, .member, .fact, .head, .lead, .live-shot"
  );
  utils.set(revealTargets, { opacity: 0 });

  const io = new IntersectionObserver(
    (entries) => {
      const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      if (!shown.length) return;
      animate(shown, {
        opacity: [0, 1],
        y: [16, 0],
        duration: 800,
        delay: stagger(60),
        ease: "outQuint",
      });
      shown.forEach((el) => io.unobserve(el));
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));
}
