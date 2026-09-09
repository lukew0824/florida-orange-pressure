import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://floridaorangepressure.com"),
  title: "Pressure Washing & Paver Sealing | Florida Orange",
  description:
    "Owner-operated pressure washing and paver sealing serving Ponte Vedra, Jacksonville, St. Augustine, and surrounding Northeast Florida communities. Free estimates.",
  keywords: [
    "pressure washing Ponte Vedra",
    "paver sealing Nocatee",
    "pressure washing Jacksonville",
    "soft washing St. Augustine",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Florida Orange Pressure Washing",
    description:
      "Exterior cleaning and paver sealing done right across Northeast Florida.",
    url: "https://floridaorangepressure.com",
    siteName: "Florida Orange Pressure Washing",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/florida-orange-rig.webp",
        width: 1200,
        height: 800,
        alt: "Florida Orange pressure-washing rig",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Florida Orange Pressure Washing",
    description:
      "Exterior cleaning and paver sealing done right across Northeast Florida.",
    images: ["/assets/florida-orange-rig.webp"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
