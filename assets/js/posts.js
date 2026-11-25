/* =========================================================
   BLOG DATA
   ---------------------------------------------------------
   This is the only file you need to edit to publish a post.
   Add a new object at the top of the array (newest first is
   sorted automatically) and it will show up on the homepage,
   the blog listing and get its own page.

   Fields:
   - slug      : unique URL id (lowercase, hyphens, no spaces)
   - title     : post title
   - excerpt   : 1–2 sentence summary shown on cards
   - date      : "YYYY-MM-DD"
   - readTime  : whole minutes
   - tags      : array of short labels
   - accent    : [gradient colour A, gradient colour B]
   - icon      : spark | code | layers | team | rocket
   - content   : HTML string (p, h2, ul, blockquote, pre/code…)
   ========================================================= */

window.BLOG_POSTS = [
  {
    slug: "css-features-i-reach-for",
    title: "The CSS features I reach for in every project",
    excerpt: "Custom properties, container queries and one very underrated focus style — the four tricks that quietly make every interface feel finished.",
    date: "2026-11-08",
    readTime: 6,
    tags: ["CSS", "Frontend"],
    accent: ["#8b5cf6", "#22d3ee"],
    icon: "code",
    content: `
      <p>Every project I ship ends up with the same small handful of CSS tricks. Not because I'm lazy — because they solve problems so cleanly that reaching for anything else feels like extra work.</p>

      <h2>1. Custom properties are the API</h2>
      <p>I stopped hard-coding colours the day I had to make an entire dashboard work in light mode. Now every themeable value lives on <code>:root</code>, and components only ever reference the variable.</p>
      <pre><code>:root {
  --surface: rgba(255, 255, 255, 0.05);
  --border: rgba(255, 255, 255, 0.1);
  --accent: #8b5cf6;
}

[data-theme="light"] {
  --surface: #ffffff;
  --border: rgba(20, 17, 43, 0.12);
}</code></pre>
      <p>One attribute on the <code>&lt;html&gt;</code> element re-themes the whole page. No class soup, no duplicated component styles, no late-night search-and-replace.</p>

      <h2>2. Container queries for cards that live everywhere</h2>
      <p>A card in a sidebar and the same card in a three-column grid need different layouts. Container queries let the component decide based on its own width instead of the viewport's.</p>
      <pre><code>.card-wrap { container-type: inline-size; }

@container (min-width: 340px) {
  .card { flex-direction: row; }
}</code></pre>
      <p>This is the first CSS feature in years that genuinely changed how I structure markup. Components finally own their own responsiveness.</p>

      <h2>3. clamp() instead of five breakpoints</h2>
      <p>Most of my typography and spacing now uses a single fluid value:</p>
      <pre><code>h1 { font-size: clamp(2.4rem, 6vw, 4.5rem); }</code></pre>
      <p>It removes whole blocks of media queries and stops the awkward jump between mobile and desktop sizes. I keep breakpoints for layout changes, not for font sizes.</p>

      <h2>4. :focus-visible, always</h2>
      <p>If you take one thing from this post: never remove the focus ring. Replace it.</p>
      <pre><code>:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}</code></pre>
      <p>Keyboard users get a clear target, mouse users never see it. Accessibility stops being a chore and becomes a two-line habit.</p>

      <blockquote>CSS is not the easy part. It is the part that decides whether your app feels finished.</blockquote>
    `
  },
  {
    slug: "why-i-rewrite-my-projects",
    title: "Why I rewrite my own projects on purpose",
    excerpt: "The second version is always better — not because the first one failed, but because I finally understood the problem.",
    date: "2026-09-21",
    readTime: 5,
    tags: ["Learning", "Career"],
    accent: ["#ec4899", "#fbbf24"],
    icon: "spark",
    content: `
      <p>I have a folder called <code>v2</code>. Inside it are five projects I had already "finished". Every one of them is smaller, faster and easier to read than the original — and rewriting them taught me more than starting anything new ever did.</p>

      <h2>The first version is a question, not an answer</h2>
      <p>When I start a project I don't know what it actually is yet. I'm guessing at the data model, guessing at the screens, guessing at what the user needs. The first version is me finding out.</p>
      <p>By the time it works, I have real feedback: this state belongs in the URL, that component is doing three jobs, this API endpoint is returning way too much data. Rewriting is how I act on that knowledge.</p>

      <h2>Rewrite small, not brave</h2>
      <p>I don't rewrite everything. I pick one layer and redo it properly:</p>
      <ul>
        <li>The data layer, with the schema I now understand.</li>
        <li>The component tree, once I know what repeats.</li>
        <li>The CSS, after I've seen the design on a real phone.</li>
      </ul>
      <p>One layer at a time keeps the project shippable. A heroic full rewrite usually ends with two unfinished apps and a lot of regret.</p>

      <h2>What actually improves</h2>
      <p>My second versions are rarely more feature-rich. They are shorter. Files get deleted, dependencies disappear, and the name of every function gets a little more honest. The app stops being a pile of decisions and starts being a system.</p>
      <blockquote>Nobody is going to grade your first draft. Ship it, learn from it, then build the version you actually meant.</blockquote>
      <p>If you're a student like me: keep the old repo. Not as a portfolio piece, but as evidence. Opening your first project a year later is the cheapest progress check there is.</p>
    `
  },
  {
    slug: "first-react-project-weekend",
    title: "Your first React project: a weekend guide",
    excerpt: "No tutorials, no twelve-hour course. Just one small app, built badly, then improved once — the fastest way to actually learn React.",
    date: "2026-07-14",
    readTime: 8,
    tags: ["React", "Beginner"],
    accent: ["#06b6d4", "#a3e635"],
    icon: "layers",
    content: `
      <p>The fastest way to learn React is not another tutorial. It's building something small enough to finish in a weekend, then fixing the three things that annoy you about it.</p>

      <h2>Pick a project with a state problem</h2>
      <p>Todo apps get mocked, but the shape is right: a list, a form, and a filter. You need something where <em>state changes over time</em>. My first project was a movie watchlist with a "watched" toggle — three screens and one localStorage key.</p>

      <h2>The Saturday plan</h2>
      <ol>
        <li><strong>Hour 1:</strong> scaffold with Vite, delete everything you don't understand.</li>
        <li><strong>Hours 2–4:</strong> build the ugliest working version. Inline styles are allowed. Shame is not.</li>
        <li><strong>Hour 5:</strong> move state up until it stops duplicating. This is the actual React lesson.</li>
        <li><strong>Hour 6:</strong> persist it. Refresh the page and watch your data survive.</li>
      </ol>

      <h2>Where beginners get stuck</h2>
      <p>Almost everyone hits the same wall: state that lives in two places. A form has its own copy of the item, the list has another, and they slowly disagree. The fix is less code, not more — keep one source of truth and pass values down.</p>
      <pre><code>const [items, setItems] = useState(() => {
  const saved = localStorage.getItem("watchlist");
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem("watchlist", JSON.stringify(items));
}, [items]);</code></pre>

      <h2>Sunday: make it feel real</h2>
      <p>Not prettier — real. Add an empty state ("Nothing saved yet"), a disabled button while the input is blank, and a hover state. These tiny details are what separate a tutorial project from something a human can use.</p>
      <blockquote>Only after it works do you earn the right to redesign it.</blockquote>
      <p>Then push it to GitHub Pages or Vercel and put the link in your portfolio. A finished small project beats five half-built impressive ones — trust me, I've been the person with five.</p>
    `
  },
  {
    slug: "what-hackathons-taught-me",
    title: "What three hackathons taught me about teamwork",
    excerpt: "I joined for the free pizza and left with a much better understanding of scope, demos and the person who says 'let's just ship it'.",
    date: "2026-05-30",
    readTime: 4,
    tags: ["Career", "Hackathons"],
    accent: ["#fbbf24", "#f472b6"],
    icon: "team",
    content: `
      <p>Three hackathons, three very different teams, one consistent lesson: the winning project is rarely the most technical one. It's the one that was finished.</p>

      <h2>Scope is a design skill</h2>
      <p>Our first hackathon plan had a mobile app, an admin dashboard and a machine-learning model. We built about forty percent of it and demoed a very confident login screen. The winning team built one flow and documented exactly why it mattered.</p>
      <p>Now I write the demo script before writing any code. If a feature doesn't appear in the demo, it doesn't get built.</p>

      <h2>Someone has to own the glue</h2>
      <p>Every team needs a person who asks "how does this connect?" APIs, environment variables, deployment, the README nobody wants to write. It's unglamorous work and it decides whether the demo runs on the judges' laptop.</p>

      <h2>Sleep is a feature</h2>
      <p>The all-nighter looks heroic until the third merge conflict at 5 AM. The teams that slept for four hours shipped cleaner code and gave calmer presentations. I now treat sleep as part of the technical plan.</p>

      <blockquote>A hackathon is a forcing function for decisions, not a test of how long you can stay awake.</blockquote>
      <p>The biggest takeaway wasn't a trophy — it was a habit: define the smallest thing that proves the idea, build that first, and make the demo impossible to misunderstand.</p>
    `
  }
];
