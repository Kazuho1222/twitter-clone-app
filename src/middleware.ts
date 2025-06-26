import { clerkMiddleware } from "@clerk/nextjs/server";

const isProtectedRoute = (path: string) => path === "/";
const isWebhookRoute = (path: string) => path.startsWith("/api/webhook/clerk");
const isPingRoute = (path: string) => path.startsWith("/api/systems/ping");

export default clerkMiddleware(async (auth, req) => {
  const path = new URL(req.url).pathname;

  if (isWebhookRoute(path) || isPingRoute(path)) {
    return;
  }

  if (isProtectedRoute(path)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
