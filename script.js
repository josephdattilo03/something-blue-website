import {
  animate,
  createTimeline,
  stagger,
  splitText,
  utils,
} from "https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm";

/* ════════════════════════════════════════════════════════════
   CONTENT — the only part you need to edit.
   Everything below the CONTENT block is machinery.

   "TK" is a newsroom mark for "to come". Anything left as TK
   renders as an orange chip on the page, so unfinished content
   can't ship by accident. Replace the text, drop the chip.
   ════════════════════════════════════════════════════════════ */

/* NOTICES — announcements, newest first. Appears in the hero.
   This replaces the marquee. Keep it to 1–3; it's a notice
   board, not a feed. An empty array [] renders a prompt. */
const notices = [
  {
    date: "TK",                              // e.g. "14 Jul 2026"
    kind: "Record",                          // Record · Tour · Show · News
    text: "We're recording our first record.",
    cta: "What we know",
    href: "#record",
  },
];

/* SHOWS — upcoming dates, soonest first. An empty array renders
   the "no dates yet" state, which is honest and stays useful. */
const shows = [
  // { date: "12 Sep", city: "Brooklyn, NY", venue: "Venue name", href: "#", sold: false },
];

/* LIVE — the photo strip along the horizon, right below the fold.
   Drop files in an /images folder and point src at them; add or
   remove entries freely. Landscape shots crop best. These are the
   only warm light on the page, so pick ones with stage light in
   them if you can. */
const live = [
  { src: null, caption: "" },
  { src: null, caption: "" },
  { src: null, caption: "" },
  { src: null, caption: "" },
  { src: null, caption: "" },
];

/* BAND — add or remove people freely; the grid adapts. */
const members = [
  { name: "TK", role: "TK", photo: null },
  { name: "TK", role: "TK", photo: null },
  { name: "TK", role: "TK", photo: null },
  { name: "TK", role: "TK", photo: null },
];

/* ════════════════════════════════════════════════════════════
   MACHINERY
   ════════════════════════════════════════════════════════════ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel) => document.querySelector(sel);

const isTK = (v) => !v || String(v).trim().toUpperCase() === "TK";
const chip = '<span class="tk">TK</span>';
/* Render a field: real value, or a TK chip plus a hint. */
const field = (value, hint) => (isTK(value) ? `${chip}${hint}` : escapeHtml(value));

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = String(str);
  return d.innerHTML;
}

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

/* ── the lamps: live photos along the waterfront ─────────── */
$("#lamps").innerHTML = live
  .map(({ src, caption }) => {
    const inner = src
      ? `<img src="${escapeHtml(src)}" alt="Something Blue live${
          caption ? ` — ${escapeHtml(caption)}` : ""
        }" loading="lazy" />`
      : `<span class="lamp-empty">Photo TK</span>`;
    const cap = src && caption ? `<span class="lamp-caption">${escapeHtml(caption)}</span>` : "";
    return `<li class="lamp">${inner}${cap}</li>`;
  })
  .join("");

/* a photo that 404s falls back to the lit lamp rather than a
   broken-image icon */
document.querySelectorAll(".lamp img").forEach((img) => {
  img.addEventListener("error", () => {
    img.closest(".lamp").innerHTML = `<span class="lamp-empty">Photo TK</span>`;
  });
});

/* ── the notice board ────────────────────────────────────── */
$("#noticeList").innerHTML = notices.length
  ? notices
      .map((n) => {
        const cta =
          n.cta && n.href
            ? `<a class="notice-cta" href="${escapeHtml(n.href)}">${escapeHtml(n.cta)} &rarr;</a>`
            : `<span></span>`;
        return `
          <li class="notice">
            <span class="notice-date">${field(n.date, "date")}</span>
            <span class="notice-kind">${field(n.kind, "kind")}</span>
            <span class="notice-text">${field(n.text, "what's happening")}</span>
            ${cta}
          </li>`;
      })
      .join("")
  : `<li class="notice-empty">${chip}Your first announcement goes here — add it to
     <code>notices</code> in script.js.</li>`;

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
        ${
          s.sold
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

/* ── the band ────────────────────────────────────────────── */
$("#members").innerHTML = members
  .map(
    (m) => `
    <li class="member">
      <div class="member-photo">
        ${
          m.photo
            ? `<img src="${escapeHtml(m.photo)}" alt="${escapeHtml(m.name)}" loading="lazy" />`
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

/* ── newsletter ──────────────────────────────────────────── */
const form = $("#signup");
const email = $("#email");
const formMsg = $("#formMsg");
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

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
  /* TK — wire this to your list (Buttondown, Mailchimp, etc).
     Right now it only clears the field. */
  formMsg.textContent = "You're on the list.";
  form.reset();
});

/* ════════════════════════════════════════════════════════════
   THE LOAD SEQUENCE — dusk falling on the harbor.
   One timeline: the horizon draws, the wordmark rises, the
   lamps come on, the notices settle. Nothing loops.
   ════════════════════════════════════════════════════════════ */

const chars = (() => {
  try {
    return splitText(".wm-blue", { chars: true }).chars;
  } catch {
    return [$(".wm-blue")];
  }
})();

if (reduceMotion) {
  /* already night: everything present, nothing moves */
  utils.set([".horizon"], { scaleX: 1 });
  utils.set([chars, ".lamp", ".notice", ".notice-empty", ".notices-heading", ".wm-something"], {
    opacity: 1,
    y: 0,
  });
} else {
  utils.set(".horizon", { scaleX: 0 });
  utils.set([chars, ".wm-something", ".lamp", ".notice", ".notice-empty", ".notices-heading"], {
    opacity: 0,
  });

  createTimeline({ defaults: { ease: "outQuint" } })
    /* the horizon opens from the centre — the light arrives first */
    .add(".horizon", { scaleX: [0, 1], duration: 1400, ease: "inOutQuint" }, 200)
    /* BLUE rises out of the water */
    .add(
      chars,
      { y: [34, 0], opacity: [0, 1], duration: 1100, delay: stagger(30, { from: "center" }) },
      700
    )
    .add(".wm-something", { opacity: [0, 1], duration: 900 }, 1000)
    /* the lamps come on one at a time, left to right */
    .add(
      ".lamp",
      { opacity: [0, 1], scale: [0.94, 1], duration: 800, delay: stagger(110) },
      1150
    )
    .add(".notices-heading", { opacity: [0, 1], duration: 700 }, 1700)
    .add(
      [".notice", ".notice-empty"],
      { opacity: [0, 1], y: [12, 0], duration: 700, delay: stagger(90) },
      1800
    );
}

/* ── scroll reveals ──────────────────────────────────────── */
if (!reduceMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".show, .member, .fact, .head, .lead");
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

/* ════════════════════════════════════════════════════════════
   STARS — they only appear once it's actually dark, which is
   after you've scrolled past the harbor.
   ════════════════════════════════════════════════════════════ */
const canvas = $("#field");

if (reduceMotion) {
  canvas.style.display = "none";
} else {
  const ctx = canvas.getContext("2d");
  const harbor = $(".harbor");
  let stars = [];
  let w = 0;
  let h = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(130, Math.floor((w * h) / 16000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.1 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.004,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.phase += s.speed;
      const a = 0.35 + Math.sin(s.phase) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(208, 226, 245, ${a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  /* fade the stars in across the second half of the harbor */
  function onStarScroll() {
    const start = harbor.offsetHeight * 0.45;
    const end = harbor.offsetHeight;
    const p = (window.scrollY - start) / (end - start);
    canvas.style.opacity = String(Math.min(1, Math.max(0, p)) * 0.75);
  }

  resize();
  draw();
  onStarScroll();
  window.addEventListener("scroll", onStarScroll, { passive: true });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      onStarScroll();
    }, 150);
  });
}
