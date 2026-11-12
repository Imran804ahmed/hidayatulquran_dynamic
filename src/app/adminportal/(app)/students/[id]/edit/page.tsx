import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { allTimezones } from "@/lib/portal/time";
import type { StudentRow } from "@/lib/portal/students";
import { PageHeader } from "@/components/portal/ui";
import { StudentForm } from "@/components/portal/records";

export const metadata: Metadata = { title: "Edit student" };

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePage("students.edit", `${PORTAL}/students/${id}/edit`);
  const s = /^\d+$/.test(id) ? await db.one<StudentRow>("SELECT * FROM hq_students WHERE id = ?", [Number(id)]) : null;
  if (!s) notFound();
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/students/${s.id}`, label: s.full_name }]} title={`Edit ${s.full_name}`} subtitle={`${s.ref_no} · Fields marked * are required.`} />
      <StudentForm zones={allTimezones()} student={{ ...s, registered_on: s.registered_at?.slice(0, 10) ?? null }} />
    </>
  );
}
