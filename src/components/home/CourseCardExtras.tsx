"use client";

import Link from "next/link";
import { useState } from "react";

type Props = { n: number; benefits: string[]; exploreHref: string };

/** Free-course list of a home-page course card, revealed by its "Benefits" button. */
export default function CourseCardExtras({ n, benefits, exploreHref }: Props) {
  // null = never toggled: the legacy markup carried no inline display (style.css hides the list).
  const [open, setOpen] = useState<boolean | null>(null);
  const id = `extraBenefit${n}`;
  return (
    <>
      <div id={id} className="course-card-benefits" style={open === null ? undefined : { display: open ? "block" : "none" }}>
        <p>You can choose one free course:</p>
        <ul>
          {benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
      <div className="course-card-actions">
        <div>
          <a
            // The legacy href was "javascript:void(0);", which React blocks; "#" + preventDefault behaves the same.
            href="#"
            className="btn-extra-benefit btn-benefits"
            aria-controls={id}
            aria-expanded={open ? "true" : "false"}
            onClick={(e) => {
              e.preventDefault();
              setOpen(!open);
            }}
          >
            <i className="bi bi-stars"></i>
            <span>Benefits</span>
          </a>
        </div>
        <div>
          <Link href={exploreHref} className="btn-extra-benefit btn-explore">
            <i className="bi bi-arrow-right-circle"></i>
            <span>Explore</span>
          </Link>
        </div>
      </div>
    </>
  );
}
