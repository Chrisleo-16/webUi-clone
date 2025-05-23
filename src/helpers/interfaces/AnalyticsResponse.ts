export default interface AnalyticsResponse {
  totalRevenue: number;
  revenueChange: number;
  totalFees: number;
  monthlyFees: number;
  feesChange: number;
  activeUsers: number;
  totalUsers: number;
  newUsers: number;
  totalVolume: number;
  volumeChange: number;
  monthlyGrowth: {
    userGrowth: number;
    volumeGrowth: number;
    revenueGrowth: number;
    monthlyComparison: {
      users: number[];
      volume: number[];
      revenue: number[];
    };
  };
  tradingPairs: Array<{
    currency_type: string;
    count: number;
    volume: number;
  }>;
  geographicData: Array<{
    country: string;
    user_count: number;
  }>;
}
