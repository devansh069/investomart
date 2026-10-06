import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftRight, Building2, ChevronRight, Heart, HelpCircle, LogOut, MapPin, ShieldCheck, UserCircle } from 'lucide-react-native';

import { User } from '../../../types';

interface ProfileScreenProps {
  currentUser: User;
  onToggleRole: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  propertiesCount: number;
  inquiriesCount: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, onToggleRole, onOpenAuth, onLogout, propertiesCount, inquiriesCount }) => {
  const isBroker = currentUser.role === 'builder';
  const title = isBroker ? currentUser.companyName || currentUser.name : currentUser.name;

  return <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
    <View className="px-5 pt-4 pb-3 flex-row items-center justify-between border-b border-slate-100"><View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center"><UserCircle size={21} color="#111827" /></View><Text className="text-lg font-bold text-slate-950">{isBroker ? 'Builder Profile' : 'My Profile'}</Text><TouchableOpacity onPress={onOpenAuth} className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center"><ChevronRight size={20} color="#111827" /></TouchableOpacity></View>
    <View className="relative"><Image source={{ uri: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=80' }} className="w-full h-36" resizeMode="cover" /><View className="absolute -bottom-9 left-5 w-[74px] h-[74px] rounded-full bg-slate-950 border-4 border-white items-center justify-center"><Building2 size={32} color="#ffffff" /></View>{isBroker && <View className="absolute right-5 bottom-3 bg-emerald-50 px-3 py-1.5 rounded-full flex-row items-center"><ShieldCheck size={14} color="#16a34a" /><Text className="ml-1 text-xs font-bold text-emerald-700">Verified Builder</Text></View>}</View>
    <View className="px-5 pt-12"><Text className="text-2xl font-black text-slate-950">{title}</Text><Text className="text-sm text-slate-500 mt-0.5">{isBroker ? 'Building Dreams, Creating Futures' : currentUser.email}</Text>{!isBroker && <Text className="text-xs text-slate-500 mt-1">{currentUser.phone}</Text>}</View>
    <View className="mx-5 mt-5 flex-row border-y border-slate-100 py-4">{[[isBroker ? '120+' : String(propertiesCount), isBroker ? 'Projects' : 'Saved homes'], [isBroker ? '8+' : String(inquiriesCount), isBroker ? 'Cities' : 'Inquiries'], [isBroker ? '10K+' : 'Verified', isBroker ? 'Happy Customers' : 'Account status'], [isBroker ? '4.8' : '24/7', isBroker ? 'Rating' : 'Support']].map(([value, label]) => <View key={label} className="flex-1 items-center"><Text className="text-base font-black text-slate-950">{value}</Text><Text className="text-[10px] text-slate-500 text-center mt-0.5">{label}</Text></View>)}</View>
    <View className="px-5 mt-5"><Text className="text-sm text-slate-600 leading-5">{isBroker ? 'A trusted real estate developer focused on quality, innovation and creating spaces that inspire a better tomorrow.' : 'Manage saved properties, rental applications and account preferences from one place.'}</Text><View className="flex-row mt-5"><TouchableOpacity onPress={onToggleRole} className="flex-1 bg-slate-950 py-3.5 rounded-2xl flex-row items-center justify-center"><ArrowLeftRight size={16} color="#ffffff" /><Text className="ml-2 text-sm font-bold text-white">Switch to {isBroker ? 'Client' : 'Broker'} view</Text></TouchableOpacity>{isBroker && <TouchableOpacity onPress={onOpenAuth} className="ml-2 w-14 border border-slate-300 rounded-2xl items-center justify-center"><Building2 size={18} color="#111827" /></TouchableOpacity>}</View></View>
    <View className="mx-5 mt-6 rounded-2xl overflow-hidden border border-slate-200"><TouchableOpacity onPress={onOpenAuth} className="p-4 flex-row items-center justify-between border-b border-slate-100"><Text className="text-sm font-semibold text-slate-800">Account & profile settings</Text><ChevronRight size={17} color="#64748b" /></TouchableOpacity><TouchableOpacity onPress={() => Alert.alert('Government resources', 'Use the Resources tab in Broker view to find official links.')} className="p-4 flex-row items-center justify-between border-b border-slate-100"><View className="flex-row items-center"><MapPin size={17} color="#111827" /><Text className="ml-2 text-sm font-semibold text-slate-800">Government & legal resources</Text></View><ChevronRight size={17} color="#64748b" /></TouchableOpacity><TouchableOpacity onPress={() => Alert.alert('Help & Support', 'Contact support@investomart.com for help.')} className="p-4 flex-row items-center justify-between"><View className="flex-row items-center"><HelpCircle size={17} color="#111827" /><Text className="ml-2 text-sm font-semibold text-slate-800">Help & support</Text></View><ChevronRight size={17} color="#64748b" /></TouchableOpacity></View>
    <TouchableOpacity onPress={() => Alert.alert('Sign out', 'Sign out of this demo session?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign out', style: 'destructive', onPress: onLogout }])} className="mx-5 mt-5 mb-8 py-3.5 border border-red-200 bg-red-50 rounded-2xl flex-row items-center justify-center"><LogOut size={16} color="#dc2626" /><Text className="ml-2 text-sm font-bold text-red-600">Sign out</Text></TouchableOpacity>
  </ScrollView>;
};
