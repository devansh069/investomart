import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { mockAssets, mockPortfolio } from '../mock/data';
import { Briefcase, ArrowUpRight } from 'lucide-react-native';

export const PortfolioScreen: React.FC = () => {
  const heldAssets = mockAssets.filter((a) => (a.holdings ?? 0) > 0);

  return (
    <ScrollView className="flex-1 bg-slate-950 px-5 pt-3" showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text className="text-white font-extrabold text-2xl tracking-tight mb-4">
        Your Portfolio
      </Text>

      {/* Allocation Summary Card */}
      <View className="p-5 rounded-3xl bg-slate-900 border border-slate-800 mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Active Holdings
          </Text>
          <View className="flex-row items-center bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <Briefcase size={12} color="#34d399" />
            <Text className="text-emerald-400 text-xs font-medium ml-1">
              {heldAssets.length} Assets
            </Text>
          </View>
        </View>

        <Text className="text-white text-3xl font-extrabold mb-1">
          ${mockPortfolio.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>

        <View className="flex-row items-center">
          <ArrowUpRight size={14} color="#34d399" />
          <Text className="text-emerald-400 font-semibold text-xs ml-0.5">
            +${mockPortfolio.totalReturns.toFixed(2)} (+{mockPortfolio.totalReturnsPercentage}%) total profit
          </Text>
        </View>

        {/* Portfolio Visual Allocation Bar */}
        <View className="h-2.5 w-full bg-slate-800 rounded-full flex-row overflow-hidden mt-4">
          <View className="h-full bg-amber-500" style={{ width: '46%' }} />
          <View className="h-full bg-sky-500" style={{ width: '21%' }} />
          <View className="h-full bg-emerald-500" style={{ width: '15%' }} />
          <View className="h-full bg-indigo-500" style={{ width: '12%' }} />
          <View className="h-full bg-purple-500" style={{ width: '6%' }} />
        </View>

        {/* Allocation Legend */}
        <View className="flex-row flex-wrap justify-between mt-3">
          <View className="flex-row items-center mr-3 mt-1">
            <View className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
            <Text className="text-slate-400 text-[11px]">Crypto 58%</Text>
          </View>
          <View className="flex-row items-center mr-3 mt-1">
            <View className="w-2 h-2 rounded-full bg-sky-500 mr-1.5" />
            <Text className="text-slate-400 text-[11px]">Stocks 36%</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <View className="w-2 h-2 rounded-full bg-purple-500 mr-1.5" />
            <Text className="text-slate-400 text-[11px]">ETFs 6%</Text>
          </View>
        </View>
      </View>

      {/* Held Assets List */}
      <Text className="text-white font-bold text-base mb-3">Asset Breakdown</Text>

      {heldAssets.map((asset) => (
        <View
          key={asset.id}
          className="flex-row items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 mb-2.5"
        >
          <View className="flex-row items-center">
            <View
              style={{ backgroundColor: `${asset.color}20`, borderColor: `${asset.color}40` }}
              className="w-10 h-10 rounded-xl border items-center justify-center mr-3"
            >
              <Text style={{ color: asset.color }} className="font-bold text-xs">
                {asset.symbol.slice(0, 3)}
              </Text>
            </View>
            <View>
              <Text className="text-white font-semibold text-sm">{asset.name}</Text>
              <Text className="text-slate-400 text-xs mt-0.5">
                {asset.holdings} {asset.symbol}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-white font-bold text-sm">
              ${(asset.value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <Text className="text-slate-400 text-xs mt-0.5">
              @ ${asset.price.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}

      <View className="h-8" />
    </ScrollView>
  );
};
