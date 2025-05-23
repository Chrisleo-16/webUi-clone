import React from "react";

interface LayoutProps {
  width?: number;
  height?: number;
  widthOnMobile?: number;
}

const XmobitSpacer: React.FC<LayoutProps> = ({
  width = 0,
  height = 0,
  widthOnMobile,
}) => {
  const spacerStyle: React.CSSProperties = {
    height: `${height}rem`,
    width: `${width}rem`, 
  };

  if (widthOnMobile !== undefined) {
    spacerStyle.width = `100%`;
    spacerStyle.maxWidth = `${widthOnMobile}rem`; 
  }

  return <div style={spacerStyle} />;
};

export default XmobitSpacer;