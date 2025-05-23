"use client";
import React, { ReactNode } from "react";

interface LayoutProps {
  layoutType?:
    | "grid-2"
    | "grid-3"
    | "grid-4"
    | "grid-5"
    | "grid-6"
    | "flex-row"
    | "flex-col";
  gap?: string;
  isFlexEndToEnd?: boolean;
  isFlexEndToEndMobile?: boolean;
  className?: string;
  children: ReactNode;
  isResponsive?: boolean;
  isWidth?: boolean;
  width?: number; 
}

const Xmoblayout: React.FC<LayoutProps> = ({
  layoutType = "grid-2",
  gap = "gap-4",
  className = "",
  isFlexEndToEnd = false,
  isFlexEndToEndMobile = false,
  children,
  isResponsive = false,
  isWidth = false,
  width = 0,
  
}) => {
  const gridClasses: Record<string, string> = {
    "grid-2": "grid sm:grid-cols-2 grid-cols-1",
    "grid-3": "grid sm:grid-cols-3 grid-cols-1",
    "grid-4": "grid sm:grid-cols-4 grid-cols-1",
    "grid-5": "grid sm:grid-cols-5 grid-cols-1",
    "grid-6": "grid sm:grid-cols-6 grid-cols-1",
    "flex-row": isResponsive ? "flex sm:flex-row flex-col" : "flex flex-row",
    "flex-col": "flex flex-col",
  };

  const widthClasses: Record<number, string> = {
    10: "sm:w-[10rem]", 
    20: "sm:w-[20rem]", 
    30: "sm:w-[30rem]", 
    40: "sm:w-[40rem]", 
    50: "sm:w-[50rem]", 
    60: "sm:w-[60rem]",
    70: "sm:w-[70rem]", 
    80: "sm:w-[80rem]", 
    90: "sm:w-[90rem]",
    100: "sm:w-[100rem]", 
  };

  const layoutClass = gridClasses[layoutType] || "";

  const widthClass = isWidth ? `w-full ${widthClasses[width]} m-auto` : "";

  const justifyClass = isFlexEndToEnd
    ? "justify-between items-center"
    : isFlexEndToEndMobile
    ? "justify-between sm:justify-start items-center"
    : "";

  const combinedClasses = `
  
    
    h-full
    ${layoutClass}
    ${gap}
    ${justifyClass}
    ${widthClass}
    ${className}
    pt-2
  `;

  return <div className={`${combinedClasses} `}>{children}</div>;
};

export default Xmoblayout;