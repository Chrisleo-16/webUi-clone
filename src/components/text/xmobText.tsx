"use client";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

interface XmobTextProps {
  variant?: 
    | "body1" 
    | "body2" 
    | "h1" 
    | "h2" 
    | "h3" 
    | "h4" 
    | "h5" 
    | "h6" 
    | "subtitle1" 
    | "subtitle2" 
    | "overline";
  fontStyle?: "italic" | "normal";
  fontWeight?: "bold" | "normal";
  textAlign?: "left" | "center" | "right"; 
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  removeOnMobile?: boolean;
}

const XmobText: React.FC<XmobTextProps> = ({
  variant = "body1",
  fontStyle = "normal",
  fontWeight = "normal",
  textAlign = "left", 
  color = "inherit",
  className = "",
  style = {},
  children,
  removeOnMobile = false
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Typography
      variant={variant}
      component={"span"}
      className={`${className} ${isClient && removeOnMobile ? "hidden sm:block" : ""}`}
      style={{ fontStyle, fontWeight, textAlign, color, ...style}} 
    >
      {children}
    </Typography>
  );
};

export default XmobText;
