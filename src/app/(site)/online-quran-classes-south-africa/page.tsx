import CountryPage, { countryMetadata } from "@/components/country/CountryPage";
import { COUNTRIES } from "@/content/countries";

export const metadata = countryMetadata(COUNTRIES.southAfrica);

export default function Page() {
  return <CountryPage country={COUNTRIES.southAfrica} />;
}
