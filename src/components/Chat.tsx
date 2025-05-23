import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaFileImage } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { HiUserCircle, HiShieldCheck } from "react-icons/hi";
import { wssUrl } from "@/helpers/constants/baseUrls";
import ChatService from "@/helpers/Api/chat/chat.service";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ClipLoader } from "react-spinners";
import TokenService from "@/helpers/Token/token.service";
import { AnyARecord } from "node:dns";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ChatProps = {
  userId: string;
  chatPartnerId: string;
  chatPartnerImg?: string;
  partnerName: string;
  partnerTradeVolumes?: number;
  chatContainerClass?: string;
  tradeId: string;
  onChatEvent: (event: any) => void;
};

interface UserAccount {
  id: number;
  user_id: string;
  username: string;
  password: string;
  phone_number: string;
  email: string;
  email_verified: boolean;
  phoneno_verified: boolean;
  otpcode: string;
  otpexp: string;
  isaccountactive: boolean;
  is2faenabled: boolean;
  dateregistered: string;
  auth_provider: string;
  two_factor_secret: string;
  username_updated: boolean;
  user_profile: string;
}

export type Message = {
  messageId?: number;
  message_author: string;
  message: string;
  media_link: string;
  visible_to: string;
  created_at: string;
  author_name: string;
};

const Chat: React.FC<ChatProps> = (props) => {
  const {
    userId,
    chatPartnerId,
    partnerName,
    partnerTradeVolumes,
    chatContainerClass,
    tradeId,
    onChatEvent,
  } = props;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [modalImage, setModalImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [visibleTo, setVisibleTo] = useState<string>("both");
  const [recipientDetails, setRecipientDetails] = useState<UserAccount>();
  const [myuserId, setUserId] = useState<String>("");

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 5000;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    async function getuserId() {
      const token = await TokenService.decodeToken();
      setUserId(token?.userId);
    }
    getuserId();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(`${wssUrl}`);
    const connectWebSocket = () => {
      ws.current!.onopen = () => {
        reconnectAttempts.current = 0;
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(
            JSON.stringify({
              command: "subscribe_chat",
              tradeId: props.tradeId,
            })
          );
        }
        ("WebSocket connection opened");
      };

      ws.current!.onclose = () => {
        handleReconnect();
      };

      ws.current!.onerror = (error) => {
        console.error("WebSocket error:", error);
        handleReconnect();
      };
    };

    const AdminTicketSolutionAction = (messageData: AnyARecord) => {
      onChatEvent(messageData);
    };

    const handleReconnect = () => {
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        setTimeout(() => {
          connectWebSocket();
        }, reconnectDelay);
      } else {
        console.error(
          "Max reconnection attempts reached. Please check your connection."
        );
      }
    };
    ws.current.onopen = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({ command: "subscribe_chat", tradeId: props.tradeId })
        );
      }
    };

    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);

      if (receivedMessage.code) {
        AdminTicketSolutionAction(receivedMessage);
      }
      if (!receivedMessage.message_author) return;

      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    ws.current.onclose = () => {
      handleReconnect();
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      handleReconnect();
    };

    const fetchChatHistory = async () => {
      try {
        setIsloading(true);
        const response = await ChatService.getChats(props.tradeId);
        setMessages(response);
        setIsloading(false);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        toast.error("Error fetching chat history");
        setIsloading(false);
      }
    };

    fetchChatHistory();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [props.tradeId]);

  useEffect(() => {
    async function getRecipientDetails() {
      const response: UserAccount = await ChatService.getRecipientDetails(
        props.tradeId
      );
      setRecipientDetails(response);
    }
    getRecipientDetails();
  }, [props.tradeId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uploadedFileUrl = await handleFileUpload();
    const url = uploadedFileUrl || fileUrl;

    if (newMessage.trim() || url) {
      const newMessageObject: any = {
        messageId: messages.length + 1,
        message_author: myuserId,
        message: newMessage,
        media_link: url,
        tradeId: props.tradeId,
        visible_to: visibleTo,
        created_at: new Date().toISOString(),
      };

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        newMessageObject.command = "message";
        ws.current.send(JSON.stringify(newMessageObject));
      }

      // setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      setNewMessage("");
      setFileUrl("");
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);

    try {
      const response = await axios.post(
        "https://api.xmobit.com/api/v1/file/server/upload",
        formData,
        {
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      const fileUrl = `https://resources.xmobit.com/${response.data.file_url}`;
      setFileUrl(fileUrl);

      setSelectedFile(null);
      setPreviewUrl("");
      setUploadProgress(0);
      setIsUploading(false);

      return fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
      return "";
    }
  };

  const renderMessageContent = (message: string, mediaLink: string) => {
    if (mediaLink) {
      if (mediaLink.match(/\.(jpeg|jpg|gif|png|webp)$/) != null) {
        return (
          <div onClick={() => openModal(mediaLink)}>
            <img
              src={mediaLink}
              alt="uploaded"
              className="max-w-full h-auto cursor-pointer"
            />
            {message && <p className="break-words">{message}</p>}
          </div>
        );
      } else if (mediaLink.match(/\.(pdf)$/) != null) {
        return (
          <div>
            <a
              href={mediaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              <FaFileImage size={27} />
            </a>
            {message && <p>{message}</p>}
          </div>
        );
      } else if (
        mediaLink.startsWith("http://") ||
        mediaLink.startsWith("https://")
      ) {
        return (
          <div>
            <a
              href={mediaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Document
            </a>
            {message && <p>{message}</p>}
          </div>
        );
      }
    }

    return <p className="break-words">{message}</p>;
  };

  const openModal = (imageLink: string) => {
    setModalImage(imageLink);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col w-full h-[500px] bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-3 flex items-center gap-3">
        <div className="relative">
          <img
            src={recipientDetails?.user_profile || `/avatar.png`}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
            onError={(e) => {
              e.currentTarget.src = `/avatar.png`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h3 className="font-semibold">
            {recipientDetails?.username || partnerName}
          </h3>
          <div className="flex items-center text-xs text-blue-50">
            <span className="inline-flex items-center">
              <HiShieldCheck className="mr-1" /> Trades:{" "}
              {props.partnerTradeVolumes || 5}
            </span>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div
        className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3"
        ref={chatContainerRef}
      >
        {isloading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <ClipLoader color="#3b82f6" size={30} />
              <p className="text-sm text-slate-500 mt-2">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-slate-400">
              <HiUserCircle className="mx-auto text-4xl mb-2" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message: Message, index) => {
            const isMe = message.message_author === myuserId;
            const isAdmin = message.author_name === "admin";
            const isSystem = message.author_name === "system";

            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"} ${
                  index > 0 &&
                  messages[index - 1].message_author === message.message_author
                    ? "mt-1"
                    : "mt-3"
                }`}
              >
                {isSystem ? (
                  <div className="mx-auto px-3 py-1.5 bg-slate-200 rounded-full text-sm text-slate-600">
                    {message.message}
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] flex ${
                      isMe ? "flex-row-reverse" : "flex-row"
                    } items-end gap-2`}
                  >
                    {!isMe &&
                      !isAdmin &&
                      index > 0 &&
                      messages[index - 1].message_author !==
                        message.message_author && (
                        <img
                          src={recipientDetails?.user_profile || `/avatar.png`}
                          alt="Avatar"
                          className="w-6 h-6 rounded-full mb-1"
                          onError={(e) => {
                            e.currentTarget.src = `/avatar.png`;
                          }}
                        />
                      )}
                    <div
                      className={cn(
                        "px-3 py-2 rounded-lg shadow-sm break-words",
                        isMe
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : isAdmin
                          ? "bg-amber-500 text-white"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                      )}
                    >
                      {isAdmin && (
                        <div className="font-semibold text-xs mb-1 flex items-center">
                          <HiShieldCheck className="mr-1" /> ADMIN
                        </div>
                      )}
                      {renderMessageContent(
                        message.message,
                        message.media_link
                      )}
                      {message.created_at && (
                        <div
                          className={`text-[10px] mt-1 ${
                            isMe
                              ? "text-blue-200"
                              : isAdmin
                              ? "text-amber-100"
                              : "text-slate-400"
                          } text-right`}
                        >
                          {formatMessageTime(message.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Chat input */}
      <div className="border-t border-slate-200 bg-white p-3">
        {previewUrl && (
          <div className="mb-3 p-2 bg-slate-100 rounded-lg flex items-center gap-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 text-sm text-slate-600 truncate">
              Ready to upload
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl("");
              }}
              className="p-1 bg-red-100 text-red-500 hover:bg-red-200 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <form
          className="flex gap-2 items-center bg-slate-100 rounded-full pr-2 transition-all focus-within:ring-2 focus-within:ring-blue-300"
          onSubmit={handleSubmit}
        >
          <input
            className="flex-1 py-2 px-4 bg-transparent border-none outline-none rounded-full text-slate-800 placeholder-slate-400"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isUploading}
          />

          <div className="flex items-center gap-1">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="relative">
                  <select
                    className="appearance-none bg-transparent border border-slate-300 text-xs text-slate-600 rounded-full px-2 py-1 cursor-pointer focus:outline-none focus:border-blue-400"
                    value={visibleTo}
                    onChange={(e) => setVisibleTo(e.target.value)}
                  >
                    <option value="both">Both</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="p-2 text-sm">
                Choose who can see this message
              </HoverCardContent>
            </HoverCard>

            <label className="cursor-pointer p-2 rounded-full text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-colors">
              <MdAttachFile size={18} />
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={isUploading || (!newMessage.trim() && !selectedFile)}
              className={cn(
                "p-2 rounded-full transition-colors",
                !newMessage.trim() && !selectedFile
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-white bg-blue-500 hover:bg-blue-600"
              )}
            >
              {isUploading ? (
                <ClipLoader color="#ffffff" size={14} />
              ) : (
                <FaPaperPlane size={14} />
              )}
            </button>
          </div>
        </form>

        {isUploading && (
          <div className="w-full mt-2">
            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1 text-slate-500">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Image modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
          onClick={handleModalClick}
        >
          <div className="relative max-w-4xl max-h-[80vh] p-1 bg-white rounded-lg shadow-xl">
            <img
              src={modalImage}
              alt="Full Size"
              className="w-full h-full object-contain max-h-[calc(80vh-2rem)]"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Helper function to format message time nicely
  function formatMessageTime(dateString: string) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return format(date, "h:mm a");
      } else {
        return format(date, "MMM d, h:mm a");
      }
    } catch (e) {
      return "";
    }
  }
};

export default Chat;
