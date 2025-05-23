export interface TicketAnalytics {
    totalTickets: number;
    openTickets: number;
    solvedTickets: number;
    ticketsByPriority: {
      high: number;
      medium: number;
      low: number;
    };
    ticketsByType: {
      [key: string]: number;
    };
  }