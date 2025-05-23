import axios from "axios";
import CryptoJS from "crypto-js";

const secretKey = process.env.NEXT_PUBLIC_RequestKeyEncryption || "";
const isProduction = process.env.NEXT_PUBLIC_ISPROD === "true";

const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (ciphertext: any) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  try {
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Error decrypting data:", error, "\nCiphertext:", ciphertext);
    throw error;
  }
};

const AxiosInstance = axios.create();

AxiosInstance.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() || "GET";
    if (config.data) {
      if (isProduction) {
        const encryptedData = encryptData(config.data);
        config.data = { data: encryptedData };
      }
      // In non-production, use the data as is
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase() || "GET";
    if (isProduction && response.data && response.data.data) {
      try {
        const decryptedData = decryptData(response.data.data);
        response.data = decryptedData;
      } catch (error) {
        console.error("Decryption failed:", error);
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const method = error.response.config.method?.toUpperCase() || "GET";
      if (isProduction && error.response.data && error.response.data.data) {
        try {
          const decryptedData = decryptData(error.response.data.data);
          error.response.data = decryptedData;
        } catch (decryptError) {
          console.error("Decryption failed for error response:", decryptError);
        }
      }
    } else {
      console.log("Error without response:", error);
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
