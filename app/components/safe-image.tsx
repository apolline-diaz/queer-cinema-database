"use client";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/utils";

interface SafeImageProps {
  image_url?: string | null;
  title: string;
  className?: string;
  [key: string]: any;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  image_url,
  title,
  className,
  ...props
}) => {
  const [src, setSrc] = useState(getImageUrl(image_url));

  // In your component
  console.log("Original image URL:", image_url);
  console.log("Processed image URL:", getImageUrl(image_url));

  const handleError = () => {
    console.warn(`Image failed to load: ${src}`);
    setSrc("/missing_image.png");
  };

  return (
    <Image
      src={src}
      alt={`Poster for ${title}`}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
