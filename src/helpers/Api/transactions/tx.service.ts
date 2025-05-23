import axios from "axios";
import { baseUrl } from "@/helpers/constants/baseUrls";
import TokenService from "@/helpers/Token/token.service";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";

// Transaction interfaces
export interface TransactionRequest {
  recipient: string;
  amount: string;
  source: SourceType;
  currency: "BTC" | "XMR";
}

export interface TransactionResponse {
  id: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
  txHash?: string;
}

export interface VerificationResponse {
  isInternal: boolean;
  hasSecurityQuestions: boolean;
  has2FA: boolean;
  success: boolean;
  error?: string;
}

export enum SourceType {
  FUNDING = "funding",
  SPOT = "spot",
}

class TransactionService {
  private baseUrl = baseUrl;

  async validateTransaction(data: TransactionRequest): Promise<any> {
    try {
      const response = await AxiosInstance.post(
        `${this.baseUrl}/bitcoin/validate`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await TokenService.getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Validation error:", error);
      return (
        error.response.data.error || "Invalid address for this cryptocurrency"
      );
    }
  }

  // Initiate a transaction
  async initiateTransaction(
    data: TransactionRequest
  ): Promise<TransactionResponse> {
    try {
      const response = await AxiosInstance.post(`${this.baseUrl}/send`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Transaction initiation error:", error);
      throw error;
    }
  }

  // Verify a transaction with 2FA or security question
  async verifyTransaction(
    transactionId: string,
    verificationCode: string,
    verificationType: "2FA" | "SECURITY_QUESTION"
  ): Promise<VerificationResponse> {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${this.baseUrl}/verify`,
        {
          transactionId,
          verificationCode,
          verificationType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    }
  }

  // Get transaction status
  async getTransactionStatus(
    transactionId: string
  ): Promise<TransactionResponse> {
    try {
      const response = await AxiosInstance.get(
        `${this.baseUrl}/${transactionId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Status check error:", error);
      throw error;
    }
  }
  // helpers/Api/transactions/tx.service.ts

  // Fixed the sendTransaction method to properly handle the response and close the function.
  async sendTransaction(data: {
    identifier: string;
    amount: number;
    currency: "BTC" | "XMR";
    source: string;
  }): Promise<any> {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${this.baseUrl}/btc/spot/sendCrypto`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error: any) {
      throw error.message;
    }
  }
}

export const transactionService = new TransactionService();
