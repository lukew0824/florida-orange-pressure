import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Florida Orange Pressure Washing",
  description: "Privacy policy for the Florida Orange Pressure Washing website and estimate form.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what information Florida Orange collects through this website and how it is used."
    >
      <section>
        <h2>Information we collect</h2>
        <p>When you request an estimate, we may collect your name, phone number, selected service, property address, and the project details you provide. The site may also process basic technical information needed for security, spam prevention, and reliable form delivery.</p>
      </section>
      <section>
        <h2>How we use information</h2>
        <p>We use submitted information to prepare an estimate, contact you about the requested work, schedule service, provide customer support, and protect the website from misuse. We do not sell personal information.</p>
      </section>
      <section>
        <h2>Service providers and links</h2>
        <p>Information may be processed by service providers that help operate the website or deliver estimate notifications. The site also links to third-party services such as Google Maps, Google Reviews, Instagram, and Facebook, which have their own privacy practices.</p>
      </section>
      <section>
        <h2>Retention and security</h2>
        <p>We keep information only as long as reasonably needed for estimates, service records, legal obligations, and business operations. Reasonable safeguards are used, but no online system can guarantee absolute security.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>To ask about, correct, or request deletion of information you submitted, contact Austin at <a href="mailto:austin.sollenberger@gmail.com">austin.sollenberger@gmail.com</a> or <a href="tel:+13522196137">352-219-6137</a>.</p>
      </section>
    </LegalPage>
  );
}
