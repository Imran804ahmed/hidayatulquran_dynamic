import { submitRegistration } from "@/lib/portal/public-forms";

/** POST /forms/registration.php (rewritten here by next.config.ts) — registration.html form. */
export async function POST(request: Request) {
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return Response.json({ success: false, message: "Please submit the form from the website." }, { status: 400 });
  }
  try {
    const r = await submitRegistration(fd);
    return Response.json({ success: r.success, message: r.message }, { status: r.status ?? 200 });
  } catch (err) {
    console.error("[public form] registration error:", err);
    return Response.json({ success: false, message: "Sorry, something went wrong on our side. Your details were not saved; please try again." }, { status: 500 });
  }
}
