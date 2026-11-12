import CoursePage, { courseMetadata } from "@/components/course/CoursePage";
import { COURSES } from "@/content/courses";

export const metadata = courseMetadata(COURSES.tafseer);

export default function Page() {
  return <CoursePage course={COURSES.tafseer} />;
}
