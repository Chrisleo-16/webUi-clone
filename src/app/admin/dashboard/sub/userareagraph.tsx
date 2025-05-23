import MobitCard from "@/components/cards/xmobcard";
import ChartComponent from "@/components/graphs/xmobCandlestickChart";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsResponse from "@/helpers/interfaces/AnalyticsResponse";
import { ApexOptions } from "apexcharts";

interface UserAnalyticsProps {
  dashboardData: AnalyticsResponse;
}

const UserAreaChart: React.FC<UserAnalyticsProps> = ({ dashboardData }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    xaxis: {
      categories: ["Last 7 Days", "Last 30 Days", "Total"],
    },
    colors: ["#4F46E5"], 
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
  };

  const chartSeries = [
    {
      name: "Users",
      data: [
        dashboardData?.activeUsers || 0,
        dashboardData?.newUsers || 0,
        dashboardData?.totalUsers || 0,
      ],
    },
  ];

  return (
    <MobitCard bordered={true} isShadow={true}>
      <CardHeader>
        <CardTitle>User Growth (Area Chart)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartComponent options={chartOptions} series={chartSeries} type="area" height={300} />
      </CardContent>
    </MobitCard>
  );
};

export default UserAreaChart;
