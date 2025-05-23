import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "../../security/interceptors/http.interceptor";

export interface OrderDto {
  buy_order_id?: string;
  order_type: string;
  currency_symbol: string;
  paymentmethod: string;
  amount: string;
  coin_sold_rate_to_usd: number;
  usd_rate_to_kes: number;
  min_limit: number;
  max_limit: number;
  terms?: string;
  marketAdjustment: string;
  tradeSizeCurrency: string;
}

export interface newOrderDto {
  buy_order_id?: string;
  order_type: string;
  currency_symbol: string;
  paymentmethod: string;
  amount: string;
  coin_sold_rate_to_usd: number;
  usd_rate_to_kes: number;
}

export interface buyOrderDto {
  amount: string;
  marketPriceAdjustment: string;
  paymentMethod: string;
  currency: string;
  terms: string;
  minLimit: string;
  maxLimit: string;
  cryptoType: string;
  minLimitType: string;
  maxLimitType: string;
}

export default class OrderService {
  static async createSellOrder(data: OrderDto) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/order/sell-coin`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error creating sell order:", error);
      return {
        error: true,
        message: error.response.data.message || "Failed to create sell order",
      };
    }
  }

  static async getAllMyOrderTrades() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/order/get-my-orders`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch orders",
      };
    }
  }

  static async getOrderDetails(orderId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(`${baseUrl}/order/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch order details",
      };
    }
  }

  static async createTrade(orderId: string, sellerId: string, amount: number) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/order/trade/${orderId}`,
        {
          sellerId,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error creating trade:", error);
      return {
        error: true,
        message: error.response.data.message || "Failed to create trade",
      };
    }
  }

  static async getAllPublicOrderTrades() {
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/order/orders/public`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching public order trades:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch public order trades",
      };
    }
  }
  static async getAllSellOrders(page = 1, limit = 10) {
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/order/orders/sell?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching public order trades:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch public order trades",
      };
    }
  }
  static async getAllBuyOrders(page = 1, limit = 10) {
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/order/orders/buy?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching public order trades:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch public order trades",
      };
    }
  }

  static async getOrderTradeDetails(orderId: string, tradeId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/order/get/order-details-partial-trades/${orderId}/${tradeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching order trade details:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch order trade details",
      };
    }
  }

  static async getMyPaymentDetails() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/order/get/payment/details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching payment details:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch payment details",
      };
    }
  }

  static async iHaveReceivedTheFunds(tradeId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/order/i-received-the-funds/${tradeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error marking funds received:", error);
      return {
        error: true,
        message: error.message || "Failed to mark funds received",
      };
    }
  }
  static async iHaveTransfered(tradeId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/order/trades/transferred/${tradeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error marking funds received:", error);
      return {
        error: true,
        message: error.message || "Failed to mark funds received",
      };
    }
  }

  static async getTradeDetailsbyId(trade_id: string) {
    try {
      const token = await TokenService.getToken();
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.get(
        `${baseUrl}/order/trades/${trade_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error(error);
      return (
        error.message || error.error || error || "Error fetching trade details"
      );
    }
  }

  static async transferredToSeller(trade_id: string) {
    try {
      const token = await TokenService.getToken();
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.post(
        `${baseUrl}/order/transfer-to-seller/${trade_id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error transferring to seller:", error);
      return {
        error: true,
        message: error.message || "Failed to transfer to seller",
      };
    }
  }

  static async cancelTrade(trade_id: string, reason: string) {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.post(
        `${baseUrl}/order/trades/cancel/${trade_id}`,
        { reason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error cancelling trade:", error);
      return error.message || "Error cancelling trade";
    }
  }

  static async cancelAppeal(trade_id: string) {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.get(
        `${baseUrl}/order/appeal/withdraw/${trade_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error appealing trade:", error);
      return error.message || "Error appealing trade";
    }
  }

  static async appealTrade(trade_id: string, reason: string) {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.post(
        `${baseUrl}/order/trades/appeal/${trade_id}`,
        { reason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error appealing trade:", error);
      return error.message || "Error appealing trade";
    }
  }

  static async cancelOrder(orderId: string) {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.get(
        `${baseUrl}/order/cancel/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error || "Error cancelling order";
    }
  }
  static async getMyTrades() {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.get(
        `${baseUrl}/order/mytrades/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return error.message || "Error fetching trades";
    }
  }

  static async getMyTXs() {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.get(
        `${baseUrl}/order/completed/tx`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      return error.message || "Error fetching transactions";
    }
  }

  static async createBuyOrder(orderData: any): Promise<any> {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/order/buy-orders/create`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error creating buy order:", error);
      return {
        error: true,
        message: error.message || "Failed to create buy order",
      };
    }
  }

  static async getActiveBuyOrders() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/order/buy-orders/active`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching active buy orders:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch active buy orders",
      };
    }
  }

  static async getMyBuyOrders() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/order/buy-orders/my-orders`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching my buy orders:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch my buy orders",
      };
    }
  }

  static async getBuyOrderById(orderId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/order/buy-orders/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error fetching buy order:", error);
      return {
        error: true,
        message: error.message || "Failed to fetch buy order details",
      };
    }
  }

  static async cancelBuyOrder(orderId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/order/buy-orders/${orderId}/cancel`, // Updated route
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error cancelling buy order:", error);
      return {
        error: true,
        message: error.message || "Failed to cancel buy order",
      };
    }
  }

  static async reactivateBuyOrder(orderId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/order/buy-orders/${orderId}/reactivate`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error reactivating buy order:", error);
      return {
        error: true,
        message: error.message || "Failed to reactivate buy order",
      };
    }
  }

  static async matchBuyOrder(data: newOrderDto) {
    try {
      const token = await TokenService.getToken();

      const response = await AxiosInstance.post(
        `${baseUrl}/order/match-buy-order`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error("No response received from server");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error matching buy order:", error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        error: true,
        message: error.message || "Failed to match buy order",
      };
    }
  }
}
