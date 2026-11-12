// Minimal typings for the template's vendor libraries (pinned to the versions the site shipped).
declare module "aos" {
  const AOS: { init(options?: Record<string, unknown>): void; refresh(): void; refreshHard(): void };
  export default AOS;
}
declare module "swiper/bundle" {
  export default class Swiper {
    constructor(container: string | Element, options?: Record<string, unknown>);
    destroy(deleteInstance?: boolean, cleanStyles?: boolean): void;
  }
}
declare module "bootstrap";
