/** hreflang code -> path of every country landing page. Each country page lists all of them. */
export const COUNTRY_HREFLANG: Record<string, string> = {
  "en-gb": "/online-quran-classes-uk",
  "en-us": "/online-quran-classes-usa",
  "en-ca": "/online-quran-classes-canada",
  "en-ae": "/online-quran-classes-uae",
  "en-sa": "/online-quran-classes-saudi-arabia",
  "en-au": "/online-quran-classes-australia",
  "en-pk": "/online-quran-classes-pakistan",
  "en-in": "/online-quran-classes-india",
  "en-de": "/online-quran-classes-germany",
  "en-fr": "/online-quran-classes-france",
  "en-ru": "/online-quran-classes-russia",
  "en-br": "/online-quran-classes-brazil",
  "en-za": "/online-quran-classes-south-africa",
  "en-qa": "/online-quran-classes-qatar",
};

/** hreflang alternates for a country page: itself first, then the other countries, then x-default. */
export function countryLanguages(selfPath: string): Record<string, string> {
  const entries = Object.entries(COUNTRY_HREFLANG);
  const self = entries.filter(([, p]) => p === selfPath);
  const rest = entries.filter(([, p]) => p !== selfPath);
  return { ...Object.fromEntries([...self, ...rest]), "x-default": "/" };
}
