import xmobcolors from "@/app/styles/xmobcolors";
import { Card, CardContent, Box } from "@mui/material";
import React, { ReactNode } from "react";

interface CardProps {
  isShadow?: boolean;
  isShadowTop?: boolean;
  isShadowBottom?: boolean;
  isShadowLeft?: boolean;
  isShadowRight?: boolean;
  rounded?: boolean;
  bordered?: boolean;
  background?: string;
  className?: string;
  width?: string;
  children: ReactNode;
  height?: string;
  mobileHeight?: number;
}

const MobitCard: React.FC<CardProps> = ({
  isShadow = false,
  isShadowTop = false,
  isShadowBottom = false,
  isShadowLeft = false,
  isShadowRight = false,
  rounded = false,
  bordered = false,
  background = xmobcolors.light,
  className = "",
  width = "100%",
  children,
  height = "auto",
  mobileHeight = 0, 
}) => {
  const boxShadow = isShadow
    ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
    : `${isShadowLeft ? "-4px 0 10px rgba(0, 0, 0, 0.1)" : "0px"} 
       ${isShadowRight ? "4px 0 10px rgba(0, 0, 0, 0.1)" : "0px"} 
       ${isShadowTop ? "0px -4px 10px rgba(0, 0, 0, 0.1)" : "0px"} 
       ${isShadowBottom ? "0px 4px 10px rgba(0, 0, 0, 0.1)" : "0px"}`.trim();

  return (
    <Card
      sx={{
        backgroundColor: background,
        boxShadow: boxShadow,
        borderRadius: rounded ? 3 : 1,
        border: bordered ? "1px solid #ccc" : "none",
        width: width,
        height: height, 
        "@media (max-width: 768px)": {
          height: mobileHeight > 0 ? `${mobileHeight}px` : height,
          width: "100%", 
        },
      }}
      className={className}
    >
      <CardContent>
        <Box>{children}</Box>
      </CardContent>
    </Card>
  );
};

export default MobitCard;
