"use client";
import xmobcolors from "@/app/styles/xmobcolors";
import XmobButton from "@/components/button/xmobitButton";
import MobitCard from "@/components/cards/xmobcard";
import XmobDropdown from "@/components/dropdown/xmobDropdown";
import XmobInput from "@/components/inputs/xmobitInput";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobTable from "@/components/tables/xmobTable";
import XmobText from "@/components/text/xmobText";
import { Wallet } from "@mui/icons-material";
import { Chip, Modal, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TicketDataModel } from "./backed/backed_tickets";
import BackedTicketService from "./backed/backed_tickets";
import HelpFormatter from "@/helpers/utils/xmobFomartUtil";
import { TicketModel } from "@/helpers/interfaces/TicketModel";
import XmobLoadingComponent from "@/components/loading/xmobLoading";

export default function AdminTicket() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketModel>({} as TicketModel);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("date_asc");
    const [ticketsDatastat, setTicketsDatastat] = useState<TicketDataModel>({} as TicketDataModel);
    const [sortedData, setSortedData] = useState<any[]>([]);
    const [isFetching, setFetching] = useState(true);

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const ticketData: TicketDataModel = await BackedTicketService.getticketsAndStatistics();
                setTicketsDatastat(ticketData);
                setFetching(false);

                const formattedTickets = (ticketData?.tickets ?? []).map(ticket => ({
                    ticketId: ticket.ticketId,
                    status: <Chip label={ticket.isTicketSolved ? "Solved" : "Unsolved"} color={BackedTicketService.getStatusColor(ticket.isTicketSolved)} />,
                    target: ticket.target_team,
                    subject: ticket.title,
                    priority: <Chip label={ticket.Priority} color={BackedTicketService.getPriorityColor(ticket.Priority)} />,
                    solvedBy: ticket.solvedBy || "Unassigned",
                    date: HelpFormatter.formatDate(ticket.updatedAt),
                    submitted: HelpFormatter.formatDate(ticket.createdAt) || "Unknown",
                    action: (
                        <XmobButton
                            backgroundColor="#007bff"
                            color="#fff"
                            borderRadius={0.5}
                            onClick={() => handleTicketPopup(ticket)}
                        >
                            {ticket.isTicketSolved ? "Review" : "View"}
                        </XmobButton>
                    ),
                }));

                setSortedData(formattedTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        }

        fetchData();
    }, []);


    useEffect(() => {
        const sortData = () => {
            const dataToSort = [...sortedData];

            switch (sortBy) {
                case "date_asc":
                    dataToSort.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    break;
                case "date_desc":
                    dataToSort.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    break;
                case "solved_asc":
                    dataToSort.sort((a, b) => (a.priority.props.label === "High" ? 1 : -1));
                    break;
                case "solved_desc":
                    dataToSort.sort((a, b) => (a.priority.props.label === "High" ? -1 : 1));
                    break;
                default:
                    break;
            }

            setSortedData(dataToSort);
        };

        sortData();
    }, [sortBy, ticketsDatastat.tickets]);

    const handleTicketPopup = (ticket: any) => {
        setSelectedTicket(ticket);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedTicket({} as TicketModel);
    };


    const handleGoToTicketDetails = () => {
        if (selectedTicket) {
            router.push(`tickets/resolve-ticket/${selectedTicket.ticketId}`);
        }
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
    };

    const sortOptions = [
        { label: "Date Asc", value: "date_asc" },
        { label: "Date Desc", value: "date_desc" },
        { label: "Solved Asc", value: "solved_asc" },
        { label: "Solved Desc", value: "solved_desc" },
    ];

    const columns = [
        { label: "Ticket ID", key: "ticketId" },
        { label: "Status", key: "status" },
        { label: "Target", key: "target" },
        { label: "Subject", key: "subject" },
        { label: "Priority", key: "priority" },
        { label: "Solved By", key: "solvedBy" },
        { label: "Last Updated", key: "date" },
        { label: "Submitted", key: "submitted" },
        { label: "Action", key: "action" },
    ];

    return (
        <>
            <MobitCard>
                <div className="relative mb-[7rem] p-5" style={{ background: xmobcolors.secondary }}>
                    <XmobitSpacer height={1} />
                    <Xmoblayout layoutType="flex-row" className="relative bottom-[-5rem]" isResponsive={true}>
                        <MobitCard bordered rounded isShadow>
                            <Xmoblayout layoutType="flex-row" isFlexEndToEnd>
                                <XmobText variant="h4" fontWeight="bold">Trade Tickets</XmobText>
                                <Wallet color="secondary" />
                            </Xmoblayout>
                            <XmobText variant={isFetching ? "body1" : "h4"} fontWeight="bold">{
                                   isFetching ? (
                                    <XmobLoadingComponent message="Fetching data-trade tickets " />
                                ): (
                            ticketsDatastat.tradeTickets
                            )

                                }</XmobText>
                        </MobitCard>
                        <MobitCard bordered rounded isShadow>
                            <Xmoblayout layoutType="flex-row" isFlexEndToEnd>
                                <XmobText variant="h4" fontWeight="bold">Other Tickets</XmobText>
                                <Wallet color="secondary" />
                            </Xmoblayout>
                            <XmobText variant={isFetching ? "body1" : "h4"} fontWeight="bold">{
                                   isFetching ? (
                                        <XmobLoadingComponent message="Fetching data-other tickets " />
                                    ): (
                                ticketsDatastat.otherTicket
                                )
                                
                                }</XmobText>
                        </MobitCard>
                        <MobitCard bordered rounded isShadow>
                            <Xmoblayout layoutType="flex-row" isFlexEndToEnd>
                                <XmobText variant="h4" fontWeight="bold">Total Tickets</XmobText>
                                <Wallet color="secondary" />
                            </Xmoblayout>
                            <XmobText variant={isFetching ? "body1" : "h4"} fontWeight="bold">
                                {
                                    isFetching ? (
                                        <XmobLoadingComponent message="Fetching data-total tickets " />
                                    ): (
                                ticketsDatastat.totalTicket
                                )
                                
                                }
                                
                                </XmobText>
                        </MobitCard>
                    </Xmoblayout>
                </div>

                <MobitCard>
                    <Xmoblayout layoutType="flex-row" isFlexEndToEnd isResponsive>
                        <XmobText variant="h4" fontWeight="bold">Ticket Overview</XmobText>
                        <XmobDropdown options={sortOptions} selectedValue={sortBy} label="Sort tickets" onChange={handleSortChange} />
                    </Xmoblayout>
                    {
                    isFetching ? (
                        <XmobLoadingComponent message="Fetching submitted tickets " />
                       
                    ) : (
                        <XmobTable columns={columns} data={sortedData} />
                    )
                    }

                </MobitCard>
            </MobitCard>

            <Modal
                open={isPopupOpen}
                onClose={handleClosePopup}
                aria-labelledby="ticket-details-modal"
                aria-describedby="ticket-details-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" id="ticket-details-modal" gutterBottom>
                        Ticket Details
                    </Typography>
                    {selectedTicket && (
                        <>
                            <Typography variant="body1" gutterBottom>
                                <strong>Ticket ID:</strong> {selectedTicket.ticketId}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Subject:</strong> {selectedTicket.title}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Status:</strong> {selectedTicket.isTicketSolved ? "closed" : "open"}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Priority:</strong> {selectedTicket.isTicketSolved ? "High" : "Low"}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Solved By:</strong> {selectedTicket.solvedBy}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>comment:</strong> {selectedTicket.comments==''  || selectedTicket.comments==null  ? 'No comment' : selectedTicket.comments} 
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Last Updated:</strong> {selectedTicket.updatedAt}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Submitted:</strong> {selectedTicket.submitted}
                            </Typography>
                            
                        </>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={handleClosePopup} sx={{ mr: 2 }}>
                            Close
                        </Button>
                        <Button variant="contained" onClick={handleGoToTicketDetails}>
                           {selectedTicket.isTicketSolved ? "more details" : "solve ticket"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}