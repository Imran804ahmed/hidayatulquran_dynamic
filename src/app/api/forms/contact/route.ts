import { submitContact } from "@/lib/portal/public-forms";

/** POST /forms/contact.php (rewritten here by next.config.ts) — home page contact form. */
export async function POST(request: Request) {
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return Response.json({ success: false, message: "Please submit the form from the website." }, { status: 400 });
  }
  try {
    const r = await submitContact(fd);
    return Response.json({ success: r.success, message: r.message }, { status: r.status ?? 200 });
  } catch (err) {
    console.error("[public form] contact error:", err);
    return Response.json({ success: false, message: "Sorry, something went wrong on our side. Your message was not saved; please try again." }, { status: 500 });
  }
}
