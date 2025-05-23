import SystemLogService from "@/helpers/Api/system/system.logs.service";
import { NotificationModel } from "@/helpers/interfaces/NotificationModel";

class AdminNotificationBackend {
    private notificationService: SystemLogService;

    constructor(notificationService: SystemLogService) {
        this.notificationService = notificationService;
    }

    async markNotificationAsRead(notification: NotificationModel): Promise<{ success: boolean; message: string }> {
        try {
            await this.notificationService.markNotificationAsRead(notification.id);
            return {
                success: true,
                message: "Notification marked as read",
            };
        } catch (e) {
            console.error(e);
            return {
                success: false,
                message: "Error marking notification as read",
            };
        }
    }
    async markAllNotificationsAsRead():Promise<{ success: boolean; message: string }>{
        try {
            await this.notificationService.markAllNotificationsAsRead();
            return {
                success: true,
                message: "All notifications marked as read",
            };
        } catch (e) {
            console.error(e);
            return {
                success: false,
                message: "Error marking all notifications as read",
            };
    
    }
}
}

export default new AdminNotificationBackend(new SystemLogService());
