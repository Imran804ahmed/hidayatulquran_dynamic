import { Croissant_One, Nunito, Open_Sans, Poppins } from "next/font/google";

// Self-hosted at build time by next/font (no requests to Google from the visitor's browser).
// Each font is exposed as a CSS variable used by the stylesheets, e.g. var(--font-nunito).
// Weights match what the site always loaded (300–700), so bold text renders exactly as before
// (the full variable fonts would make `font-weight: bolder` render heavier).

export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-open-sans",
  display: "swap",
});

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

export const croissantOne = Croissant_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-croissant-one",
  display: "swap",
});

/** Class names that declare all font variables; put on <html>. */
export const fontVariables = [openSans, nunito, poppins, croissantOne].map((f) => f.variable).join(" ");

// Admin portal: the weights its stylesheet uses (headings go up to 800).
export const portalNunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const portalOpenSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});
