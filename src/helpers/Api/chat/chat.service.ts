import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";

export default class ChatService {
  static async getChats(tradeId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/chat/chat-history/${tradeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async getRecipientDetails(tradeId: string) {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/chat/get-receipient-details/${tradeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
