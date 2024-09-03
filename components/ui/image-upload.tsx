"use client";

import { useEffect, useState } from "react";
import { ImagePlusIcon, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { Skeleton } from "./skeleton";
import ImageWithFallback from "./image-with-fallback";
import toast from "react-hot-toast";

interface ImageUploadprops {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadprops> = ({
  onChange,
  onRemove,
  value,
  disabled,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative size-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                size="icon"
                type="button"
                variant="destructive"
                onClick={() => onRemove(url)}
              >
                <Trash className="size-4" />
              </Button>
            </div>
            <ImageWithFallback
              fill
              className="object-cover"
              alt="Image"
              src={url}
              onLoad={() => setIsLoaded(true)}
              priority
            />
            {!isLoaded && (
              <div className="size-[200px] rounded-md overflow-hidden">
                <Skeleton className="size-full " />
              </div>
            )}
          </div>
        ))}
      </div>
      <CldUploadWidget
        options={{ multiple: true }}
        onSuccess={onUpload}
        uploadPreset="f0g1b2qj"
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              onClick={onClick}
              variant="secondary"
            >
              <ImagePlusIcon className="size-4 mr-2" />
              Upload
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
