export interface UserNotification {
    id: number;
    userId: string;
    userEmail: string;
    title: string;
    message: string;
    isRead: boolean;
    notificationType: string;
    priority: 'low' | 'medium' | 'high'; 
    sentBy: string;
    createdAt: string; 
    updatedAt: string; 
  }
  