import { MODULES, SITE, type Module } from "./site";
import { z } from "zod";

export type Feature = { id: string; code: string; title: string; desc: string };
export const DEFAULT_FEATURES: Feature[] = [
  { id: "invites", code: "INV", title: "Invite Tracking", desc: "Know exactly who invited whom. Custom join/leave embeds, per-user stats and resets." },
  { id: "tickets", code: "TKT", title: "Ticket System", desc: "One-command setup. Add, remove, rename and close tickets with optional reasons." },
  { id: "embeds", code: "EMB", title: "Embed Builder", desc: "Design embeds with interactive responses. Edit, delete and restore any time." },
  { id: "giveaway", code: "GVW", title: "Giveaways", desc: "Timed giveaways with reroll, update and live listing." },
  { id: "altverify", code: "ALT", title: "AltVerify", desc: "Hashed-IP alt detection with lockdown mode for unverified users." },
  { id: "antibot", code: "BOT", title: "Anti-Bot", desc: "Protect channels from unwanted bots with granular bypass roles." },
  { id: "autorole", code: "ROL", title: "Auto Roles", desc: "Assign roles on join — single or bulk selection menus." },
  { id: "sticky", code: "STK", title: "Sticky Notes", desc: "Pin a message that always stays at the bottom of a channel." },
  { id: "moderation", code: "MOD", title: "Moderation", desc: "Timeout, lock, hide and nickname tools — per channel or server-wide." },
];

const text = z.string().trim().min(1).max(200);
const id = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);
export const featureSchema = z.object({ id, code: text.max(12), title: text, desc: text.max(2000) });
export const commandSchema = z.object({ name: text, desc: text.max(2000) });
export const moduleSchema = z.object({ id, title: text, commands: z.array(commandSchema).refine((cs) => new Set(cs.map((c) => c.name)).size === cs.length, "Command names must be unique within a module.") });
const uniqueIds = <T extends { id: string }>(entries: T[]) => new Set(entries.map((e) => e.id)).size === entries.length;
const featuresSchema = z.array(featureSchema).refine(uniqueIds, "Feature IDs must be unique.");
const modulesSchema = z.array(moduleSchema).refine(uniqueIds, "Module IDs must be unique.");

export type SiteContent = {
  banner: { enabled: boolean; text: string };
  hero: { badge: string; title: string; titleMuted: string; subtitle: string };
  stats: { uptime: string; price: string };
  links: { invite: string; support: string; vote: string };
  hiddenPages: string[];
  hiddenModules: string[];
  hiddenCommands: string[]; // "moduleId::command name"
  features: Feature[];
  modules: Module[];
  hiddenFeatures: string[];
};

export const DEFAULT_CONTENT: SiteContent = {
  banner: { enabled: false, text: "" },
  hero: {
    badge: "v2 · Online",
    title: "The Discord bot",
    titleMuted: "I was dreaming of.",
    subtitle:
      "Invites, tickets, giveaways, embeds and alt detection — engineered as isolated modules. Every action logged. Every edge case handled.",
  },
  stats: { uptime: "100%", price: "$0" },
  links: { invite: SITE.invite, support: SITE.support, vote: SITE.vote },
  hiddenPages: [],
  hiddenModules: [],
  hiddenCommands: [],
  features: DEFAULT_FEATURES,
  modules: MODULES,
  hiddenFeatures: [],
};

export const HIDEABLE_PAGES = [
  { to: "/features", label: "Features" },
  { to: "/commands", label: "Commands" },
  { to: "/status", label: "Status" },
  { to: "/faq", label: "FAQ" },
  { to: "/credits", label: "Credits" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/verify", label: "Verify" },
] as const;

export const cmdKey = (moduleId: string, name: string) => `${moduleId}::${name}`;

export function visibleModules(content: SiteContent): Module[] {
  return content.modules.filter((m) => !content.hiddenModules.includes(m.id)).map((m) => ({
    ...m, commands: m.commands.filter((c) => !content.hiddenCommands.includes(cmdKey(m.id, c.name))),
  }));
}

export function validateCatalog(content: SiteContent): SiteContent {
  return { ...content, features: featuresSchema.parse(content.features), modules: modulesSchema.parse(content.modules) };
}

export function mergeContent(raw: unknown): SiteContent {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<SiteContent>;
  const d = DEFAULT_CONTENT;
  const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  return {
    banner: { ...d.banner, ...(r.banner ?? {}) },
    hero: { ...d.hero, ...(r.hero ?? {}) },
    stats: { ...d.stats, ...(r.stats ?? {}) },
    links: { ...d.links, ...(r.links ?? {}) },
    hiddenPages: arr(r.hiddenPages),
    hiddenModules: arr(r.hiddenModules),
    hiddenCommands: arr(r.hiddenCommands),
    hiddenFeatures: arr(r.hiddenFeatures),
    features: featuresSchema.safeParse(r.features).success ? featuresSchema.parse(r.features) : DEFAULT_FEATURES,
    modules: modulesSchema.safeParse(r.modules).success ? modulesSchema.parse(r.modules) : MODULES,
  };
}
