import SystemLogService from "@/helpers/Api/system/system.logs.service";
import { ApiLogModel } from "@/helpers/interfaces/ApiLogModel";
import { HttpReponseDTo } from "@/helpers/interfaces/HttpResponseDto";
import { NotificationModel } from "@/helpers/interfaces/NotificationModel";
import {
  addAdminNotifications,
  addUserNotification,
  addUserNotifications,
  store,
} from "@/app/store"; // Import Redux store
import { UserNotification } from "@/helpers/interfaces/UserNotification";

export interface SystemLogsAndStatistics {
  systemLogs: ApiLogModel[];
  totalLogsPerHour: { hourNum: number; label: string; count: number }[];
}

class BackedAdminSystemReport {
  private reportService: SystemLogService;

  constructor(reportService: SystemLogService) {
    this.reportService = reportService;
  }

  async getAllSystemLogs(): Promise<{
    success: boolean;
    logsData: SystemLogsAndStatistics;
  }> {
    try {
      const systemReport: HttpReponseDTo =
        await this.reportService.generateSystemReport();
      const totalLogsPerHour = this.getStatisticsData(systemReport.data);

      return {
        success: true,
        logsData: {
          systemLogs: systemReport.data,
          totalLogsPerHour,
        },
      };
    } catch (error: any) {
      console.error("Error fetching system logs:", error);
      return {
        success: false,
        logsData: {
          systemLogs: [],
          totalLogsPerHour: [],
        },
      };
    }
  }

  async getSystemAsNotification(): Promise<NotificationModel[]> {
    try {
      const { success, logsData } = await this.getAllSystemLogs();
      const notificationList: NotificationModel[] = [];

      if (success) {
        logsData.systemLogs.forEach((log) => {
          notificationList.push({
            id: log.id,
            message: log.errorMessage,
            from: "System",
            time: log.createdAt,
            read: log.isAsNotificationRead || false, // Default to false if undefined
          });
        });
      }

      return notificationList;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  async getSystemUserNotification(): Promise<NotificationModel[]> {
    try {
      const { success, userNotificationList } =
        await this.getAllUserNotification();
      const notificationList: NotificationModel[] = [];

      if (success) {
        userNotificationList.forEach((log) => {
          notificationList.push({
            id: log.id,
            message: log.message,
            from: log.sentBy,
            time: log.createdAt,
            read: log.isRead || false,
          });
        });
      }

      return notificationList;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  async getAllUserNotification(): Promise<{
    success: boolean;
    userNotificationList: UserNotification[];
  }> {
    try {
      const systemReport: HttpReponseDTo =
        await this.reportService.getAllUserNotification();
      const userNotification: UserNotification[] = systemReport.data;
      return {
        success: true,
        userNotificationList: userNotification,
      };
    } catch (error) {
      console.error("Error fetching user Notification:", error);
      return {
        success: false,
        userNotificationList: [],
      };
    }
  }

  async fetchAndDispatchNotifications() {
    try {
      const notifications = await this.getSystemAsNotification();
      if (notifications.length > 0) {
        store.dispatch(addAdminNotifications(notifications.reverse()));
      }
    } catch (error) {
      console.error("Error dispatching notifications:", error);
    }
  }

  async fetchAndDispatchNotificationsUser() {
    try {
      const notifications = await this.getSystemUserNotification();
      if (notifications.length > 0) {
        store.dispatch(addUserNotifications(notifications.reverse()));
      }
    } catch (error) {
      console.error("Error dispatching notifications:", error);
    }
  }

  private getStatisticsData(
    systemLogs: ApiLogModel[]
  ): { hourNum: number; label: string; count: number }[] {
    return this.groupLogsByHour(systemLogs);
  }

  private groupLogsByHour(
    logs: ApiLogModel[]
  ): { hourNum: number; label: string; count: number }[] {
    const today = new Date().toISOString().split("T")[0];

    const todayLogs = logs.filter(
      (log) => new Date(log.timeCalled).toISOString().split("T")[0] === today
    );

    const logsGroupedByHour = todayLogs.reduce(
      (acc: Record<number, number>, log) => {
        const hour = new Date(log.timeCalled).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(logsGroupedByHour)
      .map(([hour, count]) => {
        const hourNum = Number(hour);
        const formattedHour =
          hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
        const period = hourNum < 12 ? "AM" : "PM";
        const formattedDate = new Date().toLocaleDateString();

        return {
          hourNum,
          label: `${formattedHour} ${period} (${formattedDate})`,
          count,
        };
      })
      .sort((a, b) => a.hourNum - b.hourNum);
  }
}

export default new BackedAdminSystemReport(new SystemLogService());
