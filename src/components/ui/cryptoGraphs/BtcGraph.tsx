import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ApexOptions } from "apexcharts";
import CoinGeckoAPI from "@/helpers/Api/gCrypto/marketData.service";
import ChartComponent from "@/components/graphs/xmobCandlestickChart";
import MobitCard from "@/components/cards/xmobcard";
import { CardHeader, CardTitle } from "../card";

export default function BtcGraph() {
  const [btcChart, setBtcChart] = useState<any>(null);

  useEffect(() => {
    async function getBtcMarketChart() {
      try {
        const btcChartData = await CoinGeckoAPI.getMarketChart("bitcoin", 7);
        setBtcChart(btcChartData);
      } catch (error) {
        console.error("Failed to fetch BTC market chart:", error);
      }
    }
    getBtcMarketChart();
  }, []);

  const chartData = btcChart?.prices?.map(([time, price]: number[]) => ({
    x: new Date(time).getTime(), // Ensure x-axis values are in timestamp format
    y: price,
  })) || [];

  const options: ApexOptions = {
    chart: { id: "btc-price-chart" },
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
        <CardTitle>BTC/USD Price</CardTitle>
      </CardHeader>
    <ChartComponent
      options={options}
      series={[{ name: "Price", data: chartData }]}
      type="line"
    />
    </MobitCard>
  );
}
