import { wssUrl } from "@/helpers/constants/baseUrls";

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 5000;
  private eventListeners: { [key: string]: ((data: any) => void)[] } = {};

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(wssUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.handleReconnect();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { action, ...payload } = data;

          if (this.eventListeners[action]) {
            this.eventListeners[action].forEach((listener) =>
              listener(payload)
            );
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  addEventListener(event: string, callback: (data: any) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  removeEventListener(event: string, callback: (data: any) => void) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  // Method to manually trigger reconnection if needed
  reconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.handleReconnect();
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
