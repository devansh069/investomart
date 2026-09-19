import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, TrendingUp, ArrowUpRight } from 'lucide-react-native';
import { PortfolioSummary } from '../../types';

interface PortfolioCardProps {
  portfolio: PortfolioSummary;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const formatCurrency = (val: number) => {
    return balanceVisible ? `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••';
  };

  return (
    <View className="mx-5 my-3 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
      {/* Background ambient glow effect */}
      <View className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />
      <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

      {/* Header row */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          Total Net Worth
        </Text>
        <TouchableOpacity
          onPress={() => setBalanceVisible(!balanceVisible)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {balanceVisible ? (
            <Eye size={16} color="#94a3b8" />
          ) : (
            <EyeOff size={16} color="#94a3b8" />
          )}
        </TouchableOpacity>
      </View>

      {/* Main Balance Display */}
      <View className="flex-row items-baseline space-x-2 my-1">
        <Text className="text-white text-3xl font-extrabold tracking-tight">
          {formatCurrency(portfolio.totalBalance)}
        </Text>
      </View>

      {/* P&L Badge */}
      <View className="flex-row items-center mt-2 space-x-2">
        <View className="flex-row items-center bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
          <TrendingUp size={12} color="#10b981" />
          <Text className="text-emerald-400 text-xs font-semibold ml-1.5">
            +${portfolio.todaysReturns.toFixed(2)} ({portfolio.todaysReturnsPercentage}%)
          </Text>
        </View>
        <Text className="text-slate-500 text-xs ml-2">Today</Text>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-slate-800/80 my-4" />

      {/* Sub Stats Row */}
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-slate-400 text-[11px]">Invested Value</Text>
          <Text className="text-slate-200 font-semibold text-sm mt-0.5">
            {formatCurrency(portfolio.investedAmount)}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-slate-400 text-[11px]">All-time Returns</Text>
          <View className="flex-row items-center mt-0.5">
            <ArrowUpRight size={13} color="#34d399" />
            <Text className="text-emerald-400 font-semibold text-sm ml-0.5">
              +${portfolio.totalReturns.toFixed(2)} ({portfolio.totalReturnsPercentage}%)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
