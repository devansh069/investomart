import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Property } from '../types';
import { MapPin, Video, BedDouble, Maximize, ShieldCheck, Heart } from 'lucide-react-native';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  onFavoriteToggle,
  isFavorite = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4"
    >
      {/* Property Image Container */}
      <View className="relative w-full h-48 bg-slate-100">
        <Image
          source={{ uri: property.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Video Available Badge */}
        {property.hasVideo && (
          <View className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex-row items-center">
            <Video size={12} color="#ffffff" />
            <Text className="text-[11px] font-bold text-white ml-1">Video Tour</Text>
          </View>
        )}

        {/* Favorite Heart Button */}
        <TouchableOpacity
          onPress={onFavoriteToggle}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 items-center justify-center shadow-xs"
        >
          <Heart size={16} color={isFavorite ? '#ef4444' : '#64748b'} fill={isFavorite ? '#ef4444' : 'none'} />
        </TouchableOpacity>

        {/* Rent Tag */}
        <View className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs flex-row items-baseline">
          <Text className="text-slate-900 font-extrabold text-base">
            ₹{property.rent.toLocaleString('en-IN')}
          </Text>
          <Text className="text-slate-500 text-xs font-semibold ml-0.5">/month</Text>
        </View>

        {/* Status Badge */}
        <View className="absolute bottom-3 right-3 bg-emerald-600 px-2.5 py-1 rounded-lg">
          <Text className="text-white text-[10px] font-bold tracking-wider uppercase">
            {property.status}
          </Text>
        </View>
      </View>

      {/* Details Container */}
      <View className="p-4">
        {/* Title */}
        <Text className="text-slate-900 font-bold text-base leading-tight mb-1.5" numberOfLines={1}>
          {property.title}
        </Text>

        {/* Location Row */}
        <View className="flex-row items-center mb-3">
          <MapPin size={13} color="#2563eb" />
          <Text className="text-slate-500 text-xs ml-1 flex-1" numberOfLines={1}>
            {property.location}, {property.city}
          </Text>
        </View>

        {/* Highlights Pills */}
        <View className="flex-row items-center justify-between pt-3 border-t border-slate-100">
          <View className="flex-row items-center bg-slate-50 px-2.5 py-1 rounded-lg">
            <BedDouble size={14} color="#475569" />
            <Text className="text-slate-700 font-semibold text-xs ml-1.5">
              {property.bhk} BHK
            </Text>
          </View>

          <View className="flex-row items-center bg-slate-50 px-2.5 py-1 rounded-lg">
            <Maximize size={13} color="#475569" />
            <Text className="text-slate-700 font-semibold text-xs ml-1.5">
              {property.areaSqft} sq.ft
            </Text>
          </View>

          <View className="flex-row items-center">
            {property.builderVerified && (
              <ShieldCheck size={14} color="#10b981" />
            )}
            <Text className="text-slate-600 text-xs font-medium ml-1" numberOfLines={1}>
              {property.builderName.split(' ')[0]}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
