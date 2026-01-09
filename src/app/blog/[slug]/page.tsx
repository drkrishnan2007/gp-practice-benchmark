import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts } from "@/data/blog-posts";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | Pro Aryash Health",
    };
  }

  return {
    title: `${post.title} | Pro Aryash Health`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-teal-100 hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Category */}
          <div className="mt-4 mb-4">
            <span className="px-3 py-1 bg-teal-500 text-white text-xs font-medium rounded">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-teal-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">KP</span>
              </div>
              <div>
                <p className="font-medium text-white">{post.author}</p>
                <p className="text-xs text-teal-200">{post.authorCredentials}</p>
              </div>
            </div>
            <span className="text-teal-200">•</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-teal-200">•</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <article className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-10">
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:text-slate-800
              prose-p:text-slate-600
              prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-700
              prose-li:text-slate-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-3">Topics:</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Author Card */}
        <div className="mt-8 bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-700 text-xl font-bold">KP</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800">{post.author}</p>
              <p className="text-sm text-slate-500">{post.authorCredentials}</p>
              <p className="text-slate-600 mt-2 text-sm">
                NHS GP Partner with 29 years in medicine. Building free patient education tools and resources for healthcare professionals.
              </p>
              <div className="mt-3 flex gap-3">
                <a
                  href="https://aryash.health"
                  className="text-teal-600 hover:underline text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aryash.health
                </a>
                <a
                  href="https://linkedin.com/in/krishnan-pasupathi-a68244129"
                  className="text-teal-600 hover:underline text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 text-center">
          <p className="text-teal-800 font-medium mb-2">
            Explore the tools mentioned in this article
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <a
              href="https://tools.aryash.health"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              Blood Test Explainer
            </a>
            <Link
              href="/health-check"
              className="px-4 py-2 bg-white text-teal-600 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium"
            >
              Practice Health Check
            </Link>
            <Link
              href="/compare"
              className="px-4 py-2 bg-white text-teal-600 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium"
            >
              Compare Practices
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="font-semibold text-lg">Pro Aryash Health</p>
              <p className="text-slate-400 text-sm mt-1">
                Resources for healthcare professionals
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
                <Link href="/" className="text-teal-400 hover:text-teal-300 transition-colors text-sm">
                  Home
                </Link>
                <Link href="/blog" className="text-teal-400 hover:text-teal-300 transition-colors text-sm">
                  Blog
                </Link>
                <Link href="/health-check" className="text-teal-400 hover:text-teal-300 transition-colors text-sm">
                  Health Check
                </Link>
                <Link href="/compare" className="text-teal-400 hover:text-teal-300 transition-colors text-sm">
                  Compare
                </Link>
                <a
                  href="https://tools.aryash.health/privacy.html"
                  className="text-teal-400 hover:text-teal-300 transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy
                </a>
              </div>
              <p className="text-slate-500 text-xs mt-4">
                © {new Date().getFullYear()} Aryash Health
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
