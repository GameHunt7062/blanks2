import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { SESSION_COOKIE, adminIds, signSession } from "@/lib/session";

const back = (origin: string, err: string) =>
  new Response(null, { status: 302, headers: { Location: `${origin}/dashboard?error=${err}` } });

export const Route = createFileRoute("/api/public/discord/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const origin = url.origin;
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const cookieState = /(?:^|;\s*)bv_state=([^;]+)/.exec(request.headers.get("cookie") ?? "")?.[1];
        if (!code || !state || state !== cookieState) return back(origin, "state");

        const secret = process.env["DISCORD_CLIENT_SECRET"];
        const sessionSecret = process.env["SESSION_SECRET"];
        if (!secret || !sessionSecret) return back(origin, "config");

        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: SITE.clientId,
            client_secret: secret,
            grant_type: "authorization_code",
            code,
            redirect_uri: `${origin}/api/public/discord/callback`,
          }),
        });
        if (!tokenRes.ok) {
          console.error("Discord token exchange failed", tokenRes.status, await tokenRes.text());
          return back(origin, "token");
        }
        const { access_token } = (await tokenRes.json()) as { access_token: string };
        const meRes = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (!meRes.ok) return back(origin, "token");
        const me = (await meRes.json()) as { id: string; username: string; global_name?: string; avatar?: string };

        if (!adminIds(process.env["ADMIN_DISCORD_IDS"]).includes(me.id)) return back(origin, "denied");

        const token = await signSession(
          {
            id: me.id,
            name: me.global_name || me.username,
            avatar: me.avatar ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=64` : null,
            exp: Date.now() + 7 * 864e5,
          },
          sessionSecret,
        );
        const h = new Headers({ Location: `${origin}/dashboard` });
        h.append("Set-Cookie", `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
        h.append("Set-Cookie", `bv_state=; Path=/; Max-Age=0`);
        return new Response(null, { status: 302, headers: h });
      },
    },
  },
});
