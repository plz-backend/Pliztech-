export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  unread: boolean;
  icon: 'heart' | 'checkmark-circle' | 'chatbubble' | 'time' | 'alert-circle' | 'gift';
  iconColor: string;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'You received N2,000',
    body: 'A kind person just supported your transport request. Keep going',
    timeAgo: '2 mins ago',
    unread: true,
    icon: 'heart',
    iconColor: '#2E8BEA',
  },
  {
    id: '2',
    title: 'Your request is fully funded!',
    body: "Congratulations! your request for groceries has been fully funded. The funds will be transferred shortly.",
    timeAgo: '1 hour ago',
    unread: true,
    icon: 'checkmark-circle',
    iconColor: '#22C55E',
  },
  {
    id: '3',
    title: 'Jamie R. says thank you',
    body: 'Thank you so much! This means the world to me',
    timeAgo: '3 hours ago',
    unread: false,
    icon: 'chatbubble',
    iconColor: '#2E8BEA',
  },
  {
    id: '4',
    title: 'You can make a new request',
    body: 'Your cooldown period has ended. You can now create a new help request',
    timeAgo: 'Yesterday',
    unread: false,
    icon: 'time',
    iconColor: '#F59E0B',
  },
  {
    id: '5',
    title: 'Verify to unlock more',
    body: 'Complete the verification to request up to #50,000 and get higher visibility.',
    timeAgo: '2 days ago',
    unread: false,
    icon: 'alert-circle',
    iconColor: '#8B5CF6',
  },
  {
    id: '6',
    title: 'Welcome to Plz',
    body: "We're glad to have you. Start by exploring request or creating your first one",
    timeAgo: '1 week ago',
    unread: false,
    icon: 'gift',
    iconColor: '#38BDF8',
  },
];
