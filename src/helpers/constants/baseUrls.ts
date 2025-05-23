const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// const baseUrl="http://localhost:8080"

// const baseUrl = "http://localhost:4002/api/v1";

// const baseUrl = "https://server-2tzl.onrender.com";

const wssUrl = process.env.NEXT_PUBLIC_WSS_URL || "wss://api.xmobit.com";
// const wssUrl = "ws://localhost:4002";
// const wssUrl = "wss://server-2tzl.onrender.com";

export { baseUrl, wssUrl };
