import { EstimateForm } from "./estimate-form";
import { MobileNav } from "./mobile-nav";

const PHONE = "352-219-6137";
const PHONE_HREF = "tel:+13522196137";

function InstagramIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <defs>
        <linearGradient id="instagram-gradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.35" stopColor="#FA7E1E" />
          <stop offset="0.6" stopColor="#D62976" />
          <stop offset="0.8" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" stroke="url(#instagram-gradient)" />
      <circle cx="12" cy="12" r="4.4" stroke="url(#instagram-gradient)" />
      <circle cx="17.6" cy="6.4" r="1.15" fill="#D62976" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.25 10.44 22v-7.02H7.9v-2.92h2.54v-2.2c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.92h-2.33V22C18.34 21.25 22 17.08 22 12.06Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="footer-google-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.6h12c-.2 2-1.5 5-4.4 7l6.7 5.2c4-3.7 6.8-9.1 6.8-15.8Z" />
      <path fill="#34A853" d="M24 46c6 0 11-2 14.3-5.7l-6.7-5.2c-1.8 1.3-4.3 2.2-7.6 2.2-6 0-11-4-12.8-9.4l-7 5.4C7.5 41 15.2 46 24 46Z" />
      <path fill="#FBBC05" d="M11.2 27.9c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7-5.4C2.8 16.6 2 20.2 2 23.5s.8 6.9 2.2 9.8l7-5.4Z" />
      <path fill="#EA4335" d="M24 10.1c4.2 0 7.1 1.8 8.7 3.3l6.3-6.1C35 3.7 30 1.5 24 1.5 15.2 1.5 7.5 6.5 4.2 13.7l7 5.4C13 13.7 18 10.1 24 10.1Z" />
    </svg>
  );
}

const services = [
  {
    number: "01",
    title: "Driveways & hardscapes",
    detail: "Concrete, pavers, and walkways cleaned without stripping color or loosening joints",
    image: "/assets/driveway-clean.webp",
    imageAlt: "Clean interlocking paver driveway after pressure washing",
    imageWidth: 1179,
    imageHeight: 1520,
  },
  {
    number: "02",
    title: "House & soft washing",
    detail: "Siding, stucco, and trim washed at the right pressure so paint and caulking stay intact",
    image: "/assets/soft-wash-house.webp",
    imageAlt: "Clean yellow house siding after a soft wash",
    imageWidth: 1095,
    imageHeight: 816,
  },
  {
    number: "03",
    title: "Fences",
    detail: "Vinyl and wood fencing scrubbed clean without warping boards or fading the finish",
    image: "/assets/fence-clean.webp",
    imageAlt: "Bright white vinyl fence after cleaning",
    imageWidth: 660,
    imageHeight: 495,
  },
  {
    number: "04",
    title: "Pool decks & outdoor living",
    detail: "Pool decks, patios, and lanais cleaned safe for bare feet and pets",
    image: "/assets/pool-deck-clean.webp",
    imageAlt: "Clean pool deck surrounding a screened-in swimming pool",
    imageWidth: 765,
    imageHeight: 1020,
  },
];

const sealingBenefits = [
  "Protects against UV and weather exposure",
  "Enhances natural color",
  "Helps resist stains, algae, and moisture",
  "Stabilizes and protects joint sand",
  "Makes pavers easier to maintain",
  "Extends the life of your hardscape",
];

const testimonial = {
  name: "Rich Davidson",
  quote: "Austin did a great job! Very professional, meticulous attention to detail and overall great service!",
};

const areas = [
  "Ponte Vedra",
  "Ponte Vedra Beach",
  "Nocatee",
  "St. Augustine",
  "Jacksonville",
  "Jacksonville Beach",
  "Neptune & Atlantic Beach",
  "Fruit Cove & Julington Creek",
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Florida Orange Pressure Washing LLC",
    telephone: "+1-352-219-6137",
    email: "austin.sollenberger@gmail.com",
    image: "/assets/florida-orange-rig.webp",
    areaServed: ["Ponte Vedra", "Jacksonville", "St. Augustine", "St. Johns County", "Duval County"],
    sameAs: [
      "https://www.instagram.com/florida_orange_pressurewashing/",
      "https://www.facebook.com/share/182dqsFzk2/",
    ],
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Florida Orange home">
          <img src="/assets/florida-orange-logo.png" alt="Florida Orange Pressure Washing LLC" width="1063" height="584" />
          <span>
            <strong>Florida Orange</strong>
            <small>Pressure Washing · Northeast Florida</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#sealing">Sealing</a>
          <a href="#area">Service Area</a>
          <a href="#about">About</a>
          <a className="nav-phone" href={PHONE_HREF}>{PHONE}</a>
          <a className="nav-estimate" href="#contact">Get a Free Estimate</a>
        </nav>

        <MobileNav phone={PHONE} phoneHref={PHONE_HREF} />
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src="/assets/florida-orange-rig.webp"
            alt="Florida Orange's orange work car towing the pressure-washing trailer"
            width="1200"
            height="800"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">Austin Sollenberger · <span className="nowrap">Owner-Operated</span></p>
            <h1 id="hero-title">Exterior cleaning<br />done right.</h1>
            <p className="hero-copy">
              Pressure washing, soft washing, and paver sealing in Ponte Vedra,
              Jacksonville, St. Augustine, and the surrounding Northeast Florida service area.
            </p>
            <div className="hero-actions">
              <a className="orange-button" href={PHONE_HREF}>Call or text {PHONE}</a>
              <a className="outline-button" href="#contact">Get a free estimate</a>
            </div>
            <p className="hero-note">Free estimates · Same-week scheduling</p>
          </div>
        </section>

        <section className="trust-strip" aria-label="Florida Orange service highlights">
          <div><strong>5.0 Google rating</strong><span>Verified customer reviews</span></div>
          <div><strong>Owner-operated</strong><span>Austin is on every job</span></div>
          <div><strong>Free estimates</strong><span>Quoted before work begins</span></div>
          <div><strong>Northeast Florida</strong><span>St. Johns & Duval counties</span></div>
        </section>

        <section className="content-section services-section" id="services" aria-labelledby="services-title">
          <div className="services-heading">
            <p className="eyebrow">Pressure washing</p>
            <div className="section-heading-row">
              <h2 id="services-title">What we do</h2>
              <div className="recent-work-link">
                <span>See more work</span>
                <a href="https://www.instagram.com/florida_orange_pressurewashing/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href="https://www.facebook.com/share/182dqsFzk2/" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="services-layout">
            <div className="services-copy-column">
              <p className="services-intro">
                Driveways, siding, fences, and pool decks: professional-grade
                pressure washing and soft washing for every exterior
                surface, done right the first time. We match the pressure,
                cleaner, and technique to each material, so concrete gets
                blasted clean while siding and pavers get the gentler touch
                they need to stay in good shape for years to come.
              </p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <article className="service-item" key={service.number}>
                  <div className="service-copy">
                    <span className="service-number">{service.number}</span>
                    <h3>{service.title}</h3>
                  </div>
                  <div className="photo-slot has-photo service-photo">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      width={service.imageWidth}
                      height={service.imageHeight}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <small className="service-tags">{service.detail}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section sealing-section" id="sealing" aria-labelledby="sealing-title">
          <div className="sealing-grid">
            <div className="sealing-copy">
              <p className="eyebrow">Sealing</p>
              <h2 id="sealing-title">Protect & enhance your pavers</h2>
              <p>
                Paver sealing helps protect your investment while restoring and
                enhancing the natural color of your pavers. A quality sealer creates
                a protective barrier against Florida&apos;s intense UV exposure, rain,
                moisture, stains, algae growth, and everyday wear.
              </p>
              <p>
                Florida Orange uses <strong>Cobble-Loc</strong>, a professional-grade
                two-component sealer, with <strong>Trident premium C-144 joint sand</strong>
                to stabilize the pavers, fill washed-out joints, and keep the finish clean.
              </p>
              <p className="benefit-label">Why seal your pavers?</p>
              <div className="benefit-grid">
                {sealingBenefits.map((benefit) => (
                  <div key={benefit}><span>+</span><p>{benefit}</p></div>
                ))}
              </div>
            </div>
            <div className="sealing-photos">
              <div className="photo-slot has-photo sealing-photo">
                <img src="/assets/paver-driveway-finished.webp" alt="Paver driveway cleaned and prepared for sealing" width="1200" height="1600" loading="lazy" decoding="async" />
              </div>
              <div className="photo-slot has-photo sealing-photo">
                <img src="/assets/paver-driveway-curing.webp" alt="Freshly sealed paver driveway curing behind caution tape" width="1200" height="1600" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section className="content-section contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">Get in touch</p>
              <h2 id="contact-title">Request a free estimate</h2>
              <p>
                Send a few details and Austin will get back to you with a price,
                or call or text <a href={PHONE_HREF}>{PHONE}</a> to talk it through.
              </p>
              <EstimateForm />
            </div>
            <div className="contact-divider" aria-hidden="true" />
            <div className="contact-details" id="area">
              <p className="eyebrow contact-details-heading">Service area</p>
              <div className="area-tags">
                {areas.map((area) => (
                  <span key={area} className={area === "Nocatee" ? "area-tag area-tag--home" : "area-tag"}>
                    {area}
                  </span>
                ))}
              </div>
              <div className="county-map-frame">
                <iframe src="/assets/service-area-map.html" title="Map of Florida with St. Johns and Duval counties highlighted" loading="lazy" />
                <div className="map-legend">
                  <span><i className="stjohns-key" />St. Johns County</span>
                  <span><i className="duval-key" />Duval County</span>
                </div>
              </div>
              <p className="map-note">Jobs outside St. Johns and Duval by arrangement.</p>
            </div>
          </div>
        </section>

        <section className="content-section about-section" id="about" aria-labelledby="about-title">
          <div className="about-grid">
            <div className="about-heading">
              <p className="eyebrow">About</p>
              <h2 id="about-title">Meet Austin.</h2>
            </div>
            <p className="about-para about-para-1">
              Florida Orange is owner-operated, the person who quotes your job is
              the person who shows up and does it. On time, courteous, and priced
              fairly, with no upselling and no surprises on the invoice.
            </p>
            <div className="photo-slot has-photo about-photo">
              <img src="/assets/austin-sollenberger.webp" alt="Austin Sollenberger, owner of Florida Orange Pressure Washing" width="1050" height="1400" loading="lazy" decoding="async" />
            </div>
            <p className="about-para about-para-2">
              Austin checks the work with you before pulling out of the driveway.
              If something is not right, he will make it right.
            </p>
            <div className="about-media">
              <p className="about-rating-label">Leave us a review</p>
              <a className="about-rating" href="https://share.google/h75AAtK9pGtpQ15ew" target="_blank" rel="noreferrer">
                <GoogleIcon />
                <span className="about-rating-stars" aria-hidden="true">★★★★★</span>
                <strong>5.0 on Google</strong>
              </a>
              <div className="review-card">
                <span className="review-card-stars" aria-hidden="true">★★★★★</span>
                <p className="review-card-quote">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="review-card-name">{testimonial.name}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-row">
          <p className="footer-address">Florida Orange Pressure Washing LLC · Nocatee, Florida</p>
          <div className="footer-links">
            <div className="footer-column">
              <h2>Contact</h2>
              <a href={PHONE_HREF}>{PHONE}</a>
              <a href="mailto:austin.sollenberger@gmail.com">austin.sollenberger@gmail.com</a>
            </div>
            <div className="footer-column footer-social">
              <h2>Follow</h2>
              <a href="https://www.instagram.com/florida_orange_pressurewashing/" target="_blank" rel="noreferrer"><InstagramIcon /><span>Instagram</span></a>
              <a href="https://www.facebook.com/share/182dqsFzk2/" target="_blank" rel="noreferrer"><FacebookIcon /><span>Facebook</span></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Florida Orange Pressure Washing LLC. All rights reserved.</span>
          <nav aria-label="Legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="/accessibility">Accessibility</a>
          </nav>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
