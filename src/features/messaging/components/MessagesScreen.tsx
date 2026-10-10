import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ChatConversation } from '../../../types/chat';
import { Property, Inquiry, UserRole } from '../../../types';
import { mockConversations } from '../../../mock/chatData';
import { InboxScreen } from './InboxScreen';
import { DirectChatScreen } from './DirectChatScreen';

interface MessagesScreenProps {
  userRole?: UserRole;
  initialInquiry?: Inquiry | null;
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
  onExitChat?: () => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  userRole = 'customer',
  initialInquiry,
  properties = [],
  onSelectProperty,
  onExitChat,
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  // If initialInquiry is provided (e.g. builder clicking message icon from InquiriesScreen)
  useEffect(() => {
    if (initialInquiry) {
      // Find matching conversation by name or inquiry property
      const matched = conversations.find(
        (c) =>
          c.name.toLowerCase() === initialInquiry.customerName.toLowerCase() ||
          c.property.title.toLowerCase().includes(initialInquiry.propertyTitle.toLowerCase().split(' ')[0])
      );

      if (matched) {
        setSelectedConversation(matched);
      } else {
        // Create an active conversation for this inquiry
        const newConv: ChatConversation = {
          id: `conv_${initialInquiry.id}`,
          name: initialInquiry.customerName,
          role: 'Buyer',
          avatar:
            initialInquiry.customerAvatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          isOnline: true,
          time: 'Just now',
          lastMessage: initialInquiry.message,
          property: {
            id: initialInquiry.propertyId,
            title: initialInquiry.propertyTitle,
            location: initialInquiry.propertyLocation || 'Sector 62, Noida',
            price: `₹${(initialInquiry.propertyRent || 32000).toLocaleString('en-IN')} / month`,
            image:
              initialInquiry.propertyImage ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
          },
          messages: [
            {
              id: `init_${Date.now()}`,
              sender: 'other',
              type: 'text',
              text: initialInquiry.message,
              time: 'Just now',
            },
          ],
        };
        setConversations((prev) => [newConv, ...prev]);
        setSelectedConversation(newConv);
      }
    }
  }, [initialInquiry]);

  if (selectedConversation) {
    return (
      <DirectChatScreen
        conversation={selectedConversation}
        properties={properties}
        onSelectProperty={onSelectProperty}
        onBack={() => {
          setSelectedConversation(null);
          if (onExitChat && initialInquiry) {
            onExitChat();
          }
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <InboxScreen
        conversations={conversations}
        userRole={userRole}
        onSelectConversation={(conv) => setSelectedConversation(conv)}
      />
    </View>
  );
};
