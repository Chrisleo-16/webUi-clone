import { baseUrl } from "@/helpers/constants/baseUrls";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";

class BitCoinService {
  static async getWalletAddress() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(`${baseUrl}/bitcoin/getadress`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getWalletAddress() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(`${baseUrl}/bitcoin/getadress`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async getBTCbalance() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/bitcoin/getbalance`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async sendBitcoin(address: string, amount: number) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/bitcoin/sendcoins`,
        {
          address,
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
      console.log(error);
      throw error;
    }
  }
  static async sendBitcoinToSpotFromSpot(to: string, amount: number) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/btc/spot/create-tx`,
        {
          to,
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
      console.log(error);
      throw error;
    }
  }
  static async sendBitcoinToFunding(
    receiver_wallet_address: string,
    amount: number,
    from_spot: boolean
  ) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/btc/spot/send-to-other-funding`,
        {
          receiver_wallet_address,
          amount,
          from_spot,
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
      console.log(error);
      throw error;
    }
  }

  static async fundMySpotWallet(amount: number) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/btc/spot/send-to-spot-address-from-funding`,
        {
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
      console.log(error);
      throw error;
    }
  }

  static async fundMyFundingWallet(amount: number) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/btc/spot/send-to-my-funding-address`,
        {
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
      console.log(error);
      throw error;
    }
  }

  static async getBTCSpotBalance() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/btc/spot/my-details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  static async getSpotWalletBalance() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/btc/spot-wallet-balance`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
  // CONVERT BTC TO USD
  static async convert2Usd(): Promise<number> {
    try {
      const API_KEY = "e1a252d6-90fb-415f-bc9e-84ab802bb1f3";
      const requestUrl = "https://rest.coinapi.io/v1/exchangerate/BTC/USD";

      const response = await fetch(requestUrl, {
        headers: {
          "X-CoinAPI-Key": API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.rate;
      } else {
        console.error("Failed to fetch BTC to USD rate");
        throw new Error("Failed to fetch BTC to USD rate");
      }
    } catch (error) {
      console.error("An error occurred while fetching BTC to USD rate:", error);
      throw error;
    }
  }
}

export default BitCoinService;
