export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorCredentials: string;
  category: string;
  readTime: number;
  tags: string[];
  content: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "claude-code-journey",
    title: "What I Built in 3 Weeks With Zero Coding Experience",
    excerpt: "A GP's journey into healthcare technology with Claude Code — from knowing nothing about terminals to building 13 healthcare tools.",
    date: "2026-01-09",
    author: "Dr Krishnan Pasupathi",
    authorCredentials: "MBBS MBA MRCGP",
    category: "AI in Healthcare",
    readTime: 5,
    tags: ["Claude Code", "AI", "Healthcare", "GP Practice", "Innovation"],
    featured: true,
    content: `
<p class="text-xl text-slate-600 mb-8 leading-relaxed">I have never coded in my life. I didn't know the ABC of code. Until three weeks ago, I didn't even know what the terminal on my MacBook was for.</p>

<p class="mb-6">Today, I have built over a dozen healthcare tools — patient education resources, staff wellbeing applications, and practice management aids — all deployed and live on the internet.</p>

<p class="mb-8 text-lg font-medium text-teal-700">This is not a boast. This is an invitation.</p>

<h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">How It Started</h2>

<p class="mb-6">I completed an AI accelerator programme earlier this year, which opened my eyes to what artificial intelligence could do. But I was still just observing, not building. I had subscriptions to various AI tools and was exploring them one by one, like a curious tourist.</p>

<p class="mb-6">Then, quite by accident, I discovered Claude Code.</p>

<p class="mb-6">My first experience was extraordinary. I felt like a small child in a chocolate factory. I couldn't stop. Within a few hours, I had built my first working tool — a blood test explainer for patients.</p>

<p class="mb-8">I named it <strong>Claudius</strong>, in honour of Claude, which helped me build it.</p>

<h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">What Surprised Me Most</h2>

<p class="mb-6">I expected it to be complicated. It wasn't.</p>

<p class="mb-6">I simply explained what I wanted in plain, simple English. No technical jargon. No code. Just conversation.</p>

<p class="mb-6">What struck me was how Claude pitched its responses at exactly the right level. It knew I wasn't technical, and it never made me feel lost. When I didn't understand something, I asked again, and it explained differently.</p>

<p class="mb-8">The hardest part? I didn't even know you could change the background colour of the terminal. Claude suggested a green theme, and now that's what I use. That was my learning curve — not the building itself.</p>

<h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">What I Built</h2>

<p class="mb-4">In three weeks, I created:</p>

<h3 class="text-lg font-semibold text-slate-700 mt-6 mb-3">For Patients:</h3>
<ul class="list-disc list-inside mb-6 space-y-2 text-slate-600">
  <li><strong>Claudius & Understanding Your Results</strong> — A blood test explainer that breaks down results in plain English, using UK reference ranges. No medical jargon. Free for anyone to use.</li>
  <li><strong>Medication Explainer</strong> — Search any medication and understand what it does, its side effects, and safety information.</li>
  <li><strong>Dr Krishnan Voice Assistant</strong> — A bilingual health assistant (English and Hindi) covering 35 health topics with emergency signposting.</li>
</ul>

<h3 class="text-lg font-semibold text-slate-700 mt-6 mb-3">For Practice Staff:</h3>
<ul class="list-disc list-inside mb-6 space-y-2 text-slate-600">
  <li><strong>Practice Pulse</strong> — A confidential coaching companion for GP practice staff. Quick breathing exercises, AI-guided support for difficult situations, and follow-up care. I believe every practice should have access to something like this.</li>
  <li><strong>Policy Decoder</strong> — Translates complex NHS policy documents into clear, actionable summaries.</li>
  <li><strong>Partners Playbook</strong> — Business guidance for GP partners on HR, finance, and partnership decisions.</li>
</ul>

<h3 class="text-lg font-semibold text-slate-700 mt-6 mb-3">For Practice Management:</h3>
<ul class="list-disc list-inside mb-6 space-y-2 text-slate-600">
  <li><strong>GP Practice Benchmark</strong> — Compare your practice against 6,158 others using NHS data.</li>
  <li><strong>Practice Health Check</strong> — A calculator for practice performance metrics.</li>
</ul>

<p class="mb-8 text-lg">All of these are live. All of them work. And I built them without writing a single line of code myself.</p>

<h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">Credit Where It's Due</h2>

<p class="mb-6">I want to be honest about the tools that helped me. While Claude Code was my primary companion for building these applications, I also used other AI tools along the way:</p>

<ul class="list-disc list-inside mb-8 space-y-2 text-slate-600">
  <li><strong>Claude Code</strong> — The main tool for building and deploying the applications</li>
  <li><strong>ChatGPT</strong> — Helped refine outputs and improve the quality of content</li>
  <li><strong>Google Gemini</strong> — Created all the infographics and visual elements</li>
</ul>

<p class="mb-8">Each tool has its strengths. The key is knowing when to use which one — and being willing to experiment.</p>

<h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">Why I Did This</h2>

<p class="mb-6">I wanted to create something for patients that was completely free. Something that explained health information in simple English, without the jargon that we doctors sometimes forget is jargon.</p>

<p class="mb-6">I approached this not only as a doctor with 29 years in medicine, but also as a patient myself. I know what it feels like to receive test results and not fully understand them. I wanted to bridge that gap.</p>

<p class="mb-8">There are many excellent resources available already. But I wanted to contribute something shaped by my own experience — both clinical and personal.</p>

<h2 class="text-2xl font-bold text-slate-800 mt-10 mb-4">For My Colleagues Who Think "I'm Not Technical Enough"</h2>

<p class="mb-6">There is no need to panic.</p>

<p class="mb-6">Claude Code handles the technical parts. What it cannot do is bring 29 years of clinical experience. It cannot bring your understanding of patients, your knowledge of how practices run, your insight into what staff actually need.</p>

<p class="mb-6"><strong>That is what you bring. The AI handles the rest.</strong></p>

<p class="mb-6">I am 50 years old. If I can learn this at my age, anyone can learn it at any age. All that is required is simple, plain English at a working level. What matters most is the experience and knowledge you have — and your willingness to share it.</p>

<p class="mb-8">As our elders said: <em>better late than never.</em></p>

<div class="bg-teal-50 border-l-4 border-teal-500 p-6 my-10 rounded-r-lg">
  <h2 class="text-xl font-bold text-teal-800 mb-3">கற்றது கைமண் அளவு, கல்லாதது கடல் அளவு</h2>
  <p class="text-slate-700 mb-4">There is a saying in Tamil, my mother tongue:</p>
  <p class="text-lg italic text-slate-600 mb-4">"Katradu kaiman alavu, kalladadu kadal alavu."</p>
  <p class="text-slate-700"><strong>What you have learned is only a handful of water. What you are unaware of is like the entire ocean.</strong></p>
</div>

<p class="mb-6">I have taken only the first step into technology in healthcare. But I know there is a beautiful scenery ahead for those willing to explore.</p>

<p class="mb-6">I share this not to impress, but to ignite a spark. If a 50-year-old GP with zero technical background can build functional healthcare tools in three weeks, imagine what we could achieve collectively — as clinicians, practice managers, and NHS leaders — if we simply started.</p>

<p class="text-xl font-medium text-teal-700 mt-10">Whatever happens, happens for the best. And I believe the best is yet to come.</p>
`
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}
