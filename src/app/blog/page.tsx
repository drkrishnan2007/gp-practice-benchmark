import Link from "next/link";
import { getAllBlogPosts } from "@/data/blog-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights | Pro Aryash Health",
  description: "Articles on AI in healthcare, GP practice management, and innovation in primary care from Dr Krishnan Pasupathi.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-teal-100 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Blog & Insights</h1>
          <p className="mt-2 text-teal-100 text-lg">
            Reflections on AI in healthcare, practice management, and innovation in primary care
          </p>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl border-l-4 border-l-teal-500 border border-slate-200 shadow-md hover:shadow-xl hover:border-teal-300 transition-all p-4 md:p-6"
              >
                {/* Category & Date */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded">
                    {post.category}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-teal-700 transition-colors mb-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-700 text-xs font-bold">KP</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{post.author}</p>
                      <p className="text-xs text-slate-400">{post.readTime} min read</p>
                    </div>
                  </div>
                  <span className="text-teal-600 text-sm font-medium flex items-center">
                    Read
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
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
