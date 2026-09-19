import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { mockGovtResources } from '../mock/data';
import { Landmark, ExternalLink, ShieldCheck, FileText, Calculator } from 'lucide-react-native';

export const GovtResourcesScreen: React.FC = () => {
  const handleOpenLink = (title: string, url: string) => {
    Alert.alert(
      'Open Official Portal',
      `You are navigating to an external government / legal portal:\n\n${title}\n(${url})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Link', onPress: () => Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open link in browser.')) },
      ]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'RERA':
        return <Landmark size={20} color="#2563eb" />;
      case 'Stamp Duty':
        return <Calculator size={20} color="#059669" />;
      case 'Tenancy Act':
        return <FileText size={20} color="#d97706" />;
      default:
        return <ShieldCheck size={20} color="#4f46e5" />;
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 pt-3" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-4">
        <Text className="text-xl font-black text-slate-900">Government & Legal Resources</Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Verified external portals for RERA compliance, rental laws & stamp duty verification
        </Text>
      </View>

      {/* Official Notice Card */}
      <View className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
        <View className="flex-row items-center mb-1">
          <ShieldCheck size={16} color="#2563eb" />
          <Text className="text-xs font-bold text-blue-900 ml-1.5">Official External Links</Text>
        </View>
        <Text className="text-[11px] text-blue-800 leading-relaxed">
          These links connect directly to state and central government portals. Always verify builder registration numbers and registered lease deed formats before signing agreements.
        </Text>
      </View>

      {/* List of Resources */}
      {mockGovtResources.map((res) => (
        <TouchableOpacity
          key={res.id}
          activeOpacity={0.85}
          onPress={() => handleOpenLink(res.title, res.url)}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 mb-3.5 shadow-xs"
        >
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center mr-3">
                {getCategoryIcon(res.category)}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-slate-900 leading-tight">
                  {res.title}
                </Text>
                <Text className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {res.subtitle}
                </Text>
              </View>
            </View>

            <View className="bg-slate-100 px-2 py-0.5 rounded-md">
              <Text className="text-[10px] font-bold text-slate-600">{res.badge}</Text>
            </View>
          </View>

          <Text className="text-xs text-slate-600 leading-normal mb-3">
            {res.description}
          </Text>

          <View className="flex-row items-center justify-between pt-2.5 border-t border-slate-100">
            <Text className="text-[11px] text-slate-400 font-medium">{res.authority}</Text>
            <View className="flex-row items-center">
              <Text className="text-xs font-bold text-blue-600 mr-1">Visit Portal</Text>
              <ExternalLink size={12} color="#2563eb" />
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View className="h-10" />
    </ScrollView>
  );
};
