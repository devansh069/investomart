import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { AssetRow } from '../components/ui/AssetRow';
import { mockAssets } from '../mock/data';
import { AssetCategory } from '../types';

export const MarketsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'mutual_funds', label: 'Funds & ETFs' },
    { key: 'commodities', label: 'Commodities' },
  ];

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View className="flex-1 bg-slate-950 px-5 pt-3">
      {/* Title */}
      <Text className="text-white font-extrabold text-2xl tracking-tight mb-3">
        Explore Markets
      </Text>

      {/* Search Bar */}
      <View className="flex-row items-center bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 mb-4">
        <Search size={18} color="#64748b" />
        <TextInput
          placeholder="Search stocks, crypto, ETFs..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 text-white text-sm ml-2.5"
        />
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <SlidersHorizontal size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-11 mb-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(cat.key as any)}
              className={`px-4 py-2 rounded-xl mr-2.5 border ${
                isActive
                  ? 'bg-emerald-500/15 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Asset List */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              onPress={() => Alert.alert(asset.name, `Price: $${asset.price}\nMarket Cap: ${asset.marketCap}`)}
            />
          ))
        ) : (
          <View className="py-12 items-center justify-center">
            <Text className="text-slate-500 text-sm">No assets found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
