import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductImageWithSkeleton = ({ src, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-gray-200">
      {!imageLoaded && <Skeleton className="w-full h-full rounded-md" />}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${
          imageLoaded ? "block" : "hidden"
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default ProductImageWithSkeleton;
