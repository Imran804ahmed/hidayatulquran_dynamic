"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

type Plan = { plan: number; course: string; name: string; price: string; description: string[] };

const features = (days: number) => [
  "Free Registration",
  `${days} Classes Per Week`,
  `${days * 4} Classes Per Month`,
  "30 Minutes Class Duration",
  "One to One Classes",
  "24/7 Classes",
];

const plans = (bronze: string, silver: string, gold: string): Plan[] => [
  { plan: 3, course: "Bronze Package", name: "3 Days Plan", price: bronze, description: features(3) },
  { plan: 4, course: "Silver Package", name: "4 Days Plan", price: silver, description: features(4) },
  { plan: 5, course: "Gold Package", name: "5 Days Plan", price: gold, description: features(5) },
];

// Country-based pricing data with currency symbols
const pricingData = {
  canada: { currency: "CAD", symbol: "$", plans: plans("35", "40", "45") },
  usa: { currency: "USD", symbol: "$", plans: plans("20", "25", "30") },
  uk: { currency: "GBP", symbol: "GBP", plans: plans("22", "25", "28") },
  uae: { currency: "AED", symbol: "AED", plans: plans("110", "140", "160") },
  ksa: { currency: "SAR", symbol: "SAR", plans: plans("110", "140", "160") },
  ger: { currency: "EUR", symbol: "EUR", plans: plans("22", "25", "28") },
};
type Country = keyof typeof pricingData;

const buttons: Array<[Country, React.ReactNode]> = [
  ["canada", "Canada"],
  ["usa", <strong key="usa">USA</strong>],
  ["uk", <strong key="uk">UK</strong>],
  ["uae", <strong key="uae">UAE</strong>],
  ["ksa", <strong key="ksa">KSA</strong>],
  ["ger", <strong key="ger">GER</strong>],
];

/** Country selector + monthly fee cards (home page #MonthlyFee). Canada is the initial country. */
export default function PricingTable() {
  const router = useRouter();
  const [country, setCountry] = useState<Country>("canada");
  const data = pricingData[country];
  return (
    <>
      <div className="row mb-5" data-aos="fade-left">
        <div className="col-12 text-center" role="group" aria-label="Select country for pricing">
          {buttons.map(([code, label], i) => (
            <Fragment key={code}>
              {i > 0 && " "}
              <button
                className={`country-button${code === country ? " active" : ""}`}
                id={`${code}-btn`}
                onClick={() => setCountry(code)}
                aria-pressed={code === country ? "true" : "false"}
              >
                {label}
              </button>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="row gy-4" data-aos="fade-left" id="pricing-cards" role="list">
        {data.plans.map((plan) => (
          // Keyed by country so switching re-creates the cards (and replays their AOS zoom-in), as the
          // legacy innerHTML rebuild did.
          <div key={`${country}-${plan.plan}`} className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="100">
            <div className="box plan-card" style={{ padding: "0px 0px 40px 0px" }}>
              <div style={{ padding: "15px" }}>
                <h3 className="plan-title plan-package"><strong>{plan.course}</strong></h3>
              </div>
              <div style={{ backgroundColor: "#f39c12", padding: "15px", marginBottom: "15px" }}>
                <h4 className="plan-title"><strong>{plan.name}</strong></h4>
              </div>
              <div style={{ padding: "0px 40px 0px 40px" }}>
                <div style={{ flexDirection: "row", display: "flex", justifyContent: "center", fontSize: "20px" }}>
                  <p style={{ paddingRight: "8px", fontSize: "18px", fontWeight: "bold" }}><strong>{data.symbol}</strong></p>
                  <p className="plan-price"><strong>{plan.price}</strong></p>
                </div>
                {plan.description.map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && <hr style={{ margin: "5%" }} />}
                    <p>{item}</p>
                  </Fragment>
                ))}
              </div>
              <button
                className="btn btn-register"
                type="button"
                onClick={() => {
                  router.push(`/registration?plan=${plan.plan}`);
                }}
              >
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
