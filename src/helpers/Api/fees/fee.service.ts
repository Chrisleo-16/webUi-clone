import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";
import { baseUrl } from "@/helpers/constants/baseUrls";
import { FeeModel } from "@/helpers/interfaces/FeeModel";


export enum FeeType {
  // Spot <> Funding
  SPOT_TO_FUNDING = 'spot_to_funding',
  FUNDING_TO_SPOT = 'funding_to_spot',

  // Sending Fees
  SENDING_EXTERNAL = 'sending_external', // Non-Xmobit users
  SENDING_INTERNAL = 'sending_internal', // Xmobit users

  // Trade Fees
  TRADE_BUY = 'trade_buy',
  TRADE_SELL = 'trade_sell',

  // Swap Exchange Fees
  SWAP_XMR_TO_BTC = 'swap_xmr_to_btc',
  SWAP_BTC_TO_XMR = 'swap_btc_to_xmr',
}


export default class FeeManagementService {
  private async makeAuthenticatedRequest(endpoint: string, options = {}) {
    const token = await TokenService.getToken();
    if (!token) throw new Error("Token is required");

    return AxiosInstance({
      url: `${baseUrl}/fee${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...options,
    });
  }

  async getAllFees() {
    try {
      const response = await this.makeAuthenticatedRequest("/all");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch fees");
    }
  }

  async getFee(feeType: string, currency: string) {
    try {
      const response = await this.makeAuthenticatedRequest(
        `/get/${feeType}/${currency}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch fee");
    }
  }

  async updateFee(feeData: Partial<FeeModel>) {
    try {
      const response = await this.makeAuthenticatedRequest("/update", {
        method: "POST",
        data: feeData,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update fee");
    }
  }

  async disableFee(feeType: string, currency: string) {
    try {
      const response = await this.makeAuthenticatedRequest(
        `/disable/${feeType}/${currency}`,
        {
          method: "DELETE",
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to disable fee");
    }
  }

  async getMoneroFees() {
    try {
      const response = await this.makeAuthenticatedRequest(
        "/x_monero_get_fees",
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch Monero fees"
      );
    }
  }

  async getSimpleSwapFees() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(`${baseUrl}/exchange/fees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch SimpleSwap fees"
      );
    }
  }


}
