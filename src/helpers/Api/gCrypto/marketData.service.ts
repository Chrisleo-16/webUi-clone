const COINGECKO_API = "https://api.coingecko.com/api/v3";

interface CoinData {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
}

interface MarketDataResponse {
  bitcoin: CoinData;
  monero: CoinData;
}

interface MarketChartResponse {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

class CoinGeckoAPI {
  // Fetch market data for Bitcoin and Monero
  async getMarketData(): Promise<MarketDataResponse | null> {
    try {
      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=bitcoin,monero&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch market data:", error);
      return null;
    }
  }

  // Fetch market chart data for a specific coin
  async getMarketChart(coinId: string, days: number = 7): Promise<MarketChartResponse | null> {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch market chart for ${coinId}:`, error);
      return null;
    }
  }
}

export default new  CoinGeckoAPI();
