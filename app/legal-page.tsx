import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header legal-header">
        <a className="brand" href="/" aria-label="Florida Orange home">
          <img src="/assets/florida-orange-logo.png" alt="Florida Orange Pressure Washing LLC" width="1063" height="584" />
          <span>
            <strong>Florida Orange</strong>
            <small>Pressure Washing · Northeast Florida</small>
          </span>
        </a>
        <a className="legal-back-link" href="/">Back to website</a>
      </header>

      <main className="legal-page" id="main-content">
        <article>
          <p className="eyebrow">Legal</p>
          <h1>{title}</h1>
          <p className="legal-intro">{intro}</p>
          <p className="legal-updated">Last updated August 18, 2026</p>
          <div className="legal-content">{children}</div>
        </article>
      </main>

      <footer className="legal-footer">
        <span>© 2026 Florida Orange Pressure Washing LLC.</span>
        <a href="mailto:austin.sollenberger@gmail.com">austin.sollenberger@gmail.com</a>
      </footer>
    </>
  );
}
