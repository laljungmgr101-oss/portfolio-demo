# Lal Jung Magar — portfolio + blog

A colourful, animated single-page portfolio with a data-driven blog. No build step, no
frameworks — just HTML, CSS and vanilla JavaScript.

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
cd "Personal website"
python -m http.server 8000
# http://localhost:8000
```

## Files

```
index.html              → portfolio (hero, about, skills, projects, blog, journey, contact)
blog.html               → all posts + tag filters
blog-post.html          → single post template (?slug=…)
assets/css/style.css    → all styles, themes and animations
assets/js/main.js       → nav, theme toggle, scroll effects, typewriter, form
assets/js/posts.js      → ✏️ YOUR BLOG POSTS — the only file to edit for new posts
assets/js/blog.js       → renders the post cards, filters and article pages
```

## Make it yours

1. **Name & brand** — search for `Lal Jung Magar` and `laljung.dev` in `index.html`,
   `blog.html`, `blog-post.html` and `posts.js`, then replace them.
2. **Email** — in `main.js`, change `const EMAIL = "hello@laljung.dev";` and update the
   `mailto:` links in the HTML.
3. **Socials** — swap the `https://github.com/`, `https://linkedin.com/` and
   `https://x.com/` hrefs for your real profiles.
4. **Projects** — edit the four `.project` articles in `index.html`. The
   `data-placeholder` links intentionally show a "demo link" toast — replace the
   `href="#"` with your real URLs and remove `data-placeholder`.
5. **Stats / journey / certifications** — plain HTML, edit in place.
6. **Colours** — the whole palette lives at the top of `style.css` in `:root`.
   Change `--violet`, `--pink`, `--cyan`, `--grad` and everything follows.
7. **Résumé** — drop `resume.pdf` into the folder and add a button:
   `<a class="btn btn-primary" href="resume.pdf" download>Download CV</a>`.

## Publishing a blog post

Open `assets/js/posts.js` and add a new object to `window.BLOG_POSTS`:

```js
{
  slug: "my-new-post",              // unique URL id
  title: "My new post",
  excerpt: "One or two sentences shown on the card.",
  date: "2026-12-01",               // YYYY-MM-DD
  readTime: 4,
  tags: ["CSS", "Frontend"],
  accent: ["#8b5cf6", "#22d3ee"],   // card gradient
  icon: "code",                     // spark | code | layers | team | rocket
  content: `
    <p>Opening paragraph.</p>
    <h2>A subheading</h2>
    <p>More text with <strong>bold</strong> and <a href="#">links</a>.</p>
    <blockquote>A quote.</blockquote>
    <pre><code>const hello = "world";</code></pre>
  `
}
```

That's it. Posts are sorted newest-first automatically and appear on the homepage
(the 3 latest), on `blog.html`, in the tag filters, and get their own page at
`blog-post.html?slug=my-new-post`.

Allowed HTML inside `content`: `p, h2, h3, ul, ol, li, strong, em, a, code, pre,
blockquote, img`. Writing a post elsewhere (Medium, Dev.to)? Just swap the card link in
`blog.js` for your external URL.

## Deploy

- **GitHub Pages** — push the folder to a repo → Settings → Pages → deploy from branch.
- **Netlify / Vercel** — drag the folder in, or connect the repo. No build command needed.
- Because everything is relative, it works from any subfolder.

## Notes

- The contact form has no backend. It opens the visitor's mail app with the message
  pre-filled. Want it to send for real? Drop in Formspree/Netlify Forms later.
- Dark/light mode follows the visitor's system setting and remembers their choice.
- Animations respect `prefers-reduced-motion`.
"# portfolio-demo" 
