export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/websites/:path*",
    "/api/analyze/:path*",
    "/api/results/:path*",
  ],
};
