import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChatConversation, ChatMessage } from '../../../types/chat';
import { Property } from '../../../types';
import {
  ArrowLeft,
  Phone,
  MoreVertical,
  ChevronRight,
  MapPin,
  ExternalLink,
  Play,
  Pause,
  CheckCheck,
  Paperclip,
  Send,
} from 'lucide-react-native';

interface DirectChatScreenProps {
  conversation: ChatConversation;
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
  onBack: () => void;
}

export const DirectChatScreen: React.FC<DirectChatScreenProps> = ({
  conversation,
  properties = [],
  onSelectProperty,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleCall = () => {
    Alert.alert('Call', `Dial ${conversation.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:+919876543210`).catch(() => {
            Alert.alert('Calling', `Connecting voice call with ${conversation.name}...`);
          });
        },
      },
    ]);
  };

  const handleOpenProperty = () => {
    const matched = properties.find(
      (p) =>
        p.id === conversation.property.id ||
        p.title.toLowerCase().includes(conversation.property.title.toLowerCase().split(' ')[0])
    );
    if (matched && onSelectProperty) {
      onSelectProperty(matched);
    } else {
      Alert.alert(
        conversation.property.title,
        `Location: ${conversation.property.location}\nPrice: ${conversation.property.price}`
      );
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      type: 'text',
      text: inputText.trim(),
      time: timeStr,
      status: 'read',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const waveformHeights = [8, 14, 22, 16, 10, 18, 24, 20, 12, 16, 22, 14, 8, 18, 12];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#FAFAFA]"
    >
      {/* Top Header */}
      <View className="bg-white px-4 pt-3 pb-3 border-b border-slate-100 flex-row items-center justify-between shadow-xs">
        {/* Left: Back button + Avatar + Name & Online status */}
        <View className="flex-row items-center flex-1 mr-2">
          <TouchableOpacity
            onPress={onBack}
            className="w-9 h-9 items-center justify-center -ml-1 rounded-full active:bg-slate-100 mr-1.5"
          >
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>

          <Image
            source={{ uri: conversation.avatar }}
            className="w-10 h-10 rounded-full mr-2.5 border border-slate-200"
          />

          <View className="flex-1 justify-center">
            <Text className="text-[15px] font-bold text-slate-900" numberOfLines={1}>
              {conversation.name}
            </Text>
            <View className="flex-row items-center mt-0.5">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              <Text className="text-xs text-slate-500">Online</Text>
            </View>
          </View>
        </View>

        {/* Right: Phone call & More menu */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleCall}
            className="w-9 h-9 items-center justify-center rounded-full active:bg-slate-100 mr-1"
          >
            <Phone size={19} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert('Options', `${conversation.name}`, [
                { text: 'Mute Notifications' },
                { text: 'Clear Chat', style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
            className="w-9 h-9 items-center justify-center rounded-full active:bg-slate-100"
          >
            <MoreVertical size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pinned Attached Property Card */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleOpenProperty}
        className="bg-white border border-slate-200/80 rounded-2xl px-3 py-2.5 mx-4 mt-2.5 flex-row items-center shadow-xs"
      >
        <Image
          source={{ uri: conversation.property.image }}
          className="w-16 h-13 rounded-xl mr-3"
          resizeMode="cover"
        />

        <View className="flex-1 justify-center">
          <Text className="text-xs font-bold text-slate-900 mb-0.5" numberOfLines={1}>
            {conversation.property.title}
          </Text>
          <View className="flex-row items-center mb-0.5">
            <MapPin size={11} color="#475569" />
            <Text className="text-[11px] text-slate-500 ml-1" numberOfLines={1}>
              {conversation.property.location}
            </Text>
          </View>
          <Text className="text-xs font-black text-slate-900">
            {conversation.property.price}
          </Text>
        </View>

        <View className="w-8 h-8 rounded-full items-center justify-center ml-1">
          <ChevronRight size={18} color="#94A3B8" />
        </View>
      </TouchableOpacity>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Date Divider Chip */}
        <View className="self-center bg-slate-100 rounded-full px-3.5 py-1 my-3">
          <Text className="text-[11px] font-semibold text-slate-500">Today</Text>
        </View>

        {messages.map((msg) => {
          const isMe = msg.sender === 'me';

          // 1. Embedded Property Card
          if (msg.type === 'property_card' && msg.property) {
            return (
              <View key={msg.id} className="mb-3 max-w-[85%] self-end">
                <View className="bg-[#E8F8F0] border border-emerald-100 rounded-2xl rounded-tr-xs p-3 shadow-xs">
                  <Image
                    source={{ uri: msg.property.image }}
                    className="w-full h-32 rounded-xl mb-2"
                    resizeMode="cover"
                  />
                  <Text className="text-xs font-bold text-slate-900 mb-0.5">
                    {msg.property.title}
                  </Text>
                  <View className="flex-row items-center mb-1">
                    <MapPin size={11} color="#475569" />
                    <Text className="text-[11px] text-slate-500 ml-1">
                      {msg.property.location}
                    </Text>
                  </View>
                  <Text className="text-xs font-black text-slate-900 mb-2">
                    {msg.property.price}
                  </Text>

                  <TouchableOpacity
                    onPress={handleOpenProperty}
                    activeOpacity={0.8}
                    className="bg-white border border-emerald-600 rounded-lg py-2 flex-row items-center justify-center shadow-xs"
                  >
                    <Text className="text-xs font-bold text-emerald-700 mr-1.5">
                      View Property
                    </Text>
                    <ExternalLink size={13} color="#047857" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-end mt-1">
                  <Text className="text-[10px] text-slate-400 mr-1">{msg.time}</Text>
                  <CheckCheck size={13} color="#16A34A" />
                </View>
              </View>
            );
          }

          // 2. Audio Voice Note
          if (msg.type === 'voice_note') {
            return (
              <View key={msg.id} className="mb-3 max-w-[80%] self-end">
                <View className="bg-[#E8F8F0] border border-emerald-100 rounded-2xl rounded-tr-xs p-3 shadow-xs">
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-9 h-9 rounded-full bg-[#16A34A] items-center justify-center active:bg-emerald-700 mr-3"
                    >
                      {isPlayingAudio ? (
                        <Pause size={16} color="#FFFFFF" />
                      ) : (
                        <Play size={16} color="#FFFFFF" className="ml-0.5" />
                      )}
                    </TouchableOpacity>

                    {/* Waveform graphic */}
                    <View className="flex-row items-center flex-1 mr-3 h-8">
                      {waveformHeights.map((h, idx) => (
                        <View
                          key={idx}
                          style={{
                            height: h,
                            backgroundColor:
                              isPlayingAudio && idx < 7 ? '#16A34A' : '#4ADE80',
                          }}
                          className="w-1 rounded-full mx-0.5"
                        />
                      ))}
                    </View>

                    <Text className="text-xs font-semibold text-slate-600">
                      {msg.voiceDuration || '0:28'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-end mt-1">
                  <Text className="text-[10px] text-slate-400 mr-1">{msg.time}</Text>
                  <CheckCheck size={13} color="#16A34A" />
                </View>
              </View>
            );
          }

          // 3. Regular Text Message
          if (isMe) {
            return (
              <View key={msg.id} className="mb-3 max-w-[80%] self-end">
                <View className="bg-[#E8F8F0] border border-emerald-100 rounded-2xl rounded-tr-xs p-3 shadow-xs">
                  <Text className="text-xs text-slate-800 leading-relaxed">
                    {msg.text}
                  </Text>
                </View>

                <View className="flex-row items-center justify-end mt-1">
                  <Text className="text-[10px] text-slate-400 mr-1">{msg.time}</Text>
                  <CheckCheck size={13} color="#16A34A" />
                </View>
              </View>
            );
          }

          // Incoming message from other user
          return (
            <View key={msg.id} className="mb-3 max-w-[80%] flex-row items-start self-start">
              <Image
                source={{ uri: conversation.avatar }}
                className="w-7 h-7 rounded-full mr-2 mt-0.5"
              />

              <View>
                <View className="bg-[#F3F4F6] rounded-2xl rounded-tl-xs p-3 shadow-xs">
                  <Text className="text-xs text-slate-800 leading-relaxed">
                    {msg.text}
                  </Text>
                </View>
                <Text className="text-[10px] text-slate-400 mt-1 ml-1">{msg.time}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Message Input Bar */}
      <View className="bg-white px-3 py-2.5 border-t border-slate-100 flex-row items-center">
        {/* Attachment button */}
        <TouchableOpacity
          onPress={() => Alert.alert('Attach', 'Share image, document, or property')}
          className="w-9 h-9 items-center justify-center rounded-full active:bg-slate-100 mr-1.5"
        >
          <Paperclip size={19} color="#475569" />
        </TouchableOpacity>

        {/* Input */}
        <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-1.5 mr-2">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            className="text-xs text-slate-900 py-1"
            onSubmitEditing={handleSendMessage}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSendMessage}
          activeOpacity={0.8}
          className="w-10 h-10 rounded-2xl bg-[#14532D] items-center justify-center active:bg-emerald-900 shadow-xs"
        >
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
