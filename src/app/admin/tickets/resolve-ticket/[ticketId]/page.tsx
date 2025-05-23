"use client";
import React, { useEffect, useRef, useState } from "react";
import MobitCard from "@/components/cards/xmobcard";
import Xmoblayout from "@/components/layouts/xmoblayout";
import { wssUrl } from "@/helpers/constants/baseUrls";
import BackedTicketService from "../../backed/backed_tickets";
import XmobText from "@/components/text/xmobText";
import { Chip } from "@mui/material";
import HelpFormatter from "@/helpers/utils/xmobFomartUtil";
import xmobcolors from "@/app/styles/xmobcolors";
import XmobDropdown from "@/components/dropdown/xmobDropdown";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import styles from "./ticket_solve.module.css";
import renderMessageContent from "@/components/ui/chats/MessageContent";
import axios from "axios";
import { MessageModel } from "@/helpers/interfaces/MessageModel";
import { TicketModel } from "@/helpers/interfaces/TicketModel";
import XmobLoadingComponent from "@/components/loading/xmobLoading";
import AttachFileIcon from "@mui/icons-material/AttachFile"; // Import the file upload icon

export default function ResolveTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const resolvedParams = React.use(params); // Unwrap the params Promise
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [ticket, setTicket] = useState<TicketModel>({} as TicketModel);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [modalImage, setModalImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ticketActions = [
    { label: "Cancel Trade and Release Funds to the Seller", value: "100" },
    { label: "Close Ticket and Reverse Funds to the Buyer", value: "101" },
    { label: "Cancel Trade (No further actions required)", value: "102" },
  ];

  const ticketFields = [
    { key: "title", label: "Title", displayHtml: ticket?.title ?? "ticket" },
    {
      key: "description",
      label: "Description",
      displayHtml: ticket?.description ?? "ticket",
    },
    {
      key: "Priority",
      label: "Priority",
      displayHtml: (
        <Chip
          label={ticket?.Priority ?? "ticket"}
          color={BackedTicketService.getPriorityColor(ticket?.Priority ?? "")}
        />
      ),
    },
    {
      key: "isTicketSolved",
      label: "Status",
      displayHtml: (
        <Chip
          label={ticket?.isTicketSolved ? "Solved" : "Unsolved"}
          color={BackedTicketService.getStatusColor(
            ticket?.isTicketSolved ?? false
          )}
        />
      ),
    },
    {
      key: "target_team",
      label: "Assigned Team",
      displayHtml: ticket?.target_team ?? "ticket",
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      displayHtml: HelpFormatter.formatDate(ticket?.updatedAt) ?? "ticket",
    },
    {
      key: "solvedBy",
      label: "Solved By",
      displayHtml: ticket?.solvedBy ?? "ticket",
    },
    {
      key: "ticketType",
      label: "Ticket Type",
      displayHtml: ticket?.ticketType ?? "ticket",
    },
    {
      key: "issueRaisedBy",
      label: "Issue Raised By",
      displayHtml: ticket?.issueRaisedBy ?? "ticket",
    },
    {
      key: "createdAt",
      label: "Created Date",
      displayHtml: HelpFormatter.formatDate(ticket?.createdAt) ?? "ticket",
    },
    {
      key: "comments",
      label: "Comments",
      displayHtml: ticket?.comments ?? "ticket",
    },
    {
      key: "ticketActionCode",
      label: "Ticket Action",
      displayHtml: ticket?.ticketActionCode ?? "",
    },
  ];

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const { ticketDetails, messages } =
          await BackedTicketService.getTicketById(resolvedParams.ticketId);
        setTicket(ticketDetails);
        setMessages(messages);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch ticket details:", error);
      }
    };
    fetchTicketDetails();
  }, [resolvedParams.ticketId]);

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket(`${wssUrl}`);

      ws.current.onopen = () => {
        ws.current?.send(
          JSON.stringify({
            command: "subscribe_chat",
            tradeId: resolvedParams.ticketId,
          })
        );
      };

      ws.current.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.message_author) {
          setMessages((prevMessages) => [receivedMessage, ...prevMessages]);
        }
      };

      ws.current.onclose = () => {
        setTimeout(connectWebSocket, 5000);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [resolvedParams.ticketId]);

  const handleTicketAction = (value: string) => {
    setTicket((prevTicket) => ({ ...prevTicket, ticketActionCode: value }));
    handleSecondaryAction();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let uploadedFileUrl;
    try {
      uploadedFileUrl = await handleFileUpload();
    } catch (error) {
      console.error("File upload failed:", error);
      uploadedFileUrl = null;
    }

    const url = uploadedFileUrl ?? fileUrl ?? "";

    if (!newMessage.trim() && !url) {
      console.warn("Empty message or media link. Not sending.");
      return;
    }

    if (!ws.current) {
      console.error("WebSocket is not initialized.");
      return;
    }

    const newMessageObject = {
      messageId: messages.length + 1,
      message_author: "myuserId", // Replace with actual user ID
      message: newMessage,
      media_link: url,
      tradeId: resolvedParams.ticketId,
      visible_to: "both", // Default visibility
      created_at: new Date().toISOString(),
    };

    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ command: "message", ...newMessageObject })
      );
    } else {
      console.error(
        "WebSocket is not open. ReadyState:",
        ws.current.readyState
      );
    }

    setNewMessage("");
    setFileUrl("");
    setSelectedFile(null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return "";

    const formData = new FormData();
    formData.append("file", selectedFile);
    setIsUploading(true);

    try {
      const response = await axios.post(
        "https://api.xmobit.com/api/v1/file/server/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total !== undefined) {
              // Check if total is defined
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            } else {
              console.warn(
                "progressEvent.total is undefined. Unable to calculate upload progress."
              );
            }
          },
        }
      );

      const fileUrl = `https://resources.xmobit.com/${response.data.file_url}`;
      setFileUrl(fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      return "";
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSecondaryAction = async () => {
    const updateTicket: TicketModel = {
      ticketId: ticket.ticketId,
      isTicketSolved: true,
      ticketActionCode: ticket.ticketActionCode,
      comments: ticket.comments,
      otherInfo: ticket.otherInfo,
    } as TicketModel;

    await BackedTicketService.updateTicket(updateTicket);
    setIsActionModalOpen(false);
  };

  return (
    <div>
      {isLoading ? (
        <XmobLoadingComponent message="Fetching Ticket Details" />
      ) : (
        <>
          <Xmoblayout layoutType="grid-2">
            <Xmoblayout layoutType="flex-row" isResponsive={true}>
              <div className="w-full">
                <MobitCard
                  bordered={true}
                  rounded={true}
                  background={xmobcolors.secondary}
                >
                  <XmobText variant="h5" textAlign="center" fontWeight="bold">
                    Ticket Details
                  </XmobText>
                  {ticketFields.map((field) => (
                    <div key={field.key}>
                      <Xmoblayout layoutType="flex-row">
                        <XmobText className="p-1" fontWeight="bold">
                          {field.label}:
                        </XmobText>
                        <XmobText>{field.displayHtml}</XmobText>
                      </Xmoblayout>
                    </div>
                  ))}
                </MobitCard>
              </div>
              <MobitCard>
                <XmobText variant="h5" textAlign="center" fontWeight="bold">
                  Actions
                </XmobText>
                <XmobitSpacer height={1} />
                <XmobDropdown
                  options={ticketActions}
                  selectedValue={ticket.ticketActionCode}
                  label="Ticket closing"
                  onChange={handleTicketAction}
                />
              </MobitCard>
            </Xmoblayout>
            <div className="p-8 border-t border-gray-100">
              <form onSubmit={handleSubmit} className="mb-8">
                <textarea
                  className={`w-full mb-4 ${styles.form_input}`}
                  rows={4}
                  placeholder="Write your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Xmoblayout
                  layoutType="flex-row"
                  isResponsive={true}
                  isFlexEndToEnd={true}
                >
                  <label
                    htmlFor="file-upload"
                    className={styles.file_upload_button}
                  >
                    <AttachFileIcon className="mr-2" />
                    <span>Upload File</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setSelectedFile(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </label>
                  <button type="submit" className={styles.action_button}>
                    Send Message
                  </button>
                </Xmoblayout>
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected file: {selectedFile.name}
                  </div>
                )}
                {isUploading && (
                  <div className="mt-2">
                    <progress
                      value={uploadProgress}
                      max="100"
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600">
                      {uploadProgress}% uploaded
                    </span>
                  </div>
                )}
              </form>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Message History
              </h2>
              <div
                className={`space-y-4 max-h-[600px] overflow-y-auto ${styles.messages_container}`}
              >
                {messages.map((reply) =>
                  reply.author_name === "system" ? (
                    <div
                      key={reply.messageId}
                      className="text-center text-gray-500 text-sm my-2"
                    >
                      <span className="bg-gray-200 px-3 py-1 rounded-lg">
                        {reply.message}
                      </span>
                    </div>
                  ) : (
                    <div
                      key={reply.messageId}
                      className={styles.message_bubble}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-indigo-600 font-semibold text-lg">
                          {reply.author_name}
                        </span>
                        <span className="text-gray-400">
                          {HelpFormatter.formatDate(reply.created_at)}
                        </span>
                      </div>
                      <div className="text-gray-700 leading-relaxed">
                        {renderMessageContent(
                          reply.message,
                          reply.media_link,
                          setModalImage
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </Xmoblayout>
        </>
      )}
    </div>
  );
}
