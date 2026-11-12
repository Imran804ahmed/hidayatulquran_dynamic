import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { CONTENT_LAST_MODIFIED, PUBLIC_PAGES } from "@/config/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
