"use client";

export function Footer() {
  return (
    <footer className="relative bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/logo.png"
                alt="SEOBoostr"
                className="w-7 h-7 rounded-lg object-contain"
                width={28}
                height={28}
              />
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                SEOBoostr
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Built by a founder who got tired of running 5 tools to get one answer.
              Ship faster. Rank better.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 sm:gap-12">
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Product</p>
              <a href="#modules" className="block text-xs text-slate-500 hover:text-slate-900 transition-colors">Features</a>
              <a href="#pricing" className="block text-xs text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
              <a href="#faq" className="block text-xs text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
            </div>
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resources</p>
              <a href="#" className="block text-xs text-slate-500 hover:text-slate-900 transition-colors">Documentation</a>
              <a href="#" className="block text-xs text-slate-500 hover:text-slate-900 transition-colors">API (soon)</a>
              <a href="#" className="block text-xs text-slate-500 hover:text-slate-900 transition-colors">Changelog</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} SEOBoostr. Made with too much coffee and not enough sleep.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
