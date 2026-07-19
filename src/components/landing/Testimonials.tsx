"use client";

import { motion } from "framer-motion";

const REVIEWS = [
  {
    quote: "SEO Boostr's parallel crawling engine is a game-changer. Inspecting Core Web Vitals, Schema validation, and indexability across all subpages simultaneously takes less than 10 seconds. It replaced our bulky desktop crawler completely.",
    author: "Sarah K. Jenkins",
    role: "Head of SEO, ScaleUp Media",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    color: "#0f766e", // Teal
    rating: 5,
  },
  {
    quote: "The AI & GEO Visibility audit was exactly what we needed. We optimized our fact density and structured schema markups based on the recommendations, and our client's brand was cited in Perplexity and Google AI Overviews within weeks.",
    author: "Elena Rostova",
    role: "Technical SEO Lead, Apex Group",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
    color: "#6366f1", // Indigo
    rating: 5,
  },
  {
    quote: "We run weekly SEO drift audits on our clients' production builds. SEO Boostr flags any accidental meta shifts or page-speed regressions instantly. The developer-focused CSV and PDF exports have saved us dozens of hours.",
    author: "Nikhil Mehta",
    role: "Technical Director, CorePixel Agency",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
    color: "#f97316", // Orange
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-slate-950">
      {/* Background glow strip */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-5">
            Proven Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Trusted by <span className="gradient-text">Agencies & Experts</span>
          </h2>
          <p className="text-slate-350 max-w-lg mx-auto text-xs sm:text-sm font-medium leading-relaxed">
            Read stories from founders, developers, and agency owners who use our parallel audits to deliver better results.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative rounded-3xl border border-white/10 bg-slate-900/40 p-7 backdrop-blur-2xl hover:border-teal-500/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Accent Gradient Line */}
              <div 
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: review.color }}
              />

              {/* Quote Icon in Background */}
              <div className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.748-9.762 9-10.961l.696 1.209c-3.12 1.482-4.17 4.29-4.17 6.136h5.457v11.006h-10.983zm-14 0v-7.391c0-5.704 3.748-9.762 9-10.961l.696 1.209c-3.12 1.482-4.09 4.29-4.09 6.136h5.457v11.006h-10.983z"/>
                </svg>
              </div>

              <div>
                {/* 5-Star Rating Block */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(review.rating)].map((_, index) => (
                    <svg
                      key={index}
                      className="w-4 h-4 text-amber-400 fill-current drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-slate-300 text-[13px] leading-relaxed mb-6 font-medium font-sans">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover border-2"
                  style={{ borderColor: `${review.color}40` }}
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                    {review.author}
                  </h4>
                  <span className="text-[10.5px] font-bold text-slate-400 mt-0.5 block">
                    {review.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
