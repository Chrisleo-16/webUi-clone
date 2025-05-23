"use client";
import MobitCard from "@/components/cards/xmobcard";
import { useEffect, useState } from "react";
import BackedAdminDashBoard, {
  AnalyticsOverview2,
  CryptoCurrency,
} from "./backed/BackedAdminDashBoard";
import XmobLoadingComponent from "@/components/loading/xmobLoading";
import XmobTabs from "@/components/Tabs/xmobTabs";
import xmobcolors from "@/app/styles/xmobcolors";
import BtcGraph from "@/components/ui/cryptoGraphs/BtcGraph";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmrGraph from "@/components/ui/cryptoGraphs/XmrGraph";
import MarketOverview from "@/components/ui/Analytics/marketOverview/marketOverview";
import XmobText from "@/components/text/xmobText";
import { TicketAnalytics } from "@/helpers/interfaces/TicketAnalytics";
import TicketService from "@/helpers/Api/tickets/ticket.service";
import { TicketModel } from "@/helpers/interfaces/TicketModel";
import TicketAnalysisUI from "@/components/ui/Analytics/TicketAnalysis/TicketAnalysisUI";
import UserAnalytics from "@/components/ui/Analytics/userAnalytics/UserAnalytics";
import AnalyticsResponse from "@/helpers/interfaces/AnalyticsResponse";
import DashboardSkeletonLoader, {
  DashboardTabsSkeletonLoader,
} from "@/components/loading/DashboardSkeletonLoader";

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsOverview2 | null>(null);
  const [topCurrencies, setTopCurrencies] = useState<CryptoCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch analytics and crypto prices in parallel
        const [analyticsResult, btcData, xmrData] = await Promise.all([
          BackedAdminDashBoard.getAnalyticsOverview(),
          BackedAdminDashBoard.fetchPriceData("BTC"),
          BackedAdminDashBoard.fetchPriceData("XMR"),
        ]);

        setData(analyticsResult);
        setTopCurrencies([btcData, xmrData]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatUSD = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(numValue);
  };

  const tabData = [
    {
      title: "Overview",
      component: (
        <Xmoblayout layoutType="flex-col">
          <Xmoblayout className="grid-2">
            <BtcGraph /> <XmrGraph />
          </Xmoblayout>
          <MarketOverview topCurrencies={topCurrencies} />{" "}
        </Xmoblayout>
      ),
    },
    { title: "Ticket Analysis", component: <TicketAnalysisUI /> },
    {
      title: "users",
      component: (
        <UserAnalytics
          dashboardData={data ? data.dashboardData : ({} as AnalyticsResponse)}
        />
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <>
          <DashboardSkeletonLoader />
          <DashboardTabsSkeletonLoader />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data ? (
              <>
                <MobitCard bordered={true} isShadow={true}>
                  <Xmoblayout
                    layoutType="flex-col"
                    className="justify-center items-center"
                  >
                    <h3 className="text-lg font-semibold">
                      {"Total Revenue".replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <XmobText className="text-xl font-bold">
                      {formatUSD(data.Revenue.totalRevenue)}
                    </XmobText>
                    <XmobText
                      variant="body2"
                      fontStyle="italic"
                      className="text-sm"
                    >{`${data.Revenue.revenueChange} from last month`}</XmobText>
                  </Xmoblayout>
                </MobitCard>

                <MobitCard bordered={true} isShadow={true}>
                  <Xmoblayout
                    layoutType="flex-col"
                    className="justify-center items-center"
                  >
                    <h3 className="text-lg font-semibold">
                      {"Total Fees".replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <XmobText className="text-xl font-bold">
                      {formatUSD(data.Trades.totalFees)}
                    </XmobText>
                    <XmobText
                      variant="body2"
                      fontStyle="italic"
                      className="text-sm"
                    >{`${data.dashboardData.feesChange?.toFixed(
                      2
                    )}% from last month`}</XmobText>
                  </Xmoblayout>
                </MobitCard>

                <MobitCard bordered={true} isShadow={true}>
                  <Xmoblayout
                    layoutType="flex-col"
                    className="justify-center items-center"
                  >
                    <h3 className="text-lg font-semibold">
                      {"New Users".replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <XmobText className="text-xl font-bold">
                      {data.Users.newUsers}
                    </XmobText>
                    <XmobText
                      variant="body2"
                      fontStyle="italic"
                      className="text-sm"
                    >{`New this month`}</XmobText>
                  </Xmoblayout>
                </MobitCard>

                <MobitCard bordered={true} isShadow={true}>
                  <Xmoblayout
                    layoutType="flex-col"
                    className="justify-center items-center"
                  >
                    <h3 className="text-lg font-semibold">
                      {"Trading Volume".replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <XmobText className="text-xl font-bold">
                      {formatUSD(data.Trades.TradeVolume)}
                    </XmobText>
                    <XmobText
                      variant="body2"
                      fontStyle="italic"
                      className="text-sm"
                    >{`${data.Trades.volumeChange} from last month`}</XmobText>
                  </Xmoblayout>
                </MobitCard>

                <MobitCard bordered={true} isShadow={true}>
                  <Xmoblayout
                    layoutType="flex-col"
                    className="justify-center items-center"
                  >
                    <h3 className="text-lg font-semibold">
                      {"Total Users".replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <XmobText className="text-xl font-bold">
                      {data.Users.totalUsers}
                    </XmobText>
                    <XmobText
                      variant="body2"
                      fontStyle="italic"
                      className="text-sm"
                    >{`Lifetime registered users`}</XmobText>
                  </Xmoblayout>
                </MobitCard>

                <MobitCard bordered={true} isShadow={true}>
                  <Xmoblayout
                    layoutType="flex-col"
                    className="justify-center items-center"
                  >
                    <h3 className="text-lg font-semibold">
                      {"Active Users".replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <XmobText className="text-xl font-bold">
                      {data.Users.activeUsers}
                    </XmobText>
                    <XmobText
                      variant="body2"
                      fontStyle="italic"
                      className="text-sm"
                    >{`Active in the last 7 days`}</XmobText>
                  </Xmoblayout>
                </MobitCard>

                <MobitCard bordered={true} isShadow={true}>
                  <Xmoblayout
                    layoutType="flex-col"
                    className="justify-center items-center"
                  >
                    <h3 className="text-lg font-semibold">
                      {"Monthly Fees".replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <XmobText className="text-xl font-bold">
                      {formatUSD(data.dashboardData.monthlyFees)}
                    </XmobText>
                    <XmobText
                      variant="body2"
                      fontStyle="italic"
                      className="text-sm"
                    >{`Current month earnings`}</XmobText>
                  </Xmoblayout>
                </MobitCard>
              </>
            ) : (
              <div className="col-span-4">
                <XmobLoadingComponent message=" Loading analytics data. Please wait." />
              </div>
            )}
          </div>

          <XmobTabs tabs={tabData} />
        </>
      )}
    </>
  );
}
