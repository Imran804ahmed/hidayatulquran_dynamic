import "server-only";
import { PORTAL, can, type SessionUser } from "./auth";

/** Icon colour family, used for the sidebar icon tint and the dashboard module tile. */
export type ModuleTone = "purple" | "pink" | "teal" | "amber" | "sky" | "coral" | "indigo" | "slate";

export type PortalModule = { key: string; href: string; label: string; icon: string; tone: ModuleTone; description: string };
export type ModuleGroup = { title: string; items: PortalModule[] };

/**
 * The portal's sections, filtered by the signed-in user's permissions. The sidebar and the
 * dashboard module grid both read from here, so they always show the same set.
 */
export function portalModules(user: SessionUser): ModuleGroup[] {
  const p = (path: string) => `${PORTAL}/${path}`;
  const m = (key: string, label: string, icon: string, tone: ModuleTone, description: string): PortalModule =>
    ({ key, href: p(key), label, icon, tone, description });
  const groups: ModuleGroup[] = [
    { title: "Overview", items: can(user, "dashboard.view") ? [m("dashboard", "Dashboard", "grid-1x2-fill", "sky", "Work queue and key figures")] : [] },
    {
      title: "Admissions",
      items: [
        ...(can(user, "registrations.view") ? [m("registrations", "Registrations", "person-plus-fill", "purple", "Review and convert website sign-ups")] : []),
        ...(can(user, "enquiries.view") ? [m("enquiries", "Enquiries", "envelope-fill", "pink", "Answer contact-form messages")] : []),
      ],
    },
    {
      title: "People",
      items: [
        ...(can(user, "students.view") ? [m("students", "Students", "people-fill", "teal", "Student records and contacts")] : []),
        ...(can(user, "teachers.view") ? [m("teachers", "Teachers", "person-badge-fill", "amber", "Teacher profiles and availability")] : []),
      ],
    },
    {
      title: "Academics",
      items: can(user, "courses.view")
        ? [
            m("courses", "Courses", "book-fill", "indigo", "Courses offered by the academy"),
            m("enrolments", "Enrolments", "journal-check", "teal", "Student course enrolments"),
            m("timetable", "Timetable", "calendar-week-fill", "coral", "Weekly class schedule"),
          ]
        : [],
    },
    {
      title: "Administration",
      items: [
        ...(can(user, "reports.view") ? [m("reports", "Reports", "bar-chart-line-fill", "purple", "Admissions and academic reports")] : []),
        ...(can(user, "audit.view") ? [m("audit", "Audit history", "clock-history", "slate", "Who changed what, and when")] : []),
        ...(can(user, "users.manage") ? [m("users", "Users & roles", "shield-lock-fill", "sky", "Portal accounts and permissions")] : []),
        ...(can(user, "settings.manage") ? [m("settings", "Settings", "gear-fill", "slate", "Academy and portal settings")] : []),
      ],
    },
  ];
  return groups.filter((g) => g.items.length > 0);
}
