import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { mergeContent, validateCatalog, type SiteContent } from "./content";
import { SESSION_COOKIE, adminIds, verifySession } from "./session";

async function currentAdmin() {
  const s = await verifySession(getCookie(SESSION_COOKIE), process.env["SESSION_SECRET"] ?? "");
  if (!s || !adminIds(process.env["ADMIN_DISCORD_IDS"]).includes(s.id)) return null;
  return s;
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  // Server-only read with the service-role client: no dependency on the publishable key / RLS policies.
  // (This code never runs in the browser; the content itself is public anyway.)
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("site_content").select("data").eq("id", "main").maybeSingle();
  if (error) console.error("[site_content] read failed:", error.message);
  return mergeContent(data?.data);
});

export const getAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const s = await currentAdmin();
  return s ? { id: s.id, name: s.name, avatar: s.avatar } : null;
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((input: SiteContent) => validateCatalog(input))
  .handler(async ({ data }) => {
    if (!(await currentAdmin())) throw new Error("Not authorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: "main", data: data as never, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
