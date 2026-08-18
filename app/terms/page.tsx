import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = {
  title: "Terms of Use | Florida Orange Pressure Washing",
  description: "Website terms of use for Florida Orange Pressure Washing.",
};

export default function TermsOfUse() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These terms govern use of the Florida Orange Pressure Washing website."
    >
      <section>
        <h2>Website information</h2>
        <p>Website content is provided for general information about Florida Orange Pressure Washing LLC and its services. We may update services, availability, pricing information, or site content at any time.</p>
      </section>
      <section>
        <h2>Estimates and service agreements</h2>
        <p>An online estimate request is not a contract or guarantee of price, availability, or service. Final scope and pricing may depend on property conditions, access, measurements, and an on-site review. Work begins only after the parties agree to the applicable scope and terms.</p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>Do not misuse the website, interfere with its operation, submit false or unlawful requests, attempt unauthorized access, or use site content in a way that infringes the rights of Florida Orange or others.</p>
      </section>
      <section>
        <h2>Third-party services</h2>
        <p>Links and embedded features from Google, Instagram, Facebook, and other third parties are provided for convenience. Florida Orange does not control and is not responsible for third-party content, availability, or policies.</p>
      </section>
      <section>
        <h2>Disclaimer and limitation</h2>
        <p>The website is provided on an “as available” basis. To the extent permitted by law, Florida Orange is not liable for indirect or consequential losses arising from use of the website or reliance on its general content.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions about these terms may be sent to <a href="mailto:austin.sollenberger@gmail.com">austin.sollenberger@gmail.com</a>.</p>
      </section>
    </LegalPage>
  );
}
