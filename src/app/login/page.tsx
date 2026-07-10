"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 font-sans text-foreground">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <img src="/logo.png" alt="SEOBoostr" className="w-10 h-10 rounded-xl shadow-sm object-contain" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              SEOBoostr
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-semibold">
            Next-generation parallel SEO audits.
            <br />
            15 modules. One clean report.
          </p>
        </div>

        {/* Login Container Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-md">
          <h2 className="text-lg font-bold text-slate-800 mb-1.5">
            Sign in to continue
          </h2>
          <p className="text-muted-foreground text-sm mb-6 font-medium leading-relaxed">
            Connect your account to save your website settings and review audit histories.
          </p>

          <div className="space-y-3">
            {/* Demo Sign In */}
            <button
              onClick={() => signIn("credentials", { email: "demo@seoboostr.io", callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer text-sm"
            >
              <span>Launch Demo Mode</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Google Sign In */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 border border-slate-200 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer text-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-400 mt-6 tracking-wide uppercase">
          SEOBoostr Audit Tool
        </p>
      </div>
    </div>
  );
}
