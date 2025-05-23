import React from "react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  color?: string;
};

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "#4338ca",
}) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClass} animate-spin rounded-full border-2 border-solid border-t-transparent`}
        style={{ borderColor: `${color}33`, borderTopColor: color }}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
