/** Site-wide constants for the public website. Change contact details here only. */
export const SITE = {
  name: "HidayatulQuran Academy",
  shortName: "HidayatulQuran",
  url: "https://www.hidayatulquran.com",
  logo: "/assets/img/hidayatulquran1.png",
  email: "info@hidayatulquran.com",
  phone: { pk: "+923365398542", uk: "+447376282389" },
  whatsappNumber: "923365398542",
} as const;

/** Favicon set (generated from the logo artwork). Used by every root layout: site, admin portal, 404. */
export const SITE_ICONS = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/assets/img/favicon.png", type: "image/png", sizes: "32x32" },
    { url: "/assets/img/icon-192.png", type: "image/png", sizes: "192x192" },
    { url: "/assets/img/icon-512.png", type: "image/png", sizes: "512x512" },
  ],
  shortcut: "/favicon.ico",
  apple: { url: "/assets/img/apple-touch-icon.png", sizes: "180x180" },
};

/** WhatsApp chat link with a prefilled message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message).replace(/'/g, "%27")}`;
}

/** Default "book a free trial" WhatsApp link used across the site. */
export const WHATSAPP_TRIAL = whatsappLink("Assalamu Alaikum, I want to book a free trial Quran class.");

/** Absolute URL for a site path, e.g. absoluteUrl("/about"). */
export const absoluteUrl = (path = "/") => new URL(path, SITE.url).toString();

export const SOCIAL_LINKS = [
  { label: "Facebook page", icon: "bi-facebook", href: "https://www.facebook.com/profile.php?id=61586928376019" },
  { label: "Instagram page", icon: "bi-instagram", href: "https://www.instagram.com/hidayatulquranofficiall/" },
  { label: "YouTube channel", icon: "bi-youtube", href: "https://www.youtube.com/channel/UCDiUcDx4tqPCqvENApO9Gvg" },
] as const;
