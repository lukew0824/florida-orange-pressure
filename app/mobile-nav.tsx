"use client";

import { useState } from "react";

export function MobileNav({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={open ? "mobile-menu is-open" : "mobile-menu"}>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav aria-label="Mobile navigation">
        <a href="#services">Services</a>
        <a href="#sealing">Sealing</a>
        <a href="#area">Service Area</a>
        <a href="#about">About</a>
        <a href={phoneHref}>Call {phone}</a>
        <a className="orange-button" href="#contact">Get a Free Estimate</a>
      </nav>
    </div>
  );
}
