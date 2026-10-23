import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Property, Inquiry } from '../../../types';
import { Plus, Eye, CheckCircle2, MessageSquare, Trash2, BedDouble, MapPin, Crown } from 'lucide-react-native';

interface BuilderDashboardProps {
  properties: Property[];
  inquiries: Inquiry[];
  onOpenAddModal: () => void;
  onSelectProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onToggleStatus: (id: string) => void;
  builderName: string;
}

export const BuilderDashboard: React.FC<BuilderDashboardProps> = ({
  properties,
  inquiries,
  onOpenAddModal,
  onSelectProperty,
  onDeleteProperty,
  onToggleStatus,
  builderName,
}) => {
  const totalListings = properties.length;
  const activeListings = properties.filter((p) => p.status === 'ACTIVE').length;
  const pausedListings = properties.filter((p) => p.status === 'PAUSED' || p.status === 'EXPIRED' || p.status === 'SUBSCRIPTION_PAUSED').length;
  const totalInquiries = inquiries.length;
  const freeListingLimit = 10;
  const remainingFreeSlots = Math.max(0, freeListingLimit - activeListings);

  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 pt-3" showsVerticalScrollIndicator={false}>
      {/* Top Banner / Greeting */}
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xl font-black text-slate-900">Builder Dashboard</Text>
          <Text className="text-xs text-slate-500">{builderName}</Text>
        </View>

        <TouchableOpacity
          onPress={onOpenAddModal}
          activeOpacity={0.85}
          className="bg-slate-950 px-3.5 py-2 rounded-xl flex-row items-center"
        >
          <Plus size={15} color="#ffffff" />
          <Text className="text-white text-xs font-bold ml-1">Add Property</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Stats Cards */}
      <View className="flex-row space-x-3 mb-5">
        <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs mr-2">
          <Text className="text-[11px] font-medium text-slate-500">Total Listed</Text>
          <Text className="text-2xl font-black text-slate-900 mt-1">{totalListings}</Text>
          <Text className="text-[10px] text-emerald-600 font-semibold mt-0.5">{activeListings} Active</Text>
        </View>

        <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs mr-2">
          <Text className="text-[11px] font-medium text-slate-500">Inquiries</Text>
          <Text className="text-2xl font-black text-slate-950 mt-1">{totalInquiries}</Text>
          <Text className="text-[10px] text-slate-600 font-semibold mt-0.5">Leads to follow up</Text>
        </View>

        <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <Text className="text-[11px] font-medium text-slate-500">Occupancy</Text>
          <Text className="text-2xl font-black text-emerald-600 mt-1">
            {totalListings > 0 ? Math.round(((totalListings - activeListings) / totalListings) * 100) : 0}%
          </Text>
          <Text className="text-[10px] text-slate-500 font-semibold mt-0.5">Rented units</Text>
        </View>
      </View>

      <View className="bg-slate-950 rounded-3xl p-4 mb-5 overflow-hidden">
        <View className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-amber-400/20" />
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center"><Crown size={15} color="#fbbf24" /><Text className="ml-1.5 text-xs font-bold text-amber-300">FREE LISTING PLAN</Text></View>
            <Text className="text-white text-lg font-black mt-1">{activeListings} / {freeListingLimit} active listings</Text>
            <Text className="text-slate-300 text-xs mt-1">{remainingFreeSlots} slots left. Upgrade to Pro for 20 more at ₹500/month.</Text>
          </View>
          <View className="bg-white/10 rounded-2xl px-3 py-2"><Text className="text-white text-xs font-bold">Pro</Text><Text className="text-amber-300 text-[10px] font-semibold">+20 slots</Text></View>
        </View>
        {pausedListings > 0 && <Text className="mt-3 text-[11px] font-semibold text-amber-200">{pausedListings} listing{pausedListings === 1 ? '' : 's'} paused or expired - continue them when capacity is available.</Text>}
      </View>

      {/* Property Listings Management Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Your Property Listings ({properties.length})
        </Text>
      </View>

      {/* List of properties */}
      {properties.map((prop) => (
        <View
          key={prop.id}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 mb-3.5 shadow-xs"
        >
          <View className="flex-row">
            <Image
              source={{ uri: prop.imageUrl }}
              className="w-24 h-24 rounded-xl bg-slate-100"
              resizeMode="cover"
            />
            <View className="ml-3 flex-1 justify-between">
              <View>
                <View className="flex-row justify-between items-start">
                  <Text className="text-sm font-bold text-slate-900 flex-1 mr-1 leading-snug" numberOfLines={1}>
                    {prop.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onToggleStatus(prop.id)}
                    className={`px-2 py-0.5 rounded-md ${
                      prop.status === 'ACTIVE' ? 'bg-emerald-50 border border-emerald-200' : prop.status === 'RENTED' ? 'bg-slate-100' : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <Text
                      className={`text-[9px] font-black uppercase ${
                        prop.status === 'ACTIVE' ? 'text-emerald-700' : prop.status === 'RENTED' ? 'text-slate-600' : 'text-amber-700'
                      }`}
                    >
                      {prop.status}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center mt-1">
                  <MapPin size={11} color="#64748b" />
                  <Text className="text-xs text-slate-500 ml-1" numberOfLines={1}>
                    {prop.location}, {prop.city}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <BedDouble size={11} color="#64748b" />
                  <Text className="text-xs text-slate-500 ml-1">
                    {prop.bhk} BHK • {prop.areaSqft} sqft
                  </Text>
                </View>
              </View>

              <Text className="text-sm font-black text-slate-900 mt-1">
                ₹{prop.rent.toLocaleString('en-IN')}<Text className="text-xs font-normal text-slate-500">/mo</Text>
              </Text>
            </View>
          </View>

          {/* Action Row */}
          <View className="flex-row justify-between items-center pt-3 mt-3 border-t border-slate-100">
            <TouchableOpacity
              onPress={() => onSelectProperty(prop)}
              className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200"
            >
              <Eye size={13} color="#2563eb" />
              <Text className="text-xs font-semibold text-slate-700 ml-1.5">View as Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Mark Status',
                  `Switch status of "${prop.title}" to ${prop.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Change', onPress: () => onToggleStatus(prop.id) },
                  ]
                );
              }}
              className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200"
            >
              <CheckCircle2 size={13} color="#059669" />
              <Text className="text-xs font-semibold text-slate-700 ml-1.5">
                Toggle Status
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert('Delete Property', `Remove "${prop.title}" from your listings?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => onDeleteProperty(prop.id) },
                ]);
              }}
              className="p-1.5 rounded-xl bg-red-50 border border-red-100"
            >
              <Trash2 size={15} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View className="h-10" />
    </ScrollView>
  );
};
