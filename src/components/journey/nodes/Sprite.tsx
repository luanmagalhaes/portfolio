import Image from "next/image";

export function Sprite({ src, width, height, className = "", alt = "" }: { src: string; width: number; height: number; className?: string; alt?: string }) {
  return <Image src={src} width={width} height={height} alt={alt} unoptimized loading="eager" draggable={false} className={`jr-pixel ${className}`} />;
}
