import { baseUrl } from "@/helpers/constants/baseUrls";
import AxiosInstance from "@/helpers/security/interceptors/http.interceptor";
import TokenService from "@/helpers/Token/token.service";
 
class SystemLogService{
    async generateSystemReport() {
        try {
          const token = await TokenService.getToken();
          const response = await AxiosInstance.get(`${baseUrl}/system-logs/system-status`, {
            headers: { Authorization: `Bearer ${token}` },
         });
          return response.data;
        } catch (error:any) {
          throw new Error(`Failed to generate system report: ${error.message}`);
        }
      }

      async markNotificationAsRead(notificationId: number) {
        try {
          const token = await TokenService.getToken();
          const response = await AxiosInstance.put(
            `${baseUrl}/system-logs/system-status/${notificationId}/read`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data;
        } catch (error: any) {
          throw new Error(`Failed to mark notification as read: ${error.message}`);
        }
      }


      async markNotificationAsUserRead(notificationId: number) {
        try {
          const token = await TokenService.getToken();
          const response = await AxiosInstance.put(
            `${baseUrl}/system-logs/notifications/${notificationId}/read`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data;
        } catch (error: any) {
          throw new Error(`Failed to mark notification as read: ${error.message}`);
        }
      }




      async markAllNotificationsAsRead() {
        try {
          const token = await TokenService.getToken();
          const response = await AxiosInstance.put(
            `${baseUrl}/system-logs/system-status/read-all`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data;
        } catch (error: any) {
          throw new Error(`Failed to mark all notifications as read: ${error.message}`);
        }
      }

      async getAllUserNotification()
      {
        try {
          const token = await TokenService.getToken();
          const response = await AxiosInstance.get(`${baseUrl}/system-logs/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
         });
          return response.data;
        } catch (error:any) {
          throw new Error(`Failed to generate user notifiation: ${error.message}`);
        }

      }
}

export default SystemLogService;