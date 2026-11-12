"use client";

import { useEffect, useState } from "react";

/** True once the page is scrolled more than `offset` pixels (used for the sticky header and back-to-top). */
export function useScrolledPast(offset = 100) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const update = () => setPast(window.scrollY > offset);
    update();
    document.addEventListener("scroll", update, { passive: true });
    return () => document.removeEventListener("scroll", update);
  }, [offset]);
  return past;
}
