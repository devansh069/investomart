import React from 'react';
import { Alert, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FileText, Gavel, Home, Landmark, ReceiptText, Search, ShieldCheck } from 'lucide-react-native';

import { mockGovtResources } from '../../../mock/data';

const resourceStyle = [
  { icon: FileText, tint: '#2563eb', background: 'bg-blue-50' },
  { icon: Home, tint: '#16a34a', background: 'bg-emerald-50' },
  { icon: ShieldCheck, tint: '#e11d48', background: 'bg-rose-50' },
  { icon: ReceiptText, tint: '#d97706', background: 'bg-amber-50' },
  { icon: Landmark, tint: '#7c3aed', background: 'bg-violet-50' },
  { icon: Gavel, tint: '#0f766e', background: 'bg-teal-50' },
];

export const GovtResourcesScreen: React.FC = () => {
  const openLink = (title: string, url: string) => Alert.alert('Open official portal', title, [{ text: 'Cancel', style: 'cancel' }, { text: 'Open portal', onPress: () => Linking.openURL(url) }]);
  return <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
    <View className="px-5 pt-4 pb-3 flex-row items-center justify-between"><View className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center"><Landmark size={20} color="#111827" /></View><Text className="text-lg font-bold text-slate-950">Government Resources</Text><View className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center"><ShieldCheck size={19} color="#111827" /></View></View>
    <View className="mx-5 mt-2 bg-blue-50 rounded-3xl px-5 py-6 overflow-hidden"><View className="absolute -right-5 -top-4 w-32 h-32 rounded-full bg-blue-200/50" /><Landmark size={28} color="#1e3a8a" /><Text className="text-xl font-black text-slate-900 mt-4">Government Resources</Text><Text className="text-sm text-slate-600 mt-1 max-w-[75%]">Everything you need for hassle-free property rental & compliance.</Text></View>
    <View className="px-5 mt-4"><View className="flex-row bg-white rounded-2xl border border-slate-200 px-3 items-center"><Search size={18} color="#111827" /><TextInput placeholder="Search by service, document or department..." placeholderTextColor="#94a3b8" className="flex-1 py-3 text-sm text-slate-900 ml-2" /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3"><View className="bg-slate-950 px-4 py-2 rounded-xl mr-2"><Text className="text-xs font-bold text-white">All</Text></View>{['Documents', 'Registration', 'Taxes', 'Policies'].map((item) => <View key={item} className="bg-slate-100 px-4 py-2 rounded-xl mr-2"><Text className="text-xs font-semibold text-slate-600">{item}</Text></View>)}</ScrollView></View>
    <View className="px-5 mt-4 flex-row flex-wrap justify-between">{mockGovtResources.concat(mockGovtResources.slice(0, 2)).map((resource, index) => { const style = resourceStyle[index]; const Icon = style.icon; return <TouchableOpacity key={`${resource.id}-${index}`} onPress={() => openLink(resource.title, resource.url)} className={`${style.background} w-[48%] rounded-2xl p-3.5 mb-3 min-h-[150px]`}><View className="w-9 h-9 rounded-xl bg-white/70 items-center justify-center"><Icon size={20} color={style.tint} /></View><Text className="text-sm font-bold text-slate-950 mt-3" numberOfLines={2}>{index === 0 ? 'Rental Agreement Template' : resource.title}</Text><Text className="text-[11px] leading-4 text-slate-500 mt-1" numberOfLines={3}>{resource.description}</Text><Text className="text-lg font-bold mt-1" style={{ color: style.tint }}>→</Text></TouchableOpacity>; })}</View>
    <View className="mx-5 mb-8 bg-slate-100 rounded-2xl p-4 flex-row items-center"><ShieldCheck size={23} color="#111827" /><View className="ml-3 flex-1"><Text className="text-sm font-bold text-slate-900">Need help?</Text><Text className="text-[11px] text-slate-500">Visit the official portal or contact your local authorities.</Text></View></View>
  </ScrollView>;
};
