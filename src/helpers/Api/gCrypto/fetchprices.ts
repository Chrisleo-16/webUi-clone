import { baseUrl } from "@/helpers/constants/baseUrls";
import AnalyticsResponse from "@/helpers/interfaces/AnalyticsResponse";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";

class FetchPriceDataApi {
   fetchPriceData = async (currency: string) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${
          currency === "BTC" ? "bitcoin" : "monero"
        }&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
      );
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${currency} price:`, error);
      return null;
    }
  };

  private async makeAuthenticatedRequest(endpoint: string) {
    const token = await TokenService.getToken();
    if (!token) throw new Error("Token is required");

    return AxiosInstance.get(`${baseUrl}/admin/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async getAnalytics(): Promise<AnalyticsResponse> {
    try {
      const response = await this.makeAuthenticatedRequest("analytics");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  }


}





export default  FetchPriceDataApi;
