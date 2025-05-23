import ChatMessageService from "@/helpers/Api/messages/Chat.service";
import TicketService from "@/helpers/Api/tickets/ticket.service";
import { baseUrl } from "@/helpers/constants/baseUrls";
import { MessageModel } from "@/helpers/interfaces/MessageModel";
import { TicketModel } from "@/helpers/interfaces/TicketModel";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";

export interface TicketDataModel {
  tradeTickets: number;
  totalTicket: number;
  otherTicket: number;
  tickets: TicketModel[];
}

class BackedTicketService {
  private ticketService: TicketService;
  private chatMessageService: ChatMessageService;
  constructor(
    ticketService: TicketService,
    chatMessageService: ChatMessageService
  ) {
    this.ticketService = ticketService;
    this.chatMessageService = chatMessageService;
  }
  getStatusColor = (status: boolean) => {
    switch (status) {
      case true:
        return "success";
      case false:
        return "error";
      default:
        return "default";
    }
  };

  getPriorityColor = (priority: string) => {
    switch (priority.toLocaleLowerCase()) {
      case "low":
        return "success";
      case "high":
        return "error";
      case "medium":
        return "warning";
      default:
        return "default";
    }
  };
  async getticketsAndStatistics(): Promise<TicketDataModel> {
    const tickets: TicketModel[] = await this.ticketService.getTickets();
    const { tradeTickets, totalTicket, otherTicket } =
      this.calculateTotalTickets(tickets);

    return { tradeTickets, totalTicket, otherTicket, tickets: tickets };
  }

  private calculateTotalTickets(tickets: TicketModel[]): {
    tradeTickets: number;
    totalTicket: number;
    otherTicket: number;
  } {
    const tradeTickets = tickets.filter(
      (ticket) => ticket.ticketType === "partial_trade"
    ).length;
    const otherTickets = tickets.length - tradeTickets;

    return {
      tradeTickets,
      totalTicket: tickets.length,
      otherTicket: otherTickets,
    };
  }

  async getTicketById(
    ticketId: string
  ): Promise<{ ticketDetails: TicketModel; messages: MessageModel[] }> {
    const ticket: TicketModel = await this.ticketService.getTicketById(
      ticketId
    );
    const messages: MessageModel[] = await this.getAllChats(ticket);
    return { ticketDetails: ticket, messages: messages };
  }

  async getAllChats(ticket: TicketModel): Promise<MessageModel[]> {
    try {
      let ticketId = ticket.ticketId;

      if (ticket.otherInfo?.includes("TD")) {
        const parts = ticket.otherInfo.split("TD");
        if (parts.length === 2) {
          ticketId = `${parts[0].trim()}`;
        }
      }

      const chatMessageResponse: MessageModel[] =
        await this.chatMessageService.getChats(ticketId);

      return chatMessageResponse.length ? chatMessageResponse.reverse() : [];
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
  }

  async updateTicket(
    updateTicket: TicketModel
  ): Promise<{ sucess: boolean; message: string }> {
    try {
      await this.ticketService.updateTicket(
        updateTicket.ticketId,
        updateTicket
      );
      return { sucess: true, message: "Ticket updated successfully" };
    } catch (error) {
      console.error("Error updating ticket:", error);
      return { sucess: false, message: "Failed to update ticket" };
    }
  }
}

export default new BackedTicketService(
  new TicketService(),
  new ChatMessageService()
);
