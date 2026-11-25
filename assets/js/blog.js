/* =========================================================
   Blog renderer
   - Homepage: featured cards  -> #blogGrid  (data-limit="3")
   - Listing : all posts       -> #blogList  (+ #blogFilters, #postCount)
   - Post    : single article  -> #postRoot  (?slug=...)
   Reads data from window.BLOG_POSTS (assets/js/posts.js)
   ========================================================= */
(() => {
  "use strict";

  const posts = (window.BLOG_POSTS || [])
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ICONS = {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7 14.3 9l6.3 2.2-6.3 2.2L12 19.7l-2.3-6.3L3.4 11.2 9.7 9 12 2.7Z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-5 6 5 6M16 6l5 6-5 6"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 14 9 5 9-5"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16.5 5.6a3.2 3.2 0 0 1 0 4.8M18.5 20a6 6 0 0 0-2.2-4.6"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8c3.4 1.6 5.5 5 5.5 9.2L12 17.5 6.5 12C6.5 7.8 8.6 4.4 12 2.8Z"/><circle cx="12" cy="9.4" r="1.8"/><path d="M8.5 15.5 6 20l3.5-1.2M15.5 15.5 18 20l-3.5-1.2"/></svg>'
  };

  const ICON_FALLBACK = ICONS.spark;

  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));

  const fmtDate = (iso) => {
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const iconFor = (name) => ICONS[name] || ICON_FALLBACK;

  const tagsHTML = (tags) =>
    `<ul class="post-tags">${(tags || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  const cardHTML = (post, index) => `
    <article class="post-card card reveal" style="--d:${index * 70}ms">
      <a class="post-link" href="blog-post.html?slug=${encodeURIComponent(post.slug)}" aria-label="Read: ${esc(post.title)}">
        <div class="post-media" style="--a:${post.accent?.[0] || "#8b5cf6"}; --b:${post.accent?.[1] || "#22d3ee"}">
          <span class="post-icon" aria-hidden="true">${iconFor(post.icon)}</span>
          <span class="post-no" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
        </div>
        <div class="post-body">
          <div class="post-meta">
            <time datetime="${esc(post.date)}">${fmtDate(post.date)}</time>
            <span class="meta-sep" aria-hidden="true">·</span>
            <span>${post.readTime} min read</span>
          </div>
          <h3 class="post-title">${esc(post.title)}</h3>
          <p class="post-excerpt">${esc(post.excerpt)}</p>
          ${tagsHTML(post.tags)}
          <span class="post-cta">Read post
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </div>
      </a>
    </article>`;

  /* ---- reveal new nodes created after main.js ran ---- */
  let revealObserver = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
  }

  const armReveals = (scope = document) => {
    $$(".reveal:not(.in)", scope).forEach((el) => {
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add("in");
    });
  };

  /* ---- homepage featured ---- */
  const featuredGrid = $("#blogGrid");
  if (featuredGrid) {
    const limit = parseInt(featuredGrid.dataset.limit || "3", 10);
    featuredGrid.innerHTML = posts.slice(0, limit).map(cardHTML).join("");
    armReveals(featuredGrid);
  }

  /* ---- listing page ---- */
  const list = $("#blogList");
  if (list) {
    const filters = $("#blogFilters");
    const count = $("#postCount");
    const allTags = ["All", ...new Set(posts.flatMap((p) => p.tags || []))];
    let activeTag = "All";

    const paint = () => {
      const visible = activeTag === "All" ? posts : posts.filter((p) => (p.tags || []).includes(activeTag));
      list.innerHTML = visible.map(cardHTML).join("");

      if (count) {
        count.textContent = `${visible.length} ${visible.length === 1 ? "post" : "posts"}` +
          (activeTag === "All" ? "" : ` tagged “${activeTag}”`);
      }
      armReveals(list);
    };

    if (filters) {
      filters.innerHTML = allTags.map((tag, i) => `
        <button class="filter${i === 0 ? " is-active" : ""}" type="button"
          data-tag="${esc(tag)}" aria-pressed="${i === 0}">${esc(tag)}</button>`).join("");

      filters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter");
        if (!btn) return;
        activeTag = btn.dataset.tag;
        $$(".filter", filters).forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        paint();
      });
    }

    paint();
  }

  /* ---- single post ---- */
  const postRoot = $("#postRoot");
  if (postRoot) {
    const slug = new URLSearchParams(window.location.search).get("slug");
    const index = posts.findIndex((p) => p.slug === slug);
    const post = posts[index];

    const notFound = () => {
      postRoot.innerHTML = `
        <div class="not-found">
          <p class="eyebrow"><span></span>404</p>
          <h1>That post has <span class="grad">wandered off</span></h1>
          <p class="lead">The link may be old, or the slug might have changed. The rest of the build log is still here.</p>
          <a class="btn btn-primary" href="blog.html">Browse all posts</a>
        </div>`;
    };

    if (!post) {
      document.title = "Post not found — Lal Jung Magar";
      notFound();
    } else {
      document.title = `${post.title} — Lal Jung Magar`;
      const meta = $('meta[name="description"]');
      if (meta) meta.setAttribute("content", post.excerpt);

      const newer = posts[index - 1];
      const older = posts[index + 1];

      const navCard = (p, label) => p ? `
        <a class="article-nav-card card" href="blog-post.html?slug=${encodeURIComponent(p.slug)}">
          <span class="article-nav-label">${label}</span>
          <span class="article-nav-title">${esc(p.title)}</span>
        </a>` : `<span class="article-nav-card is-empty" aria-hidden="true"></span>`;

      postRoot.innerHTML = `
        <article class="article">
          <a class="back-link" href="blog.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
            All posts
          </a>

          <header class="article-head">
            <p class="eyebrow"><span></span>Build log · ${fmtDate(post.date)}</p>
            <h1>${esc(post.title)}</h1>
            <p class="article-lede">${esc(post.excerpt)}</p>
            <div class="article-meta">
              <span>${post.readTime} min read</span>
              <span class="meta-sep" aria-hidden="true">·</span>
              <span>By Lal Jung Magar</span>
            </div>
            ${tagsHTML(post.tags)}
          </header>

          <div class="article-cover" style="--a:${post.accent?.[0] || "#8b5cf6"}; --b:${post.accent?.[1] || "#22d3ee"}" aria-hidden="true">
            <span class="post-icon post-icon-lg">${iconFor(post.icon)}</span>
          </div>

          <div class="prose">${post.content || ""}</div>

          <footer class="article-foot">
            <p>Thanks for reading. Found a bug in this post? <a class="inline-link" href="index.html#contact">Tell me about it →</a></p>
          </footer>

          <nav class="article-nav" aria-label="More posts">
            ${navCard(newer, "← Newer post")}
            ${navCard(older, "Older post →")}
          </nav>
        </article>`;
    }
  }
})();
