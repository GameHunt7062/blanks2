export const SITE = {
  name: "BlanK-VisionS",
  invite: "https://discord.com/oauth2/authorize?client_id=1385103762737201153",
  support: "https://discord.gg/3MJAYraXu8",
  vote: "https://top.gg/bot/1385103762737201153?s=0febbf4a4e2fd",
  github: "https://github.com/GameHunt7062/Blnakvis/blob/main/tos.md",
  clientId: "1385103762737201153",
};

export type Cmd = { name: string; desc: string };
export type Module = { id: string; title: string; commands: Cmd[] };

const c = (name: string, desc: string): Cmd => ({ name, desc });

export const MODULES: Module[] = [
  {
    id: "invites",
    title: "Invite Management",
    commands: [
      c("invites <user>", "Show invite stats of a user"),
      c("inviter <user>", "Find who invited a user"),
      c("invited <user>", "List members invited by a user"),
      c("invlog testjoin", "Test the join message"),
      c("invlog testleave", "Test the leave message"),
      c("invlog joinchannel", "Set the join log channel"),
      c("invlog leavechannel", "Set the leave log channel"),
      c("invlog joinmessage", "Set the join embed"),
      c("invlog leavemessage", "Set the leave embed"),
      c("invreset <user>", "Reset invite data for a user"),
      c("invresetall", "Reset all invite data in the server"),
    ],
  },
  {
    id: "embeds",
    title: "Embed Builder",
    commands: [
      c("ed create", "Create a new embed"),
      c("ed edit <msg_id>", "Edit an existing embed"),
      c("ed delete <msg_id>", "Delete an embed"),
      c("ed restore <msg_id>", "Restore a deleted embed"),
      c("ed response add <msg_id>", "Add an interactive response to an embed"),
      c("ed response edit <msg_id>", "Edit existing responses"),
      c("ed response remove <msg_id>", "Remove embed responses"),
    ],
  },
  {
    id: "tickets",
    title: "Ticket Config",
    commands: [
      c("tc setup", "Set up a new ticket system"),
      c("tc close <closing_reason>", "Close a ticket (reason optional)"),
      c("tc rename <new_name>", "Rename the ticket channel"),
      c("tc add <user_name/user_id>", "Add a user to the ticket"),
      c("tc remove <@user/username/user_id>", "Remove a user from the ticket"),
    ],
  },
  {
    id: "sticky",
    title: "Sticky Notes",
    commands: [
      c("stick add <message>", "Add a sticky note to the current channel"),
      c("stick remove <channel>", "Remove a sticky note from a channel"),
      c("stick list", "List all sticky notes"),
    ],
  },
  {
    id: "autorole",
    title: "Auto Roles",
    commands: [
      c("autorole list", "List current autorole settings"),
      c("autorole add @role <type>", "Add a role to autorole"),
      c("autorole addmore", "Select multiple roles to add"),
      c("autorole remove @role", "Remove a role from autorole"),
      c("autorole removemore", "Select multiple roles to remove"),
    ],
  },
  {
    id: "antibot",
    title: "Anti-Bot Config",
    commands: [
      c("antibot list", "List antibot channels & bypass roles"),
      c("antibot add #channel", "Add a channel to antibot"),
      c("antibot remove #channel", "Remove a channel from antibot"),
      c("antibot addmore", "Add multiple channels via a selection menu"),
      c("antibot removemore", "Remove multiple channels via a selection menu"),
      c("antibot bypass list", "Show current bypass roles"),
      c("antibot bypass add @role", "Add a bypass role"),
      c("antibot bypass remove @role", "Remove a bypass role"),
    ],
  },
  {
    id: "moderation",
    title: "Moderation & Utility",
    commands: [
      c("nick <user>", "Reset a user's nickname"),
      c("nick <user> <new_nick>", "Update a user's nickname"),
      c("timeout <user> <time>", "Mute a user"),
      c("removetimeout <user>", "Unmute a user"),
      c("lock #channel <user/role>", "Lock a channel"),
      c("unlock #channel <user/role>", "Unlock a channel"),
      c("lockall #channel <user/role>", "Lock all channels"),
      c("unlockall #channel <user/role>", "Unlock all channels"),
      c("hide #channel <user/role>", "Hide a channel"),
      c("unhide #channel <user/role>", "Unhide a channel"),
      c("hideall #channel <user/role>", "Hide all channels"),
      c("unhideall #channel <user/role>", "Unhide all channels"),
    ],
  },
  {
    id: "giveaway",
    title: "Giveaways",
    commands: [
      c("giveaway start <time> <prize>", "Start a giveaway"),
      c("giveaway end <message_id>", "End a giveaway"),
      c("giveaway reroll <message_id>", "Reroll a giveaway winner"),
      c("giveaway list", "List active giveaways"),
      c("giveaway delete <message_id>", "Delete a giveaway"),
      c("giveaway update <message_id>", "Update a giveaway"),
    ],
  },
  {
    id: "altverify",
    title: "Alt-Verify",
    commands: [
      c("/altverify_setup", "Create verification channels & roles"),
      c("/altverify_disable", "Remove verification channels & roles"),
      c("/altverify_lockdown", "Lock new channels for unverified users"),
      c("/altverify_check", "Check a user's verification details"),
      c("/altverify_reset", "Reset a user's verification"),
      c("/altverify_reset_all", "Reset verification for everyone"),
    ],
  },
];

export const TOTAL_COMMANDS = MODULES.reduce((n, m) => n + m.commands.length, 0);

export const NAV = [
  { to: "/", label: "Overview" },
  { to: "/features", label: "Features" },
  { to: "/commands", label: "Commands" },
  { to: "/status", label: "Status" },
  { to: "/faq", label: "FAQ" },
  { to: "/credits", label: "Credits" },
] as const;

export const VERIFY_API = "https://blank.2bd.net:20136";
