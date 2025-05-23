import { baseUrl } from "@/helpers/constants/baseUrls";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";

class UserService {
  async getAllUsers() {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.get(`${baseUrl}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching users: ", error);
      throw error;
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
  async updateUserDetails(user_id: string, username: string, email: string) {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is requiredhhh");
      }

      const response = await AxiosInstance.put(
        `${baseUrl}/admin/users/${user_id}/details`,
        { username, email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating user role: ", error);
      throw error;
    }
  }

  async deleteUser(user_id: string) {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.delete(
        `${baseUrl}/admin/users/${user_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting user: ", error);
      throw error;
    }
  }

  async updateUserStatus(username: string, status: string) {
    try {
      const token = (await TokenService.getToken()) || "";
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await AxiosInstance.put(
        `${baseUrl}/admin/users/${username}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating user status: ", error);
      throw error;
    }
  }
}

export default UserService;
