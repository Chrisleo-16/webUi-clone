import React from "react";
import styles from "./buttonstyle.module.css";
import xmobcolors from "@/app/styles/xmobcolors";

interface XmobButtonProps {
  onClick?: any;
  children: React.ReactNode;
  isCurrencyButton?: boolean;
  isbtc?: boolean;
  isFullWidth?: boolean;
  isIconButton?: boolean;
  backgroundColor?: string;
  color?: string;
  className?: string;
  disabled?: boolean;
  borderRadius?: number;
  isButtonSmall?: boolean;
}

const XmobButton: React.FC<XmobButtonProps> = ({
  onClick,
  children,
  isCurrencyButton = false,
  isbtc = false,
  isFullWidth = false,
  isIconButton = false,
  backgroundColor,
  color = xmobcolors.light,
  className = "",
  disabled = false,
  borderRadius = 0,
  isButtonSmall = false,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={` ${styles.button} ${className} 
                  ${isCurrencyButton ? (isbtc ? styles.bg_btc : styles.bg_xmr) : ""} 
                  ${isFullWidth ? "w-full" : ""} 
                  ${isIconButton ? styles.iconButton : ""}`}
      style={{
        backgroundColor: !isCurrencyButton && backgroundColor ? backgroundColor : undefined,
        color,
        width: isIconButton ? "32px" : isFullWidth ? "100%" : undefined,
        height: isIconButton ? "32px" : undefined,
        borderRadius: borderRadius ? `${borderRadius}rem` : isIconButton ? "50%" : "10px",
        padding: isIconButton ? "5px" : isButtonSmall ? "8px 20px" : "15px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
};

export default XmobButton;
