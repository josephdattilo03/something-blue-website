/* ============================================================
   Something Blue — interactions
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- footer year ---------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---- sticky nav state ----------------------------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile menu ---------------------------------------- */
  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav-links");
  const closeMenu = () => {
    toggle.classList.remove("open");
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });

  /* ---- scroll reveal -------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-up");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---- mini music player (UI demo) ------------------------ */
  const tracklist = document.getElementById("tracklist");
  const tracks = Array.from(tracklist.querySelectorAll("li"));
  const playBtn = document.getElementById("playBtn");
  const playLabel = playBtn.querySelector(".play-label");
  const trackNow = document.getElementById("trackNow");
  const art = document.getElementById("art");

  let current = -1;
  let playing = false;

  function setTrack(i) {
    current = i;
    tracks.forEach((li, idx) => li.classList.toggle("active", idx === i));
    const name = tracks[i].querySelector(".t-name").textContent;
    trackNow.textContent = (playing ? "Now playing — " : "Cued — ") + name;
  }

  function setPlaying(state) {
    playing = state;
    playBtn.setAttribute("aria-pressed", String(state));
    playLabel.textContent = state ? "Pause" : "Play";
    art.classList.toggle("playing", state);
    if (current >= 0) {
      const name = tracks[current].querySelector(".t-name").textContent;
      trackNow.textContent = (state ? "Now playing — " : "Paused — ") + name;
    }
  }

  tracks.forEach((li, i) => {
    li.addEventListener("click", () => {
      setTrack(i);
      setPlaying(true);
    });
  });

  playBtn.addEventListener("click", () => {
    if (current < 0) setTrack(0);
    setPlaying(!playing);
  });

  /* ---- tour dates (data-driven) --------------------------- */
  const shows = [
    { day: "12", mo: "Jul", city: "Brooklyn, NY", venue: "Music Hall of Williamsburg", sold: false },
    { day: "15", mo: "Jul", city: "Boston, MA", venue: "The Sinclair", sold: true },
    { day: "19", mo: "Jul", city: "Philadelphia, PA", venue: "Union Transfer", sold: false },
    { day: "24", mo: "Jul", city: "Chicago, IL", venue: "Thalia Hall", sold: false },
    { day: "02", mo: "Aug", city: "Denver, CO", venue: "Bluebird Theater", sold: false },
    { day: "08", mo: "Aug", city: "Los Angeles, CA", venue: "The Roxy", sold: true },
    { day: "11", mo: "Aug", city: "San Francisco, CA", venue: "The Chapel", sold: false },
  ];

  const tourList = document.getElementById("tourList");
  tourList.innerHTML = shows
    .map(
      (s) => `
      <li class="tour-row reveal-up">
        <div class="tour-date"><span class="day">${s.day}</span> <span class="mo">${s.mo}</span></div>
        <div class="tour-where">
          <div class="city">${s.city}</div>
          <div class="venue">${s.venue}</div>
        </div>
        <a href="#" class="tour-cta ${s.sold ? "sold" : ""}">${s.sold ? "Sold out" : "Tickets"}</a>
      </li>`
    )
    .join("");

  // observe the newly injected rows for reveal
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io2.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    tourList.querySelectorAll(".reveal-up").forEach((el) => io2.observe(el));
  } else {
    tourList.querySelectorAll(".reveal-up").forEach((el) => el.classList.add("in"));
  }

  /* ---- band members (data-driven) ------------------------- */
  // Drop real photos into an /images folder and point `photo` at them
  // (e.g. "images/ava.jpg"). If a photo is missing or fails to load, the
  // card falls back to a gradient tile with the member's initials.
  // `links` is each member's personal branding — add as many as you like.
  const members = [
    {
      name: "Ava Mercer",
      role: "vocals, guitar",
      photo: "images/ava.jpg",
      links: [
        { label: "Instagram", href: "#" },
        { label: "avamercer.com", href: "#" },
      ],
    },
    {
      name: "Theo Park",
      role: "guitar, keys",
      photo: "images/theo.jpg",
      links: [
        { label: "Instagram", href: "#" },
        { label: "SoundCloud", href: "#" },
      ],
    },
    {
      name: "Lena Cho",
      role: "bass",
      photo: "images/lena.jpg",
      links: [
        { label: "Instagram", href: "#" },
        { label: "lenacho.studio", href: "#" },
      ],
    },
    {
      name: "Sam Ruiz",
      role: "drums",
      photo: "images/sam.jpg",
      links: [
        { label: "Instagram", href: "#" },
        { label: "TikTok", href: "#" },
      ],
    },
  ];

  const initialsOf = (name) =>
    name
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const membersGrid = document.getElementById("membersGrid");
  if (membersGrid) {
    membersGrid.innerHTML = members
      .map((m, i) => {
        const initials = initialsOf(m.name);
        const linksHtml = m.links
          .map((l) => `<a href="${l.href}">${l.label}</a>`)
          .join("");
        const photoHtml = m.photo
          ? `<img src="${m.photo}" alt="${m.name}" loading="lazy" />`
          : `<span class="member-initials">${initials}</span>`;
        return `
        <li class="member reveal-up" style="--d:${i}">
          <div class="member-photo${m.photo ? "" : " fallback"}" data-initials="${initials}">${photoHtml}</div>
          <div class="member-body">
            <span class="member-name">${m.name}</span>
            <span class="member-role">${m.role}</span>
            <div class="member-links">${linksHtml}</div>
          </div>
        </li>`;
      })
      .join("");

    // swap a missing/broken photo for a gradient + initials tile
    membersGrid.querySelectorAll(".member-photo img").forEach((img) => {
      img.addEventListener("error", () => {
        const frame = img.parentNode;
        frame.classList.add("fallback");
        frame.innerHTML = `<span class="member-initials">${frame.dataset.initials}</span>`;
      });
    });

    // observe the newly injected cards for the reveal animation
    if (!reduceMotion && "IntersectionObserver" in window) {
      const ioM = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              ioM.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      membersGrid.querySelectorAll(".reveal-up").forEach((el) => ioM.observe(el));
    } else {
      membersGrid.querySelectorAll(".reveal-up").forEach((el) => el.classList.add("in"));
    }
  }

  /* ---- newsletter form ------------------------------------ */
  const form = document.getElementById("signup");
  const email = document.getElementById("email");
  const msg = document.getElementById("formMsg");
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valid(email.value.trim())) {
      msg.textContent = "Hmm — that email doesn't look right.";
      msg.classList.add("error");
      email.focus();
      return;
    }
    msg.classList.remove("error");
    msg.textContent = "You're in. Watch your inbox for tour presales ✦";
    form.reset();
  });

  /* ---- starfield canvas ----------------------------------- */
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w, h, raf;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(140, Math.floor((w * h) / 14000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.02 + 0.004,
      drift: Math.random() * 0.15 + 0.02,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.tw += s.sp;
      s.y += s.drift;
      if (s.y > h + 2) s.y = -2;
      const a = 0.4 + Math.sin(s.tw) * 0.45;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${190 + s.r * 30}, ${210}, 255, ${a})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  if (!reduceMotion) {
    resize();
    draw();
    let t;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(resize, 150);
    });
  } else {
    canvas.style.display = "none";
  }
})();
