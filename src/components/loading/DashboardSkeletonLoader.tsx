import React from "react";
import MobitCard from "@/components/cards/xmobcard";
import Xmoblayout from "@/components/layouts/xmoblayout";

interface DashboardSkeletonLoaderProps {
  cardCount?: number;
}

const DashboardSkeletonLoader: React.FC<DashboardSkeletonLoaderProps> = ({
  cardCount = 7, // Default to the number of cards in the dashboard
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(cardCount)
        .fill(0)
        .map((_, index) => (
          <MobitCard key={index} bordered={true} isShadow={true}>
            <Xmoblayout
              layoutType="flex-col"
              className="justify-center items-center"
            >
              {/* Title placeholder */}
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-3"></div>

              {/* Value placeholder */}
              <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse mb-2"></div>

              {/* Secondary text placeholder */}
              <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </Xmoblayout>
          </MobitCard>
        ))}
    </div>
  );
};

// Add tabs skeleton loader for complete dashboard simulation
export const DashboardTabsSkeletonLoader = () => {
  return (
    <div className="mt-8">
      {/* Tabs header */}
      <div className="flex border-b mb-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="mr-4 pb-2">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
      <div className="mt-4 h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    </div>
  );
};

export default DashboardSkeletonLoader;
