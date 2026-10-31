import { createFileRoute } from "@tanstack/react-router";
import { SESSION_COOKIE } from "@/lib/session";

export const Route = createFileRoute("/api/public/discord/logout")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        new Response(null, {
          status: 302,
          headers: {
            Location: `${new URL(request.url).origin}/dashboard`,
            "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
          },
        }),
    },
  },
});
