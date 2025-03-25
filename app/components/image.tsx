import { useState } from "react";
import { getImageUrl } from "@/utils";

interface SafeImageProps {
  image_url?: string | null;
  title: string;
  className?: string;
  [key: string]: any;
}

export const Image: React.FC<SafeImageProps> = ({
  image_url,
  title,
  className,
  ...props
}) => {
  const [src, setSrc] = useState(getImageUrl(image_url));

  const handleError = () => {
    console.warn(`Image failed to load: ${src}`);
    setSrc("/missing_image.png");
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Poster for ${title}`}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
