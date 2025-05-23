import { baseUrl } from "@/helpers/constants/baseUrls";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";

class ChatMessageService {
  async getChats(tradeId: string) {
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
}

export default ChatMessageService;
