import { baseUrl } from "@/helpers/constants/baseUrls";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";

interface Feedback {
  id: number;
  feedback_from: string;
  feedback_to: string;
  trade_id: string;
  rating: number;
  feedback_msg: string;
  feedback_date?: Date;
  feedback_to_name?: string;
  feedback_from_name?: string;
}

class FeedBackService {
  async getMyFeedBackAnalytics(): Promise<any> {
    try {
      const token = await TokenService.getToken();
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.get(
        `${baseUrl}/rating/my-feedback/analytics`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
    }
  }
  static async GetFeedbackTradeId(trade_id: string) {
    try {
      const token = await TokenService.getToken();
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.post(
        `${baseUrl}/rating/trade-id-feedback`,
        { trade_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error marking as transferred:", error);
      return error.error || "Error marking as transferred";
    }
  }
  static async SendFeedBack(feedback: Feedback) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.post(
        `${baseUrl}/rating/give-feedback`,
        feedback,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { error: false, data: response.data };
    } catch (error: any) {
      console.error("Error giving FeedBack:", error);
      return {
        error: true,
        message: error.message || "Failed to give FeedBack",
      };
    }
  }
}

export default FeedBackService;
