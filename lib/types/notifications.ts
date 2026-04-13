export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  unread: boolean;
  icon: 'heart' | 'checkmark-circle' | 'chatbubble' | 'time' | 'alert-circle' | 'gift';
  iconColor: string;
}
