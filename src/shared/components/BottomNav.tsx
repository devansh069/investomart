import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserRole } from '../../types';
import { Compass, Landmark, User, Building, MessageSquare, Heart, Home } from 'lucide-react-native';

export type CustomerTabKey = 'home' | 'explore' | 'favorites' | 'messages' | 'profile';
export type BuilderTabKey = 'home' | 'listings' | 'inquiries' | 'resources' | 'profile';

interface BottomNavProps {
  role: UserRole;
  activeCustomerTab: CustomerTabKey;
  activeBuilderTab: BuilderTabKey;
  onSelectCustomerTab: (tab: CustomerTabKey) => void;
  onSelectBuilderTab: (tab: BuilderTabKey) => void;
  inquiriesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  activeCustomerTab,
  activeBuilderTab,
  onSelectCustomerTab,
  onSelectBuilderTab,
  inquiriesCount,
}) => {
  const isCustomer = role === 'customer';

  const customerTabs = [
    { key: 'home' as CustomerTabKey, label: 'Home', icon: Home },
    { key: 'explore' as CustomerTabKey, label: 'Explore', icon: Compass },
    { key: 'favorites' as CustomerTabKey, label: 'Saved', icon: Heart },
    { key: 'messages' as CustomerTabKey, label: 'Messages', icon: MessageSquare },
    { key: 'profile' as CustomerTabKey, label: 'Profile', icon: User },
  ];

  const builderTabs = [
    { key: 'home' as BuilderTabKey, label: 'Home', icon: Home },
    { key: 'listings' as BuilderTabKey, label: 'Properties', icon: Building },
    { key: 'inquiries' as BuilderTabKey, label: 'Inquiries', icon: MessageSquare, badge: inquiriesCount },
    { key: 'resources' as BuilderTabKey, label: 'Resources', icon: Landmark },
    { key: 'profile' as BuilderTabKey, label: 'Profile', icon: User },
  ];

  return (
    <View className="flex-row justify-around items-center py-2.5 px-2 bg-white border-t border-slate-100 shadow-lg">
      {isCustomer
        ? customerTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCustomerTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => onSelectCustomerTab(tab.key)}
                className="items-center py-1 px-3"
              >
                <View className={`p-1.5 rounded-xl ${isActive ? 'bg-slate-100' : 'bg-transparent'}`}>
                  <Icon size={20} color={isActive ? '#111827' : '#94a3b8'} />
                </View>
                <Text
                  className={`text-[10px] font-semibold mt-0.5 ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })
        : builderTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeBuilderTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => onSelectBuilderTab(tab.key)}
                className="items-center py-1 px-3 relative"
              >
                <View className={`p-1.5 rounded-xl ${isActive ? 'bg-slate-100' : 'bg-transparent'}`}>
                  <Icon size={20} color={isActive ? '#111827' : '#94a3b8'} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                      <Text className="text-[9px] font-black text-white">{tab.badge}</Text>
                    </View>
                  )}
                </View>
                <Text
                  className={`text-[10px] font-semibold mt-0.5 ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
    </View>
  );
};
