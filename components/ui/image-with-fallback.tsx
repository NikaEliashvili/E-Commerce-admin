import Image from "next/image";
import React, { useState } from "react";

const ImageWithFallback = ({ src, ...rest }: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={(e) => {
        setImgSrc("/no-image-placeholder.svg");
      }}
    />
  );
};

export default ImageWithFallback;
