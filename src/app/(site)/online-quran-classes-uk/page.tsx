import CountryPage, { countryMetadata } from "@/components/country/CountryPage";
import { COUNTRIES } from "@/content/countries";

export const metadata = countryMetadata(COUNTRIES.uk);

export default function Page() {
  return <CountryPage country={COUNTRIES.uk} />;
}
