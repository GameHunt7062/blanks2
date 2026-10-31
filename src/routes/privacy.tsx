import { createFileRoute } from "@tanstack/react-router";
import { LegalDoc } from "@/components/LegalDoc";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BlanK-VisionS" },
      { name: "description", content: "What data BlanK-VisionS accesses, how it is used, and how to request deletion." },
      { property: "og:title", content: "Privacy Policy — BlanK-VisionS" },
      { property: "og:description", content: "What data BlanK-VisionS accesses and how it is used." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

const DATA = [
  ["Discord User IDs & Server IDs", "Core bot operation and configuration"],
  ["Channel & Role IDs", "Server setup, permissions, verification"],
  ["Member roles & join/leave events", "Auto-role, logging, moderation features"],
  ["Message content", "Command execution only — not stored permanently"],
  ["Presence status", "Real-time processing only, if feature is enabled"],
];

function Privacy() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="December 2025"
      intro="This Privacy Policy applies to all bots created, maintained, and operated by BlanK-VisionS. By using any of our bots, you acknowledge this policy."
      sections={[
        {
          id: "access", title: "Data We Access",
          body: (
            <>
              <p>Depending on the features enabled and permissions granted, our bots may access:</p>
              <div className="overflow-hidden rounded-lg border border-border">
                {DATA.map(([d, p]) => (
                  <div key={d} className="grid grid-cols-2 gap-4 border-b border-border bg-surface px-3 py-2 text-xs last:border-0">
                    <span className="font-mono text-foreground">{d}</span><span>{p}</span>
                  </div>
                ))}
              </div>
              <p><strong>We do not collect:</strong> email addresses, real names, payment information, or any personally identifiable information outside of Discord.</p>
            </>
          ),
        },
        {
          id: "use", title: "How Data Is Used",
          body: (
            <>
              <ul>
                <li>Process slash and prefix commands in real time</li>
                <li>Configure and manage Discord server settings</li>
                <li>Provide moderation, automation, and utility features</li>
                <li>Manage roles, permissions, and server structure</li>
                <li>Detect alt accounts via hashed IP comparison (AltVerify only)</li>
              </ul>
              <p>Data is never used for advertising, profiling, or any purpose beyond bot operation.</p>
            </>
          ),
        },
        {
          id: "storage", title: "Data Storage",
          body: (
            <ul>
              <li>Only minimal configuration data is stored (server settings, role IDs, etc.)</li>
              <li>Message content is not permanently stored</li>
              <li>Presence data is processed in real time and not logged</li>
              <li>AltVerify stores a one-way SHA-256 hash of your IP — your real IP is never stored and cannot be recovered</li>
            </ul>
          ),
        },
        {
          id: "sharing", title: "Data Sharing",
          body: (
            <ul>
              <li>We do not sell, share, or trade any user data</li>
              <li>No data is used for advertising or third-party tracking</li>
              <li>Data is only passed to Discord's own API for required bot functionality</li>
              <li>We may disclose data if required by a valid legal process</li>
            </ul>
          ),
        },
        {
          id: "control", title: "User Control & Opt-Out",
          body: (
            <ul>
              <li>Restricting the bot's Discord permissions</li>
              <li>Adjusting personal Discord privacy settings</li>
              <li>Removing the bot from the server entirely</li>
              <li>Contacting us to request data deletion</li>
            </ul>
          ),
        },
        { id: "security", title: "Security", body: <p>We follow Discord API best practices and take reasonable steps to secure stored data. Access is restricted to the BlanK-VisionS development team.</p> },
        {
          id: "compliance", title: "Compliance",
          body: <ul><li>Discord Developer Terms of Service</li><li>Discord Developer Policy</li><li>Discord Community Guidelines</li></ul>,
        },
        {
          id: "contact", title: "Contact",
          body: (
            <ul>
              <li>Discord Support: <a href={SITE.support} target="_blank" rel="noreferrer">discord.gg/3MJAYraXu8</a></li>
              <li>GitHub: <a href={SITE.github} target="_blank" rel="noreferrer">github.com/GameHunt7062</a></li>
              <li>Top.gg: <a href={SITE.vote} target="_blank" rel="noreferrer">top.gg/bot/{SITE.clientId}</a></li>
            </ul>
          ),
        },
      ]}
    />
  );
}
