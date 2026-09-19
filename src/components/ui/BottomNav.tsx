import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, Compass, PieChart, User } from 'lucide-react-native';

export type TabKey = 'home' | 'markets' | 'portfolio' | 'profile';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { key: 'home' as TabKey, label: 'Home', icon: Home },
    { key: 'markets' as TabKey, label: 'Markets', icon: Compass },
    { key: 'portfolio' as TabKey, label: 'Portfolio', icon: PieChart },
    { key: 'profile' as TabKey, label: 'Profile', icon: User },
  ];

  return (
    <View className="flex-row justify-around items-center py-3 px-2 bg-slate-950/95 border-t border-slate-800/80">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => onSelectTab(tab.key)}
            className="items-center py-1 px-4"
          >
            <View className={`p-1.5 rounded-xl ${isActive ? 'bg-emerald-500/15' : 'bg-transparent'}`}>
              <IconComponent
                size={22}
                color={isActive ? '#10b981' : '#64748b'}
              />
            </View>
            <Text
              className={`text-[11px] font-medium mt-1 ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-500'
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
