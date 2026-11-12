import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { PageHeader } from "@/components/portal/ui";
import { CourseForm } from "@/components/portal/academic-forms";

export const metadata: Metadata = { title: "Edit course" };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePage("courses.edit", `${PORTAL}/courses/${id}/edit`);
  const c = /^\d+$/.test(id) ? await db.one<{ id: number; version: number; name: string; summary: string | null; public_url: string | null; status: string; sort_order: number }>("SELECT id, version, name, summary, public_url, status, sort_order FROM hq_courses WHERE id = ?", [Number(id)]) : null;
  if (!c) notFound();
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/courses/${c.id}`, label: c.name }]} title={`Edit ${c.name}`} />
      <CourseForm course={c} />
    </>
  );
}
