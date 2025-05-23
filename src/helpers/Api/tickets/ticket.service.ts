import { baseUrl } from "@/helpers/constants/baseUrls";
import { TicketModel } from "@/helpers/interfaces/TicketModel";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";

class TicketService {
    async getTickets(): Promise<TicketModel[]> {
        const token = await TokenService.getToken();
        try {
          const response = await AxiosInstance.get(
            `${baseUrl}/tickets/all/tickets`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data.data;
        } catch (error) {
          console.error("Error fetching tickets:", error);
          throw error;
        }
      }

      async getTicketById(ticketId: string): Promise<TicketModel> {
        const token = await TokenService.getToken();
        try {
          const response = await AxiosInstance.get(
            `${baseUrl}/tickets/ticket/${ticketId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data.data;
        } catch (error) {
          console.error(`Error fetching ticket with ID ${ticketId}:`, error);
          throw error;
        }
      }

      async updateTicket(
        ticketId: string,
        updatedData: Partial<TicketModel>
      ): Promise<TicketModel> {
        const token = await TokenService.getToken();
        try {
          const response = await AxiosInstance.put(
            `${baseUrl}/tickets/update/ticket/${ticketId}`,
            updatedData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data.data;
        } catch (error) {
          console.error(`Error updating ticket with ID ${ticketId}:`, error);
          throw error;
        }
      }
      

}

export default TicketService;