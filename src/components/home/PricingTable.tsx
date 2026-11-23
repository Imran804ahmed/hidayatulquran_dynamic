"use client";

import Link from "next/link";
import { useState } from "react";
import { RevealGroup } from "@/components/motion/Reveal";
import styles from "./PricingTable.module.css";

/** Monthly fees by country, as published by the academy. The plans are the same for every course. */
const PRICES = {
  canada: { label: "Canada", currency: "CAD", prices: ["35", "40", "45"] },
  usa: { label: "USA", currency: "USD", prices: ["20", "25", "30"] },
  uk: { label: "UK", currency: "GBP", prices: ["22", "25", "28"] },
  uae: { label: "UAE", currency: "AED", prices: ["110", "140", "160"] },
  ksa: { label: "Saudi Arabia", currency: "SAR", prices: ["110", "140", "160"] },
  ger: { label: "Germany", currency: "EUR", prices: ["22", "25", "28"] },
} as const;
type Country = keyof typeof PRICES;

const PLANS = [
  { days: 3, name: "Bronze" },
  { days: 4, name: "Silver" },
  { days: 5, name: "Gold" },
];

/** Country selector + monthly plan cards (home page #fees). Canada is the initial country. */
export default function PricingTable() {
  const [country, setCountry] = useState<Country>("canada");
  const data = PRICES[country];
  return (
    <>
      <div className={styles.countries} role="group" aria-label="Show fees for">
        {(Object.keys(PRICES) as Country[]).map((code) => (
          <button key={code} type="button" className={styles.country} aria-pressed={code === country} onClick={() => setCountry(code)}>
            {PRICES[code].label}
          </button>
        ))}
      </div>
      <p className="hq-visually-hidden" aria-live="polite">
        Showing fees for {data.label} in {data.currency}.
      </p>
      <RevealGroup className={styles.plans}>
        {PLANS.map((plan, i) => (
          <li key={plan.days} className={`${styles.plan} ${plan.days === 4 ? styles.featured : ""}`}>
            <h3 className={styles.planName}>
              {plan.name} <span>· {plan.days} days a week</span>
            </h3>
            <p className={styles.price}>
              <span className={styles.currency}>{data.currency}</span> <span key={country} className={`hq-appear ${styles.amount}`}>{data.prices[i]}</span>
              <span className={styles.per}> per month</span>
            </p>
            <ul className={`hq-checklist ${styles.features}`}>
              <li>{plan.days} classes per week ({plan.days * 4} per month)</li>
              <li>30-minute one-to-one classes</li>
              <li>Free registration</li>
              <li>Class times available 24/7</li>
            </ul>
            <Link href={`/registration?plan=${plan.days}`} className={`hq-btn ${plan.days === 4 ? "hq-btn--primary" : "hq-btn--secondary"} hq-btn--block`}>
              Choose {plan.name}<span className="hq-visually-hidden"> plan, {plan.days} days a week</span>
            </Link>
          </li>
        ))}
      </RevealGroup>
    </>
  );
}
