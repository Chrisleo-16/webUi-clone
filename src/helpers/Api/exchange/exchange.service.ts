import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "../../security/interceptors/http.interceptor";

export default class ExchangeService {
  static async exchangeBTCtoXMR(amount: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/exchange/btc-xmr`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // SimpleSwap response structure handling
      if (!response.data || response.data.error) {
        return {
          error: true,
          message: response.data?.message || "Exchange initialization failed",
        };
      }

      return {
        success: response.data.success,
        exchangeId: response.data.exchangeId,
        estimatedAmount: response.data.estimatedAmount,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Error creating an exchange transaction:", error);
      return {
        error: true,
        message: error.message || "Error initializing an exchange transaction",
      };
    }
  }

  static async exchangeXMRtoBTC(amount: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/exchange/xmr-btc`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // SimpleSwap response structure handling
      if (!response.data || response.data.error) {
        return {
          error: true,
          message: response.data?.message || "Exchange initialization failed",
        };
      }

      return {
        success: response.data.success,
        exchangeId: response.data.exchangeId,
        estimatedAmount: response.data.estimatedAmount,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Error creating an exchange transaction:", error);
      return {
        error: true,
        message: error.message || "Error initializing an exchange transaction",
      };
    }
  }

  static async getXMRexchangeEstimate(amount: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/exchange/get-estimate-amount/xmr-btc`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // SimpleSwap returns the estimate directly as a number value
      if (response.data && response.data.estimatedAmount) {
        return {
          estimatedAmount: response.data.estimatedAmount,
        };
      }

      return {
        error: true,
        message: "Exchange service unavailable. Please try again later.",
      };
    } catch (error: any) {
      console.error("Error fetching the transaction estimate:", error);
      return {
        error: true,
        message:
          error.response?.data?.message ||
          "Exchange service unavailable. Please try again later.",
      };
    }
  }

  static async getBTCexchangeEstimate(amount: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/exchange/get-estimate-amount/btc-xmr`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // SimpleSwap returns the estimate directly as a number value
      if (response.data && response.data.estimatedAmount) {
        return {
          estimatedAmount: response.data.estimatedAmount,
        };
      }

      return {
        error: true,
        message: "Exchange service unavailable. Please try again later.",
      };
    } catch (error: any) {
      console.error("Error fetching the transaction estimate:", error);
      return {
        error: true,
        message:
          error.response?.data?.message ||
          "Exchange service unavailable. Please try again later.",
      };
    }
  }

  static async getMyExchanges() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(`${baseUrl}/exchange/history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Error fetching exchange history:", error);
      return {
        error: true,
        message: error.message || "Error fetching exchange history",
      };
    }
  }
  static async getAllMyExchanges() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(`${baseUrl}/exchange/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Error fetching exchange history:", error);
      return {
        error: true,
        message: error.message || "Error fetching exchange history",
      };
    }
  }

  static async getExchangeStatus(exchangeId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/exchange/status/${exchangeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching exchange status:", error);
      throw error;
    }
  }
  static async xmrInternalTransfer(amount: string, exchangetype: string) {
    try {
      const data = {
        transferType: exchangetype,
        amount: amount,
      };
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/exchange/xmr-internal-transfer`,
        data,
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
}
