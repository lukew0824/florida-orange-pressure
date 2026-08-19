import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Accessibility | Florida Orange Pressure Washing",
  description: "Accessibility statement for the Florida Orange Pressure Washing website.",
  alternates: {
    canonical: "/accessibility",
  },
};

export default function AccessibilityStatement() {
  return (
    <LegalPage
      title="Accessibility Statement"
      intro="Florida Orange wants this website to be straightforward and usable for as many people as possible."
    >
      <section>
        <h2>Our approach</h2>
        <p>We work to support keyboard navigation, clear heading structure, readable contrast, descriptive labels, visible focus indicators, responsive layouts, and reduced-motion preferences.</p>
      </section>
      <section>
        <h2>Third-party content</h2>
        <p>Some embedded or linked services, including maps and social platforms, are controlled by third parties. Their accessibility may vary and is outside Florida Orange&apos;s direct control.</p>
      </section>
      <section>
        <h2>Feedback and assistance</h2>
        <p>If you have trouble using any part of this site or need information in another format, call or text <a href="tel:+13522196137">352-219-6137</a> or email <a href="mailto:austin.sollenberger@gmail.com">austin.sollenberger@gmail.com</a>. Please describe the page or feature involved, and we will make a reasonable effort to help.</p>
      </section>
    </LegalPage>
  );
}
