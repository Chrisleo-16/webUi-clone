"use client";

import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

interface BarGraphProps {
  data: number[][];
  labels: string[];
  height?: number;
}

const XmobBarGraph: React.FC<BarGraphProps> = ({
  data,
  labels,
  height = 300, 
}) => {
  return (
    <BarChart
      series={data.map((dataset, index) => ({
        data: dataset,
        id: `series-${index}`,
      }))}
      height={height}
      xAxis={[{ data: labels, scaleType: "band" }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
};

export default XmobBarGraph;
