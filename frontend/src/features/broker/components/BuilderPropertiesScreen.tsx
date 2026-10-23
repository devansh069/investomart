import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Eye,
  Heart,
  MessageSquare,
  MoreHorizontal,
} from 'lucide-react-native';
import { Property, PropertyStatus } from '../../../types';

interface BuilderPropertiesScreenProps {
  properties: Property[];
  onOpenAddModal: () => void;
  onSelectProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onBack: () => void;
}

type FilterTab = 'all' | 'active' | 'inactive';

export const BuilderPropertiesScreen: React.FC<BuilderPropertiesScreenProps> = ({
  properties,
  onOpenAddModal,
  onSelectProperty,
  onDeleteProperty,
  onToggleStatus,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Filter properties based on selected tab
  const filteredProperties = properties.filter((prop) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return prop.status === 'ACTIVE';
    if (activeTab === 'inactive') return prop.status !== 'ACTIVE';
    return true;
  });

  const activeCount = properties.filter((p) => p.status === 'ACTIVE').length;
  const inactiveCount = properties.filter((p) => p.status !== 'ACTIVE').length;

  const handleActionMenu = (prop: Property) => {
    Alert.alert(
      prop.title,
      'Choose an action for this property',
      [
        {
          text: 'View Details',
          onPress: () => onSelectProperty(prop),
        },
        {
          text: prop.status === 'ACTIVE' ? 'Mark as Inactive' : 'Mark as Active',
          onPress: () => onToggleStatus(prop.id),
        },
        {
          text: 'Delete Listing',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Property',
              'Are you sure you want to delete this listing?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDeleteProperty(prop.id) },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderStatusBadge = (status: PropertyStatus) => {
    if (status === 'ACTIVE') {
      return (
        <View className="bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <Text className="text-[11px] font-bold text-emerald-600">Active</Text>
        </View>
      );
    }
    return (
      <View className="bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
        <Text className="text-[11px] font-bold text-slate-500">Inactive</Text>
      </View>
    );
  };

  const formatPrice = (prop: Property) => {
    if (prop.priceDisplay) return prop.priceDisplay;
    if (prop.rent >= 10000000) {
      return `₹${(prop.rent / 10000000).toFixed(2)} Cr`;
    }
    if (prop.rent >= 100000) {
      return `₹${(prop.rent / 100000).toFixed(2)} Lakh`;
    }
    return `₹${prop.rent.toLocaleString('en-IN')} /month`;
  };

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Top Header */}
      <View className="px-5 pt-3 pb-3 bg-white flex-row items-center justify-between border-b border-slate-100 shadow-xs">
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
        >
          <ArrowLeft size={18} color="#0f172a" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-lg font-bold text-slate-900 tracking-tight">
          My Properties
        </Text>

        {/* Spacer to keep title centered */}
        <View className="w-10" />
      </View>

      {/* Filter Tabs */}
      <View className="bg-white px-5 py-3 border-b border-slate-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full border ${
              activeTab === 'all'
                ? 'bg-slate-950 border-slate-950'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'all' ? 'text-white' : 'text-slate-600'
              }`}
            >
              All ({properties.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-full border ${
              activeTab === 'active'
                ? 'bg-slate-950 border-slate-950'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'active' ? 'text-white' : 'text-slate-600'
              }`}
            >
              Active ({activeCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('inactive')}
            className={`px-4 py-2 rounded-full border ${
              activeTab === 'inactive'
                ? 'bg-slate-950 border-slate-950'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'inactive' ? 'text-white' : 'text-slate-600'
              }`}
            >
              Inactive ({inactiveCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Properties List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredProperties.length === 0 ? (
          <View className="items-center justify-center py-16 px-6">
            <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
              <Plus size={28} color="#94a3b8" />
            </View>
            <Text className="text-base font-bold text-slate-800">No properties found</Text>
            <Text className="text-xs text-slate-500 text-center mt-1">
              Add your first property listing to start reaching prospective tenants and buyers.
            </Text>
            <TouchableOpacity
              onPress={onOpenAddModal}
              className="mt-4 bg-slate-950 px-5 py-2.5 rounded-full"
            >
              <Text className="text-white text-xs font-bold">+ Add Property</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredProperties.map((prop) => (
            <TouchableOpacity
              key={prop.id}
              activeOpacity={0.88}
              onPress={() => onSelectProperty(prop)}
              className="bg-white rounded-2xl p-3 border border-slate-100 mb-3 flex-row shadow-xs"
            >
              {/* Left Image Thumbnail */}
              <View className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 mr-3 relative">
                <Image
                  source={{ uri: prop.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Right Content */}
              <View className="flex-1 justify-between py-0.5">
                {/* Title & Status Badge & Menu */}
                <View className="flex-row items-center justify-between">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-bold text-slate-900 flex-1 mr-2"
                  >
                    {prop.title}
                  </Text>
                  <View className="flex-row items-center gap-1.5">
                    {renderStatusBadge(prop.status)}
                    <TouchableOpacity
                      onPress={() => handleActionMenu(prop)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      className="p-0.5"
                    >
                      <MoreHorizontal size={18} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Location */}
                <View className="flex-row items-center gap-1 mt-0.5">
                  <MapPin size={12} color="#94a3b8" />
                  <Text numberOfLines={1} className="text-xs text-slate-500 font-medium">
                    {prop.location || prop.city}
                  </Text>
                </View>

                {/* Price */}
                <View className="mt-1">
                  <Text className="text-sm font-extrabold text-slate-900">
                    {formatPrice(prop)}
                  </Text>
                </View>

                {/* Metrics: Views, Likes, Inquiries */}
                <View className="flex-row items-center gap-4 mt-1.5 pt-1.5 border-t border-slate-50">
                  <View className="flex-row items-center gap-1">
                    <Eye size={12} color="#64748b" />
                    <Text className="text-[11px] text-slate-500 font-medium">
                      {prop.viewsCount ? (prop.viewsCount >= 1000 ? `${(prop.viewsCount / 1000).toFixed(1)}K` : prop.viewsCount) : '1.2K'}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <Heart size={12} color="#64748b" />
                    <Text className="text-[11px] text-slate-500 font-medium">
                      {prop.likesCount ?? 230}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <MessageSquare size={12} color="#64748b" />
                    <Text className="text-[11px] text-slate-500 font-medium">
                      {prop.inquiriesCount ?? 18}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};
