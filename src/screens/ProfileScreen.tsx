import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { mockUser } from '../mock/data';
import { ShieldCheck, Server, Moon, Lock, ChevronRight, HelpCircle, LogOut } from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const handleItemPress = (name: string) => {
    Alert.alert(name, 'Prototype setting. Configurable when backend/authentication is hooked up.');
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 px-5 pt-3" showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text className="text-white font-extrabold text-2xl tracking-tight mb-4">
        Account & Settings
      </Text>

      {/* Profile Overview Card */}
      <View className="p-5 rounded-3xl bg-slate-900 border border-slate-800 items-center mb-5">
        <View className="w-20 h-20 rounded-full bg-emerald-600/20 border-2 border-emerald-500/40 items-center justify-center mb-3">
          <Text className="text-emerald-400 font-extrabold text-3xl">
            {mockUser.name.charAt(0)}
          </Text>
        </View>

        <Text className="text-white font-bold text-lg">{mockUser.name}</Text>
        <Text className="text-slate-400 text-xs mt-0.5">{mockUser.email}</Text>

        <View className="flex-row items-center mt-3 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <ShieldCheck size={14} color="#34d399" />
          <Text className="text-emerald-400 text-xs font-semibold ml-1.5">
            Level 3 KYC Verified
          </Text>
        </View>
      </View>

      {/* Backend Status Notice */}
      <View className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex-row items-center mb-5">
        <Server size={20} color="#38bdf8" />
        <View className="ml-3 flex-1">
          <Text className="text-blue-300 font-semibold text-xs">Prototype Mode</Text>
          <Text className="text-slate-400 text-[11px] mt-0.5">
            Running offline on mock data stores. Ready for Node/FastAPI/Firebase backend integration.
          </Text>
        </View>
      </View>

      {/* Settings Options */}
      <View className="rounded-2xl bg-slate-900/60 border border-slate-800/60 overflow-hidden mb-6">
        <TouchableOpacity
          onPress={() => handleItemPress('Security & Biometrics')}
          className="flex-row items-center justify-between p-4 border-b border-slate-800/50"
        >
          <View className="flex-row items-center">
            <Lock size={18} color="#94a3b8" />
            <Text className="text-white font-medium text-sm ml-3">Security & Biometrics</Text>
          </View>
          <ChevronRight size={16} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleItemPress('Theme & Display')}
          className="flex-row items-center justify-between p-4 border-b border-slate-800/50"
        >
          <View className="flex-row items-center">
            <Moon size={18} color="#94a3b8" />
            <Text className="text-white font-medium text-sm ml-3">Theme & Display</Text>
          </View>
          <ChevronRight size={16} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleItemPress('Help & Support')}
          className="flex-row items-center justify-between p-4"
        >
          <View className="flex-row items-center">
            <HelpCircle size={18} color="#94a3b8" />
            <Text className="text-white font-medium text-sm ml-3">Help & Support</Text>
          </View>
          <ChevronRight size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => Alert.alert('Logout', 'Logging out of prototype session')}
        className="flex-row items-center justify-center p-4 rounded-2xl bg-red-950/20 border border-red-900/30 mb-8"
      >
        <LogOut size={16} color="#f87171" />
        <Text className="text-red-400 font-semibold text-sm ml-2">Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
