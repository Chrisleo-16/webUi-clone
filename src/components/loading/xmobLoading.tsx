import React from "react";

interface LoadingProps {
  message?: string;
}

const XmobLoadingComponent: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center h-20">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  );
};

export default XmobLoadingComponent;
