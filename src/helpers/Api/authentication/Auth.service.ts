import { User3partyDTO } from "@/types/user3party.types";
import { baseUrl } from "../../constants/baseUrls";
import { ResetPassTypes, SignupTypes, VerifyTypes } from "@/types/signup.types";
import TokenService from "../../Token/token.service";
import JWTHandler from "../../security/JWTHandler";
import { UserPaymentDetails } from "@/types/userPayment.types";
import { BankDetails } from "@/types/BankDetails.types";
import { Profile } from "@/types/profile.types";
import AxiosInstance from "../../security/interceptors/http.interceptor";

export interface LoginDto {
  phone_email: string;
  password: string;
}

export interface TwoFactorAuthStatus {
  requires2FA: boolean;
  method: "authenticator" | "email" | "phone" | null;
}

export default class AuthApiService {
  static async signUp(data: SignupTypes) {
    try {
      const response = await AxiosInstance.post(`${baseUrl}/auth/signup`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  }

  static async verifyEmail(data: VerifyTypes) {
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/verify/email`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Email verification failed"
      );
    }
  }

  static async resetPassword(data: ResetPassTypes) {
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/reset/new/password`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  }

  static async resendOTPEmail(email: string) {
    const token = await TokenService.getToken(); // This could be temporary token
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/resend/email`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "OTP resend failed");
    }
  }

  static async login(credentials: LoginDto) {
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/login`,
        credentials
      );

      if (
        response.status === 302 ||
        (response.data && response.data.statusCode === 302)
      ) {
        const data = response.data || {};
        return {
          error: false,
          data: {
            statusCode: 302,
            requires2FA: true,
            method: data.method || "email",
            message: data.message || "Verification required",
            userId: data.userId || "",
            email: data.email || credentials.phone_email,
            tempToken: data.tempToken || "",
          },
        };
      }

      return { error: false, data: response.data };
    } catch (error: any) {
      return {
        error: true,
        data: error.response?.data || {
          message: "An error occurred during login",
        },
      };
    }
  }

  static async verify2FAToken(code: string) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/verify2fa/token`,
        { token: Number(code) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      return {
        error: true,
        data: error.response?.data || { message: "Verification failed" },
      };
    }
  }

  static async activate2FA() {
    const token = await TokenService.getToken();
    if (!token) {
      throw new Error("Token is required to activate 2FA");
    }
    try {
      const response = await AxiosInstance.get(`${baseUrl}/auth/2fa/activate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { error: false, data: response.data };
    } catch (error: any) {
      return { error: true, data: error.response?.data };
    }
  }

  static async resetPasswordSendToEmail(email: string) {
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/reset/password`,
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Reset email send failed"
      );
    }
  }

  static async setQuesAndAns(question: string, answer: string) {
    const token = await TokenService.getToken();
    if (!token) {
      throw new Error("Token is required to set question and answer");
    }
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/set/question`,
        { question, answer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      return { error: true, data: error.response?.data };
    }
  }

  static async verifySecurityAnswer(email: string, answer: string) {
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/verify/answer`,
        { email, answer }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to verify answer");
    }
  }

  static async getSecurityQuestion(email: string) {
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/get/question`,
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get security question");
    }
  }

  static async getSecurityQuestionUsingID() {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/auth/my-security-questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get security questions");
    }
  }

  static async continueWith3Party(userDetails: User3partyDTO) {
    try {
      const token = await JWTHandler.encode(userDetails);

      const response = await AxiosInstance.get(
        `${baseUrl}/auth/continue-with-3party-auth/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.message === "Network Error") {
        throw new Error("Network error - cannot reach authentication server");
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error in 3rd party authentication";

      throw new Error(errorMessage);
    }
  }

  async getMyDetails() {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.get(`${baseUrl}/auth/my-details/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error in getting my details", error);
      throw new Error("Failed to get my details");
    }
  }

  static async generate2FAsecret() {
    const token = await TokenService.getToken();
    if (!token) {
      throw new Error("Token is required to generate 2FA secret");
    }
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/auth/generateSecret`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { error: false, data: response.data };
    } catch (error: any) {
      return { error: true, data: error.response?.data };
    }
  }

  static async verify2FAtoken(token: string, userId?: string) {
    const code = Number(token);
    const Authtoken = await TokenService.getToken();
    const body = { token: code };
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/verify2fa/token`,
        body,
        {
          headers: { Authorization: `Bearer ${Authtoken}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return { error: true, data: error.response?.data };
    }
  }

  static async updateProfileImage(imageUrl: string) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/update/profileUrl`,
        { imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Image upload failed");
    }
  }

  static async sendPhoneOTP(phone: string) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/send/phone`,
        { phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Sending code failed!");
    }
  }

  static async verifyPhoneOTP(phone: string, otpCode: string) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/verify/phone`,
        { phone, otpCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Code verification failed!"
      );
    }
  }

  static async savePhoneNumber(phone: string) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/save/phone`,
        { phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Saving phone failed!");
    }
  }

  static async updateUsername(user_name: string) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/username/update`,
        { user_name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Saving username failed!"
      );
    }
  }

  static async updateBio(bio: string) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/update/bio`,
        { bio },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Saving bio failed!");
    }
  }

  static async updateProfile(profile: Profile) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/update/profile`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Saving profile failed!"
      );
    }
  }

  static async savePaymentDetails(paymentDetails: UserPaymentDetails) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/save/payment-details`,
        paymentDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Saving payment details failed!"
      );
    }
  }

  static async saveBankDetails(bankDetails: BankDetails) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/save/payment-bank-details`,
        bankDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Saving bank details failed!"
      );
    }
  }

  static async getPaymentDetails() {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/auth/get/payment/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get payment details");
    }
  }
  static async getAllPaymentDetails() {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.get(`${baseUrl}/admin/payment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get payment details");
    }
  }
  static async getAllPaymentDetailsAdmin() {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/admin/payment/admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get payment details");
    }
  }
  static async deletePaymentMethod(id: number) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.delete(
        `${baseUrl}/admin/payment/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get payment details");
    }
  }
  static async createPaymentMethod(data: any) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/admin/payment`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get payment details");
    }
  }
  static async updatePaymentMethod(id: number, data: any) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.put(
        `${baseUrl}/admin/payment/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get payment details");
    }
  }

  static async getSpotAddress() {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/btc/spot/my-details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to get spot address");
    }
  }

  static async changePassword(oldPassword: string, newPassword: string) {
    const token = await TokenService.getToken();
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/change/password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Changing password failed"
      );
    }
  }
  static async getDetailsDetails() {
    try {
      const token = await TokenService.getToken();
      const response = await AxiosInstance.get(
        `${baseUrl}/auth/get/payment/details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        error: false,
        data: response.data,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.message || "Failed to fetch payment details",
      };
    }
  }

  static async contact(formData: {
    name: string;
    email: string;
    number: string;
    message: string;
  }) {
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/auth/contact`,
        formData
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Contact form submission failed");
    }
  }
}
