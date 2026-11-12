import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PORTAL, requirePage } from "@/lib/portal/auth";
import * as db from "@/lib/portal/db";
import { allTimezones } from "@/lib/portal/time";
import type { TeacherRow } from "@/lib/portal/teachers";
import { PageHeader } from "@/components/portal/ui";
import { TeacherForm } from "@/components/portal/teacher-forms";

export const metadata: Metadata = { title: "Edit teacher" };

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePage("teachers.edit", `${PORTAL}/teachers/${id}/edit`);
  const t = /^\d+$/.test(id) ? await db.one<TeacherRow>("SELECT * FROM hq_teachers WHERE id = ?", [Number(id)]) : null;
  if (!t) notFound();
  return (
    <>
      <PageHeader crumbs={[{ href: `${PORTAL}/teachers/${t.id}`, label: t.full_name }]} title={`Edit ${t.full_name}`} subtitle={`${t.ref_no} · Fields marked * are required.`} />
      <TeacherForm zones={allTimezones()} teacher={t} />
    </>
  );
}
