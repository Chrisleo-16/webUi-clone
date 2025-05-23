import React from "react";

interface XmobImageProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  circular?: boolean;
  className?: string;
}

const XmobImage: React.FC<XmobImageProps> = ({
  src,
  alt = "image",
  width = "100px",
  height = "100px",
  circular = false,
  className = "",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        width,
        height,
        borderRadius: circular ? "100%" : "5px",
        objectFit: "cover",
      }}
    />
  );
};

export default XmobImage;
