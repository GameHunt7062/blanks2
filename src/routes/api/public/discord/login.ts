import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/api/public/discord/login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const state = crypto.randomUUID();
        const url = new URL("https://discord.com/oauth2/authorize");
        url.searchParams.set("client_id", SITE.clientId);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", "identify");
        url.searchParams.set("redirect_uri", `${origin}/api/public/discord/callback`);
        url.searchParams.set("state", state);
        url.searchParams.set("prompt", "none");
        return new Response(null, {
          status: 302,
          headers: {
            Location: url.toString(),
            "Set-Cookie": `bv_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
          },
        });
      },
    },
  },
});
