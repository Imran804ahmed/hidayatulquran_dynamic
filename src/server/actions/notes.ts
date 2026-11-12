"use server";

import * as db from "@/lib/portal/db";
import { audit } from "@/lib/portal/audit";
import { PORTAL, requireAction } from "@/lib/portal/auth";
import { int, runAction, str, type ActionState } from "@/lib/portal/form";
import type { Permission } from "@/lib/portal/permissions";

const TYPES: Record<string, { table: string; perm: Permission; path: string }> = {
  student: { table: "hq_students", perm: "students.edit", path: "students" },
  teacher: { table: "hq_teachers", perm: "teachers.edit", path: "teachers" },
  registration: { table: "hq_registrations", perm: "registrations.edit", path: "registrations" },
  enquiry: { table: "hq_enquiries", perm: "enquiries.edit", path: "enquiries" },
};

/** Adds a private staff note. The note text is never copied into the audit log or shown publicly. */
export async function addNoteAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(prev, fd, async () => {
    const type = str(fd, "entity_type", 20);
    const id = int(fd, "entity_id");
    const cfg = TYPES[type];
    if (!cfg || !id) return { message: "Unknown record." };
    const user = await requireAction(cfg.perm);
    const body = typeof fd.get("body") === "string" ? (fd.get("body") as string).trim() : "";
    if (!body) return { errors: { body: "Write a note before saving." } };
    if (body.length > 5000) return { errors: { body: "Notes can be at most 5,000 characters." } };
    if (!(await db.value(`SELECT id FROM ${cfg.table} WHERE id = ?`, [id]))) return { message: "This record no longer exists." };
    await db.insert("hq_notes", { entity_type: type, entity_id: id, user_id: user.id, body, created_at: db.nowUtc() });
    await audit(user.id, `${type}.note_added`, "Added a private note", type as "student", id);
    return { redirectTo: `${PORTAL}/${cfg.path}/${id}#notes`, flash: "Note added." };
  });
}
