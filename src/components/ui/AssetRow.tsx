import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Asset } from '../../types';

interface AssetRowProps {
  asset: Asset;
  onPress?: () => void;
}

export const AssetRow: React.FC<AssetRowProps> = ({ asset, onPress }) => {
  const isPositive = asset.change24h >= 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 px-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 mb-2.5"
    >
      {/* Asset Logo & Names */}
      <View className="flex-row items-center flex-1">
        <View
          style={{ backgroundColor: `${asset.color}20`, borderColor: `${asset.color}50` }}
          className="w-10 h-10 rounded-xl border items-center justify-center mr-3"
        >
          <Text style={{ color: asset.color }} className="font-bold text-xs tracking-wider">
            {asset.symbol.slice(0, 3)}
          </Text>
        </View>
        <View className="flex-1 mr-2">
          <Text className="text-white font-semibold text-sm leading-tight" numberOfLines={1}>
            {asset.name}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Text className="text-slate-400 text-xs uppercase font-medium">{asset.symbol}</Text>
            <View className="w-1 h-1 rounded-full bg-slate-600 mx-1.5" />
            <Text className="text-slate-500 text-[11px] capitalize">{asset.category.replace('_', ' ')}</Text>
          </View>
        </View>
      </View>

      {/* Price & 24h Change */}
      <View className="items-end">
        <Text className="text-white font-bold text-sm">
          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
        <View className="flex-row items-center mt-0.5">
          {isPositive ? (
            <TrendingUp size={11} color="#10b981" />
          ) : (
            <TrendingDown size={11} color="#ef4444" />
          )}
          <Text
            className={`text-xs font-semibold ml-1 ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {asset.change24h.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
