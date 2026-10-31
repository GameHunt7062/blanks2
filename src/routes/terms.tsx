import { createFileRoute } from "@tanstack/react-router";
import { LegalDoc } from "@/components/LegalDoc";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — BlanK-VisionS" },
      { name: "description", content: "The terms that govern your use of the BlanK-VisionS Discord bot." },
      { property: "og:title", content: "Terms of Service — BlanK-VisionS" },
      { property: "og:description", content: "The terms that govern your use of the BlanK-VisionS Discord bot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="December 2025"
      intro="By adding BlanK-VisionS to a server or using any of its commands, you agree to these terms. If you do not agree, remove the bot from your server."
      sections={[
        { id: "use", title: "Acceptable Use", body: <ul><li>Do not use the bot to spam, harass, or harm users or servers</li><li>Do not attempt to exploit, overload, or reverse-engineer the bot</li><li>Do not use the bot to violate Discord's Terms or Community Guidelines</li></ul> },
        { id: "eligibility", title: "Eligibility", body: <p>You must meet Discord's minimum age requirement in your country to use the bot.</p> },
        { id: "service", title: "Service Availability", body: <p>The bot is provided free of charge, "as is" and "as available". We aim for high uptime but do not guarantee uninterrupted service, and features may change or be removed at any time.</p> },
        { id: "termination", title: "Termination", body: <p>We may restrict or blacklist any user or server that abuses the bot or violates these terms, without prior notice.</p> },
        { id: "liability", title: "Limitation of Liability", body: <p>BlanK-VisionS is not responsible for any loss of data, server damage, or issues arising from misconfiguration or use of the bot. Server administrators are responsible for how they configure it.</p> },
        { id: "privacy", title: "Privacy", body: <p>Your use of the bot is also governed by our <a href="/privacy">Privacy Policy</a>.</p> },
        { id: "changes", title: "Changes to These Terms", body: <p>We may update these terms. Continued use of the bot after changes means you accept the revised terms.</p> },
        { id: "contact", title: "Contact", body: <p>Questions? Reach us in the <a href={SITE.support} target="_blank" rel="noreferrer">support server</a>.</p> },
      ]}
    />
  );
}
