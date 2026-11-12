/**
 * Permission matrix (safe to import on client and server). Super Admins hold every permission,
 * including the reserved ones; Admin/Coordinator accounts hold only what is assigned to them.
 * Enforcement always happens on the server (lib/portal/auth.ts).
 */
export const PERMISSION_MATRIX = {
  Dashboard: {
    "dashboard.view": "View dashboard",
  },
  Students: {
    "students.view": "View students and their contact details",
    "students.create": "Add students",
    "students.edit": "Edit students, activate / deactivate",
    "students.archive": "Archive / restore students",
    "students.export": "Export students (CSV)",
  },
  Teachers: {
    "teachers.view": "View teachers",
    "teachers.create": "Add teachers",
    "teachers.edit": "Edit teachers, activate / deactivate, reassign students",
    "teachers.archive": "Archive / restore teachers",
    "teachers.export": "Export teachers (CSV)",
  },
  Registrations: {
    "registrations.view": "View registration requests",
    "registrations.edit": "Review: status, assignment, notes, follow-ups, reject / reopen",
    "registrations.convert": "Convert a registration into a student record (sensitive)",
    "registrations.export": "Export registrations (CSV)",
  },
  Enquiries: {
    "enquiries.view": "View enquiries",
    "enquiries.edit": "Handle: status, assignment, notes, follow-ups",
    "enquiries.export": "Export enquiries (CSV)",
  },
  "Courses & classes": {
    "courses.view": "View courses, enrolments and the timetable",
    "courses.edit": "Create and edit courses",
    "enrolments.manage": "Enrol students, assign teachers, schedule classes, see meeting links",
    "enrolments.export": "Export enrolments (CSV)",
  },
  "Reports & history": {
    "reports.view": "View reports",
    "audit.view": "View audit history",
  },
  Settings: {
    "settings.manage": "Change academy settings",
  },
} as const;

type Matrix = typeof PERMISSION_MATRIX;
export type AssignablePermission = { [G in keyof Matrix]: keyof Matrix[G] }[keyof Matrix];
/** Reserved for Super Admins; never assignable, which prevents privilege escalation. */
export type ReservedPermission = "users.manage";
export type Permission = AssignablePermission | ReservedPermission;

export const ASSIGNABLE: AssignablePermission[] = Object.values(PERMISSION_MATRIX).flatMap(
  (g) => Object.keys(g) as AssignablePermission[],
);

export function isAssignable(p: string): p is AssignablePermission {
  return (ASSIGNABLE as string[]).includes(p);
}

/** Suggested starting set for a new coordinator (a Super Admin can change it). */
export const COORDINATOR_DEFAULTS: AssignablePermission[] = [
  "dashboard.view", "students.view", "students.create", "students.edit", "teachers.view",
  "registrations.view", "registrations.edit", "enquiries.view", "enquiries.edit", "courses.view",
];
