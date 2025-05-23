import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ApexOptions } from "apexcharts";
import CoinGeckoAPI from "@/helpers/Api/gCrypto/marketData.service";
import ChartComponent from "@/components/graphs/xmobCandlestickChart";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import MobitCard from "@/components/cards/xmobcard";

export default function XmrGraph() {
  const [xmrChart, setXmrChart] = useState<any>(null);

  useEffect(() => {
    async function getXmrMarketChart() {
      try {
        const xmrChartData = await CoinGeckoAPI.getMarketChart("monero", 7);
        setXmrChart(xmrChartData);
      } catch (error) {
        console.error("Failed to fetch XMR market chart:", error);
      }
    }
    getXmrMarketChart();
  }, []);

  const chartData = xmrChart?.prices?.map(([time, price]: number[]) => ({
    x: new Date(time).getTime(),
    y: price,
  })) || [];

  const options: ApexOptions = {
    chart: { id: "xmr-price-chart" },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: (value: string) => format(new Date(parseInt(value)), "MMM dd"),
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
      },
    },
    tooltip: {
      x: {
        formatter: (value: number) => format(new Date(value), "PPp"),
      },
    },
  };

  return (
    <MobitCard bordered={true} isShadow={true}>
      <CardHeader>
        <CardTitle>XMR/USD Price</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartComponent options={options} series={[{ name: "Price", data: chartData }]} type="line" />
      </CardContent>
    </MobitCard>
  );
}
