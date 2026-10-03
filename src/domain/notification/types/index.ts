export type NotificationType =
  | 'GROUP_JOIN_REQUEST'
  | 'GROUP_SCHEDULE_CHANGED'
  | 'GROUP_RESPONSE_DEADLINE'
  | 'GROUP_RESPONSE_RECEIVED';

export type NotificationResponse = {
  notificationId: number;
  type: NotificationType;
  message: string;
  createdAt: string;
  isRead: boolean;
};
