import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Skeleton } from "./skeleton";
import { cn } from "@lib";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: "blur" | "skeleton" | "none"; // cách hiển thị placeholder
  lqip?: string; // base64 nhỏ làm placeholder blur (tùy chọn)
  zoomable?: boolean;
}

export const Image = ({
  src,
  alt,
  className,
  placeholder = "skeleton",
  zoomable = false,
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  // Xác định có dùng <picture> cho nhiều định dạng không
  // const hasWebp = src.replace(/\.\w+$/, ".webp");
  // const hasAvif = src.replace(/\.\w+$/, ".avif");

  const imageContent = (
    <div className={cn("relative overflow-hidden", className)}>
      {placeholder === "skeleton" && isLoading && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)} // tránh treo loading nếu lỗi
      />
    </div>
  );

  if (zoomable) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button type="button" className="cursor-zoom-in block w-full">
            {imageContent}
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl border-0 bg-black/90 p-0 shadow-none">
          <div className="relative flex items-center justify-center h-[90vh]">
            <img
              src={src}
              alt={alt}
              className="max-h-full max-w-full object-contain"
              loading="eager"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return imageContent;
};
