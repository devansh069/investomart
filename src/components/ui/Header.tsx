import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, ShieldCheck } from 'lucide-react-native';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onNotificationPress }) => {
  return (
    <View className="flex-row items-center justify-between px-6 pt-4 pb-3 bg-slate-950">
      <View className="flex-row items-center space-x-3">
        {/* Avatar circle */}
        <View className="w-11 h-11 rounded-full bg-emerald-600/20 border border-emerald-500/40 items-center justify-center">
          <Text className="text-emerald-400 font-bold text-base">
            {user.name.charAt(0)}
          </Text>
        </View>

        <View className="ml-3">
          <View className="flex-row items-center">
            <Text className="text-white text-base font-semibold tracking-tight">
              {user.name}
            </Text>
            {user.kycVerified && (
              <View className="ml-1.5 flex-row items-center bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded-full">
                <ShieldCheck size={10} color="#34d399" />
                <Text className="text-[10px] text-emerald-400 ml-0.5 font-medium">Verified</Text>
              </View>
            )}
          </View>
          <Text className="text-slate-400 text-xs">{user.tag}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onNotificationPress}
        activeOpacity={0.7}
        className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 items-center justify-center relative"
      >
        <Bell size={18} color="#94a3b8" />
        <View className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute top-2 right-2 border-2 border-slate-950" />
      </TouchableOpacity>
    </View>
  );
};
