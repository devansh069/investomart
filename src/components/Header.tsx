import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User } from '../types';
import { Building, ArrowLeftRight, UserCircle } from 'lucide-react-native';

interface HeaderProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onToggleRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onOpenAuth, onToggleRole }) => {
  const isBuilder = currentUser?.role === 'builder';

  return (
    <View className="bg-white px-5 pt-3 pb-2.5 border-b border-slate-100 flex-row items-center justify-between">
      {/* Brand & Logo */}
      <View className="flex-row items-center">
        <View className="w-9 h-9 rounded-xl bg-blue-600 items-center justify-center shadow-xs">
          <Building size={20} color="#ffffff" />
        </View>
        <View className="ml-2.5">
          <View className="flex-row items-center">
            <Text className="text-base font-black text-slate-900 tracking-tight">
              Investo<Text className="text-blue-600">Mart</Text>
            </Text>
          </View>
          <Text className="text-[10px] font-medium text-slate-400 -mt-0.5">Real Estate & Rentals</Text>
        </View>
      </View>

      {/* Role Switcher & Auth Pill */}
      <View className="flex-row items-center space-x-2">
        {/* Dynamic Role Switcher Badge */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleRole}
          className={`flex-row items-center px-2.5 py-1.5 rounded-xl border mr-1.5 ${
            isBuilder
              ? 'bg-amber-50 border-amber-200 shadow-2xs'
              : 'bg-blue-50 border-blue-200 shadow-2xs'
          }`}
        >
          <ArrowLeftRight size={12} color={isBuilder ? '#b45309' : '#2563eb'} />
          <Text
            className={`text-[11px] font-bold ml-1.5 ${
              isBuilder ? 'text-amber-800' : 'text-blue-700'
            }`}
          >
            {isBuilder ? 'Builder Mode' : 'Customer Mode'}
          </Text>
        </TouchableOpacity>

        {/* User Profile / Login Trigger */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenAuth}
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center border border-slate-200"
        >
          <UserCircle size={20} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
