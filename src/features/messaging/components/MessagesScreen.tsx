import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowUp, Building2, CheckCheck, MessageCircle } from 'lucide-react-native';

type Message = { id: string; text: string; sentByUser: boolean; time: string };

const starterMessages: Message[] = [
  { id: '1', text: 'Hi, I am interested in the Luxury 3 BHK Skyline View Apartment. Is it still available?', sentByUser: true, time: '10:24 AM' },
  { id: '2', text: 'Hello! Yes, it is available. We can arrange a visit this Saturday.', sentByUser: false, time: '10:26 AM' },
];

export const MessagesScreen: React.FC = () => {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(starterMessages);
  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: String(Date.now()), text, sentByUser: true, time: 'Now' }]);
    setDraft('');
  };

  return <View className="flex-1 bg-slate-50">
    <View className="bg-white px-5 pt-4 pb-3 border-b border-slate-100 flex-row items-center">
      <View className="w-10 h-10 rounded-2xl bg-slate-950 items-center justify-center"><Building2 size={19} color="#ffffff" /></View>
      <View className="ml-3 flex-1"><Text className="text-sm font-extrabold text-slate-950">Oberoi Green Homes</Text><Text className="text-[11px] text-emerald-600 font-semibold">Online - replies within an hour</Text></View>
      <CheckCheck size={18} color="#059669" />
    </View>
    <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
      <View className="self-center bg-slate-200 px-3 py-1 rounded-full mb-5"><Text className="text-[10px] font-bold text-slate-500">TODAY</Text></View>
      <View className="bg-white border border-slate-200 rounded-2xl p-3 mb-5"><Text className="text-[10px] font-bold text-slate-400 uppercase">Regarding</Text><Text className="text-xs font-bold text-slate-800 mt-1">Luxury 3 BHK Skyline View Apartment</Text><Text className="text-xs text-slate-500 mt-0.5">Indiranagar 100ft Road, Bangalore</Text></View>
      {messages.map((message) => <View key={message.id} className={`mb-3 max-w-[82%] ${message.sentByUser ? 'self-end' : 'self-start'}`}><View className={`px-3.5 py-3 rounded-2xl ${message.sentByUser ? 'bg-slate-950 rounded-br-sm' : 'bg-white border border-slate-200 rounded-bl-sm'}`}><Text className={`text-sm leading-5 ${message.sentByUser ? 'text-white' : 'text-slate-700'}`}>{message.text}</Text></View><Text className={`text-[10px] text-slate-400 mt-1 ${message.sentByUser ? 'text-right' : 'text-left'}`}>{message.time}</Text></View>)}
    </ScrollView>
    <View className="bg-white px-5 py-3 border-t border-slate-100 flex-row items-center"><View className="flex-1 bg-slate-100 rounded-2xl px-3"><TextInput value={draft} onChangeText={setDraft} placeholder="Write a message..." placeholderTextColor="#94a3b8" className="text-sm text-slate-900 py-3" onSubmitEditing={sendMessage} /></View><TouchableOpacity onPress={sendMessage} className="ml-2 w-11 h-11 rounded-2xl bg-slate-950 items-center justify-center" accessibilityLabel="Send message"><ArrowUp size={20} color="#ffffff" /></TouchableOpacity></View>
  </View>;
};
