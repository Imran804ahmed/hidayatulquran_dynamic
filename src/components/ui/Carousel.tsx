"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Slider settings carried over from the FlexStart template (Swiper 6). */
const PRESETS = {
  testimonials: {
    speed: 600,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    slidesPerView: "auto",
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 40 },
      1200: { slidesPerView: 3 },
    },
  },
  clients: {
    speed: 400,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    slidesPerView: "auto",
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 40 },
      480: { slidesPerView: 3, spaceBetween: 60 },
      640: { slidesPerView: 4, spaceBetween: 80 },
      992: { slidesPerView: 6, spaceBetween: 120 },
    },
  },
} as const;

type Props = {
  preset: keyof typeof PRESETS;
  /** Extra classes for the container (e.g. "testimonials-slider"); "swiper-container" is added. */
  className: string;
  style?: CSSProperties;
  /** The `.swiper-wrapper` element with its `.swiper-slide` children, plus optional `.swiper-pagination`. */
  children: ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "style" | "children">;

/**
 * Swiper slider. The slides are rendered by React (server-rendered HTML, good for SEO);
 * Swiper is attached in the browser and destroyed when the component unmounts.
 */
export default function Carousel({ preset, className, style, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let swiper: { destroy(deleteInstance?: boolean, cleanStyles?: boolean): void } | undefined;
    let cancelled = false;
    import("swiper/bundle").then(({ default: Swiper }) => {
      if (cancelled || !ref.current) return;
      const options = structuredClone(PRESETS[preset]) as unknown as Record<string, unknown>;
      // Scope the pagination element to this slider (the template used a page-wide selector).
      const pagination = ref.current.querySelector(".swiper-pagination");
      options.pagination = pagination ? { ...(options.pagination as object), el: pagination } : false;
      swiper = new Swiper(ref.current, options);
    });
    return () => {
      cancelled = true;
      swiper?.destroy(true, true);
    };
  }, [preset]);

  return (
    <div ref={ref} className={`${className} swiper-container`} style={style} {...rest}>
      {children}
    </div>
  );
}
