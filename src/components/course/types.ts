import type { ReactNode } from "react";

/** Content of one course page (see src/content/courses.tsx). */
export type CourseContent = {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  ogTitle: string;
  ogDescription: string;
  image: string;
  imageAlt: string;
  /** Visible page title (h1). */
  name: string;
  /** Last crumb in the visible breadcrumb. */
  breadcrumb: string;
  /** schema.org Course data (may differ from the visible copy). */
  schema: { name: string; description: string; educationalLevel: string; breadcrumb: string };
  introHeading: string;
  intro: ReactNode[];
  learnHeading: string;
  learn: ReactNode[];
  audience: ReactNode[];
};
