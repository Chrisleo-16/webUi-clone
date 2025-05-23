import { baseUrl } from "@/helpers/constants/baseUrls";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";

class MoneroService {
  static async getMymoneroWallet(): Promise<any> {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/monero/get-my-wallet-details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching Monero wallet details:", error);
      throw error;
    }
  }
  async getMymoneroWallet(): Promise<any> {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/monero/get-my-wallet-details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching Monero wallet details:", error);
      throw error;
    }
  }
  static async TransferXmr2Xmr(recipientAddress: string, amount: number) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/monero/transfer-xmr-coins`,
        {
          recipientAddress,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  static async transferFromSpotToLive(
    receiverLiveAddress: string,
    amount: number
  ) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/x_monero_my_spot_to_friend_live_wallet_balance`,
        {
          receiverLiveAddress,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  static async transferFromLiveToSpot(
    receiverSpotAddress: string,
    amount: number
  ) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/x_monero_my_live_to_friend_spot_wallet`,
        {
          receiverSpotAddress,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  static async transfer_funds_spot_address(
    public_address: string,
    amount: number
  ) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/monero/x_send_fund_using_public_address`,
        {
          public_address,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  static async transferFundsUsingEmailOrUsername(
    usernameOrEmail: string,
    amount: number
  ) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/monero/x_send_fund_using_username-or-email`,
        {
          usernameOrEmail,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // FETCH MY LIVE BALANCE
  static get_live_bal = async () => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(
      `${baseUrl}/monero/get-my-wallet-details`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data.data;
  };

  // FETCH MY SPOT BALANCE
  static async get_my_balance() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/monero/x_monero_spot_wallet_balance`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
  async get_my_balance() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/monero/x_monero_spot_wallet_balance`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
  // CONVERT TO USD
  static async getXMRtoUSD(retries = 3, delay = 2000): Promise<number> {
    try {
      const API_KEY = "e1a252d6-90fb-415f-bc9e-84ab802bb1f3";
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 1);

      const start = startDate.toISOString();
      const end = endDate.toISOString();

      const requestUrlFormatted = `https://rest.coinapi.io/v1/exchangerate/XMR/USD/history?period_id=1DAY&time_start=${start}&time_end=${end}`;

      const response = await fetch(requestUrlFormatted, {
        headers: {
          "X-CoinAPI-Key": API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.length === 0)
          throw new Error("No data available for XMR to USD conversion.");
        return data[data.length - 1].rate_close;
      }

      // Handle rate limit (429)
      if (response.status === 429 && retries > 0) {
        console.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.getXMRtoUSD(retries - 1, delay * 2);
      }

      throw new Error(
        `Failed to fetch XMR to USD rate (Status: ${response.status})`
      );
    } catch (error) {
      console.error("An error occurred while fetching XMR to USD rate:", error);
      throw error;
    }
  }
}

export default MoneroService;
