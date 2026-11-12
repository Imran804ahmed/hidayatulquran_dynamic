import CoursePage, { courseMetadata } from "@/components/course/CoursePage";
import { COURSES } from "@/content/courses";

export const metadata = courseMetadata(COURSES.tajweed);

export default function Page() {
  return <CoursePage course={COURSES.tajweed} />;
}
