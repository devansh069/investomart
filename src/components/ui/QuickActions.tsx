import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlusCircle, ArrowDownToDot, LineChart, Sparkles } from 'lucide-react-native';

interface QuickActionsProps {
  onAction?: (actionName: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { id: 'deposit', label: 'Deposit', icon: PlusCircle, bg: 'bg-emerald-500/15', color: '#10b981', border: 'border-emerald-500/30' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowDownToDot, bg: 'bg-blue-500/15', color: '#38bdf8', border: 'border-blue-500/30' },
    { id: 'analytics', label: 'Analytics', icon: LineChart, bg: 'bg-purple-500/15', color: '#c084fc', border: 'border-purple-500/30' },
    { id: 'ai_insights', label: 'AI Advisor', icon: Sparkles, bg: 'bg-amber-500/15', color: '#f59e0b', border: 'border-amber-500/30' },
  ];

  return (
    <View className="flex-row justify-between px-6 py-2">
      {actions.map((act) => {
        const IconComponent = act.icon;
        return (
          <TouchableOpacity
            key={act.id}
            activeOpacity={0.7}
            onPress={() => onAction && onAction(act.id)}
            className="items-center"
          >
            <View className={`w-13 h-13 rounded-2xl ${act.bg} border ${act.border} items-center justify-center shadow-sm`}>
              <IconComponent size={22} color={act.color} />
            </View>
            <Text className="text-slate-300 text-xs font-medium mt-2">{act.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
