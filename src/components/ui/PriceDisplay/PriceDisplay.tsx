import React from "react";
import xmobColors from "@/app/styles/xmobcolors";

interface PriceDisplayProps {
  price: number | null;
  loading: boolean;
  currency: string;
}

export const PriceDisplay = ({
  price,
  loading,
  currency,
}: PriceDisplayProps) => {
  return (
    <div
      className="mb-6 p-4 rounded-lg"
      style={{
        backgroundColor: xmobColors.primaryFaded,
        border: `1px solid ${xmobColors.primary}`,
      }}
    >
      <div className="flex justify-between items-center">
        <span
          className="text-sm font-medium"
          style={{ color: xmobColors.dark }}
        >
          Current Market Price
        </span>
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-lg font-bold animate-pulse">Loading...</span>
          ) : (
            <>
              <span
                className="text-lg font-bold"
                style={{ color: xmobColors.primary }}
              >
                ${price?.toLocaleString()}
              </span>
              <span className="text-sm" style={{ color: xmobColors.grayDark }}>
                USD/{currency}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
