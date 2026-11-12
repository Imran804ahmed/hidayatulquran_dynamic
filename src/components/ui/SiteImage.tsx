import Image, { type ImageProps } from "next/image";
import { IMAGE_SIZES } from "@/generated/image-sizes";

type Props = Omit<ImageProps, "src" | "width" | "height"> & {
  /** Path under /public, e.g. "/assets/img/logo.png". */
  src: string;
};

/**
 * next/image for the site's own files in /public/assets/img. Width and height come from the
 * generated size map (npm run images:sizes), so the browser reserves the right space and Next
 * serves resized WebP versions. Pass `sizes` when the CSS width is known, for smaller downloads.
 */
export default function SiteImage({ src, alt, ...props }: Props) {
  const size = IMAGE_SIZES[src];
  if (!size) throw new Error(`Unknown image ${src}: add it to public/assets/img and run "npm run images:sizes".`);
  return <Image src={src} alt={alt} width={size[0]} height={size[1]} {...props} />;
}
