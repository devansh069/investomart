import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { PortfolioCard } from '../components/ui/PortfolioCard';
import { QuickActions } from '../components/ui/QuickActions';
import { AssetRow } from '../components/ui/AssetRow';
import { mockPortfolio, mockAssets, mockTransactions } from '../mock/data';
import { ArrowRight, Clock } from 'lucide-react-native';

export const HomeScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'trending' | 'top_gainers'>('trending');

  const filteredAssets = selectedFilter === 'top_gainers'
    ? [...mockAssets].sort((a, b) => b.change24h - a.change24h)
    : mockAssets;

  const handleAction = (action: string) => {
    Alert.alert('Prototype Action', `You tapped on "${action}". Connect to your backend or payment gateway here!`);
  };

  return (
    <ScrollView className="flex-1 bg-slate-950" showsVerticalScrollIndicator={false}>
      {/* Portfolio Card */}
      <PortfolioCard portfolio={mockPortfolio} />

      {/* Quick Actions Row */}
      <View className="my-2">
        <QuickActions onAction={handleAction} />
      </View>

      {/* Markets Section */}
      <View className="px-5 mt-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => setSelectedFilter('trending')}
              className={`px-3 py-1.5 rounded-full mr-2 ${
                selectedFilter === 'trending' ? 'bg-slate-800 border border-slate-700' : 'bg-transparent'
              }`}
            >
              <Text className={`text-xs font-semibold ${selectedFilter === 'trending' ? 'text-white' : 'text-slate-500'}`}>
                Trending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFilter('top_gainers')}
              className={`px-3 py-1.5 rounded-full ${
                selectedFilter === 'top_gainers' ? 'bg-slate-800 border border-slate-700' : 'bg-transparent'
              }`}
            >
              <Text className={`text-xs font-semibold ${selectedFilter === 'top_gainers' ? 'text-white' : 'text-slate-500'}`}>
                Top Gainers
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="flex-row items-center">
            <Text className="text-emerald-400 text-xs font-semibold mr-1">See all</Text>
            <ArrowRight size={12} color="#34d399" />
          </TouchableOpacity>
        </View>

        {filteredAssets.slice(0, 4).map((asset) => (
          <AssetRow
            key={asset.id}
            asset={asset}
            onPress={() => Alert.alert(asset.name, `Price: $${asset.price}\n24h Change: ${asset.change24h}%\nMarket Cap: ${asset.marketCap}`)}
          />
        ))}
      </View>

      {/* Recent Activity Section */}
      <View className="px-5 mt-4 mb-8">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white font-bold text-base">Recent Transactions</Text>
          <Clock size={15} color="#64748b" />
        </View>

        {mockTransactions.map((tx) => (
          <View
            key={tx.id}
            className="flex-row justify-between items-center py-3 px-4 rounded-xl bg-slate-900/40 border border-slate-800/40 mb-2"
          >
            <View>
              <Text className="text-white font-semibold text-sm">
                {tx.type} {tx.assetSymbol}
              </Text>
              <Text className="text-slate-500 text-xs mt-0.5">{tx.date}</Text>
            </View>

            <View className="items-end">
              <Text
                className={`font-semibold text-sm ${
                  tx.type === 'BUY' || tx.type === 'WITHDRAWAL' ? 'text-slate-200' : 'text-emerald-400'
                }`}
              >
                {tx.type === 'BUY' || tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toFixed(2)}
              </Text>
              <Text className="text-emerald-500/80 text-[10px] font-medium tracking-wide">
                {tx.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
