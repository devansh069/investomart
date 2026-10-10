export type ChatRole = 'Buyer' | 'Tenant' | 'Broker';

export interface ChatProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
}

export type ChatMessageType = 'text' | 'property_card' | 'voice_note';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  type?: ChatMessageType;
  text?: string;
  property?: ChatProperty;
  voiceDuration?: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
  id: string;
  name: string;
  role: ChatRole;
  avatar: string;
  isOnline?: boolean;
  time: string;
  lastMessage: string;
  unreadCount?: number;
  isMuted?: boolean;
  property: ChatProperty;
  messages: ChatMessage[];
}
