"use client"
import BarGraphUi from "@/app/admin/dashboard/sub/bargraph";
import PieChartUi from "@/app/admin/dashboard/sub/PieChart";
import TicketAnalysisUiTable from "@/app/admin/dashboard/sub/ticketsTable";
import Xmoblayout from "@/components/layouts/xmoblayout";
import TicketService from "@/helpers/Api/tickets/ticket.service";
import { TicketAnalytics } from "@/helpers/interfaces/TicketAnalytics";
import { TicketModel } from "@/helpers/interfaces/TicketModel";
import { useEffect, useState } from "react";

export default function TicketAnalysisUI() {
       const [ticketAnalytics, setTicketAnalytics] = useState<TicketAnalytics>({
            totalTickets: 0,
            openTickets: 0,
            solvedTickets: 0,
            ticketsByPriority: { high: 0, medium: 0, low: 0 },
            ticketsByType: {},
          });
           const [tickets, setTickets] = useState<TicketModel[]>([]);
                useEffect(()=>{
                  const fetchTicketAnalytics = async () => {
                      try {
                        const ticketsData = await new TicketService().getTickets();
                        setTickets(ticketsData); // Store tickets in state
                  
                        const analytics = {
                          totalTickets: ticketsData.length,
                          openTickets: ticketsData.filter((t) => !t.isTicketSolved).length,
                          solvedTickets: ticketsData.filter((t) => t.isTicketSolved).length,
                          ticketsByPriority: {
                            high: ticketsData.filter((t) => t.Priority?.toLowerCase() === "high")
                              .length,
                            medium: ticketsData.filter(
                              (t) => t.Priority?.toLowerCase() === "medium"
                            ).length,
                            low: ticketsData.filter((t) => t.Priority?.toLowerCase() === "low")
                              .length,
                          },
                          ticketsByType: ticketsData.reduce((acc: any, ticket) => {
                            acc[ticket.ticketType] = (acc[ticket.ticketType] || 0) + 1;
                            return acc;
                          }, {}),
                        };
                  
                        setTicketAnalytics(analytics);
                      } catch (error) {
                        console.error("Failed to fetch ticket analytics:", error);
                        setTickets([]); 
                      }
                    };
                    fetchTicketAnalytics();
                })
    return (
        <>
        <Xmoblayout layoutType="grid-2">
            <PieChartUi ticketAnalytics={ticketAnalytics}/>
            <BarGraphUi ticketAnalytics={ticketAnalytics}/>
        </Xmoblayout>
        <TicketAnalysisUiTable tickets={tickets}  />
        </>
        

    )
}