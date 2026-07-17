"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.startsWith("/dashboard")) {
      document.documentElement.classList.remove("dark");
    } else {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      const theme = savedTheme || "dark";
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [pathname]);

  return <SessionProvider>{children}</SessionProvider>;
}
