import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Bath, BedDouble, Heart, MapPin, Maximize, ShieldCheck } from 'lucide-react-native';

import { Property } from '../../../types';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  variant?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress, onFavoriteToggle, isFavorite = false, variant = 'grid' }) => {
  const specs = <View className="flex-row items-center mt-2"><View className="flex-row items-center mr-3"><BedDouble size={13} color="#111827" /><Text className="ml-1 text-[11px] text-slate-600">{property.bhk}</Text></View><View className="flex-row items-center mr-3"><Bath size={13} color="#111827" /><Text className="ml-1 text-[11px] text-slate-600">2</Text></View><View className="flex-row items-center"><Maximize size={12} color="#111827" /><Text className="ml-1 text-[11px] text-slate-600">{property.areaSqft.toLocaleString('en-IN')} sq.ft</Text></View></View>;

  if (variant === 'list') return <TouchableOpacity activeOpacity={0.9} onPress={onPress} className="flex-row bg-white rounded-2xl border border-slate-100 p-2 mb-3 shadow-xs">
    <View className="relative"><Image source={{ uri: property.imageUrl }} className="w-36 h-32 rounded-xl bg-slate-100" resizeMode="cover" /><View className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-full"><Text className="text-[10px] font-bold text-slate-950">For Rent</Text></View></View>
    <View className="flex-1 px-3 py-1"><View className="flex-row"><Text className="flex-1 text-sm font-bold leading-5 text-slate-950" numberOfLines={2}>{property.title.replace('Skyline View ', '')}</Text><TouchableOpacity onPress={onFavoriteToggle} className="ml-1"><Heart size={20} color={isFavorite ? '#ef4444' : '#111827'} fill={isFavorite ? '#ef4444' : 'none'} /></TouchableOpacity></View><View className="flex-row items-center mt-1"><MapPin size={13} color="#111827" fill="#111827" /><Text className="ml-1 text-[11px] text-slate-500" numberOfLines={1}>{property.location}, {property.city}</Text></View><Text className="text-lg font-black text-slate-950 mt-2">₹{property.rent.toLocaleString('en-IN')}<Text className="text-xs font-medium text-slate-500"> /month</Text></Text>{specs}<View className="flex-row mt-2"><View className="bg-slate-100 rounded-full px-2 py-1"><Text className="text-[9px] font-semibold text-slate-600">{property.furnishing}</Text></View>{property.builderVerified && <View className="ml-1.5 bg-emerald-50 rounded-full px-2 py-1 flex-row items-center"><ShieldCheck size={10} color="#16a34a" /><Text className="ml-1 text-[9px] font-semibold text-emerald-700">Verified</Text></View>}</View></View>
  </TouchableOpacity>;

  return <TouchableOpacity activeOpacity={0.9} onPress={onPress} className="w-56 mr-3 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-xs">
    <View className="relative"><Image source={{ uri: property.imageUrl }} className="w-full h-32 bg-slate-100" resizeMode="cover" /><View className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-full"><Text className="text-[10px] font-bold text-slate-950">For Rent</Text></View><TouchableOpacity onPress={onFavoriteToggle} className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center"><Heart size={17} color={isFavorite ? '#ef4444' : '#111827'} fill={isFavorite ? '#ef4444' : 'none'} /></TouchableOpacity></View>
    <View className="p-3"><Text className="text-sm font-bold text-slate-950" numberOfLines={1}>{property.title.replace('Skyline View ', '')}</Text><View className="flex-row items-center mt-1"><MapPin size={12} color="#111827" fill="#111827" /><Text className="ml-1 text-[11px] text-slate-500" numberOfLines={1}>{property.location}, {property.city}</Text></View><Text className="text-base font-black text-slate-950 mt-2">₹{property.rent.toLocaleString('en-IN')}<Text className="text-xs font-medium text-slate-500"> /month</Text></Text>{specs}</View>
  </TouchableOpacity>;
};
