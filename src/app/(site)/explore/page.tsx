import { pageMetadata } from "@/lib/seo";
import ExploreMain from "@/components/explore/ExploreMain";

export const metadata = pageMetadata({
  path: "/explore",
  title: "Online Quran Courses — Noorani Qaida, Tajweed, Hifz and More | HidayatulQuran",
  description: "Explore all online Quran courses at HidayatulQuran Academy — Noorani Qaida, Quran Reading, Tajweed, Hifz, Tafseer and Quranic Arabic. 1-on-1 live classes for kids and adults.",
});

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const { course } = await searchParams;
  return <ExploreMain course={typeof course === "string" ? course : undefined} />;
}
