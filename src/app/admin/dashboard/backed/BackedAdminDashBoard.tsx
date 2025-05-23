import FetchPriceDataApi from "@/helpers/Api/gCrypto/fetchprices";

// Updated to match the backend Analytics class data structure
export interface AnalyticsResponse {
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

export interface AnalyticsOverview {
  TotalRevenue: string;
  ActiveUsers: string;
  TradeVolume: string;
  TotalUsers: string;
  volumeChange: string;
  newUser: number;
  revenueChange: string;
}

export interface AnalyticsOverview2 {
  Revenue: { totalRevenue: string; revenueChange: string };
  Users: { totalUsers: string; newUsers: string; activeUsers: string };
  Trades: { TradeVolume: string; volumeChange: string; totalFees: string };
  Growth: { userGrowth: number; volumeGrowth: number; revenueGrowth: number };
  MonthlyData: {
    users: number[];
    volume: number[];
    revenue: number[];
  };
  TradingPairs: Array<{
    currency_type: string;
    count: number;
    volume: number;
  }>;
  dashboardData: AnalyticsResponse;
}

export interface CryptoCurrency {
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
}

class BackedAdminDashBoard {
  constructor(private fetchprices: FetchPriceDataApi) {}

  async getAnalyticsOverview(): Promise<AnalyticsOverview2> {
    const response = await this.fetchprices.getAnalytics();
    const analyticsData = response as AnalyticsResponse;

    const volumeChange = `${analyticsData?.volumeChange?.toFixed(2) ?? 0}%`;
    const newUser = analyticsData?.newUsers ?? 0;
    const revenueChange = `${analyticsData?.revenueChange?.toFixed(2) ?? 0}%`;

    const analytics2: AnalyticsOverview2 = {
      Revenue: {
        totalRevenue: analyticsData.totalRevenue.toString(),
        revenueChange: revenueChange,
      },
      Users: {
        totalUsers: analyticsData.totalUsers.toString(),
        newUsers: `${newUser}`,
        activeUsers: analyticsData.activeUsers.toString(),
      },
      Trades: {
        TradeVolume: analyticsData.totalVolume.toString(),
        volumeChange: volumeChange,
        totalFees: analyticsData.totalFees.toString(),
      },
      Growth: {
        userGrowth: analyticsData.monthlyGrowth?.userGrowth || 0,
        volumeGrowth: analyticsData.monthlyGrowth?.volumeGrowth || 0,
        revenueGrowth: analyticsData.monthlyGrowth?.revenueGrowth || 0,
      },
      MonthlyData: {
        users: analyticsData.monthlyGrowth?.monthlyComparison.users || [],
        volume: analyticsData.monthlyGrowth?.monthlyComparison.volume || [],
        revenue: analyticsData.monthlyGrowth?.monthlyComparison.revenue || [],
      },
      TradingPairs: analyticsData.tradingPairs || [],
      dashboardData: analyticsData,
    };
    return analytics2;
  }

  async fetchPriceData(currencySymbol: "XMR" | "BTC"): Promise<CryptoCurrency> {
    try {
      const priceData = await this.fetchprices.fetchPriceData(currencySymbol);

      if (!priceData) {
        throw new Error("Failed to fetch price data");
      }

      if (currencySymbol === "BTC") {
        return {
          name: "BTC",
          price: priceData.bitcoin.usd,
          change: priceData.bitcoin.usd_24h_change,
          volume: priceData.bitcoin.usd_24h_vol || 0,
          marketCap: priceData.bitcoin.usd_market_cap || 0,
        };
      }

      return {
        name: "XMR",
        price: priceData.monero.usd,
        change: priceData.monero.usd_24h_change,
        volume: priceData.monero.usd_24h_vol || 0,
        marketCap: priceData.monero.usd_market_cap || 0,
      };
    } catch (error) {
      console.error("Error fetching price data:", error);
      throw error;
    }
  }

  // async getRecentTransactions(limit = 10) {
  //   try {
  //     return this.fetchprices.getRecentTransactions(limit);
  //   } catch (error) {
  //     console.error("Error fetching recent transactions:", error);
  //     throw error;
  //   }
  // }

  async getTradingPairDistribution() {
    try {
      const analytics = await this.getAnalyticsOverview();
      return analytics.TradingPairs;
    } catch (error) {
      console.error("Error fetching trading pair distribution:", error);
      return [];
    }
  }

  async getGrowthTrends() {
    try {
      const analytics = await this.getAnalyticsOverview();
      return {
        growth: analytics.Growth,
        monthlyData: analytics.MonthlyData,
      };
    } catch (error) {
      console.error("Error fetching growth trends:", error);
      return {
        growth: { userGrowth: 0, volumeGrowth: 0, revenueGrowth: 0 },
        monthlyData: { users: [], volume: [], revenue: [] },
      };
    }
  }
}

export default new BackedAdminDashBoard(new FetchPriceDataApi());
