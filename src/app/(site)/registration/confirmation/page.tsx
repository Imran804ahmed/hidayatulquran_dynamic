import { pageMetadata } from "@/lib/seo";
import Confirmation from "./Confirmation";

export const metadata = pageMetadata({
  path: "/registration/confirmation",
  title: "Registration received | HidayatulQuran Academy",
  description: "Your registration for online Quran classes has been received.",
  noindex: true,
});

export default function Page() {
  return (
    <div className="hq-page">
      <main id="main">
        <Confirmation />
      </main>
    </div>
  );
}
