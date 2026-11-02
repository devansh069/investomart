import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Settings,
  LogOut,
  UserCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';

import { User, Property } from '../../../types';

interface ProfileScreenProps {
  currentUser: User;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  propertiesCount: number;
  inquiriesCount: number;
  listingCapacity?: number;
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (propertyId: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
  propertiesCount,
  inquiriesCount,
  listingCapacity = 10,
  properties = [],
  onSelectProperty,
  favoriteIds = [],
  onToggleFavorite,
}) => {
  const isBroker = currentUser.role === 'builder';

  // If customer view, render clean customer profile
  if (!isBroker) {
    return (
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View className="px-5 pt-4 pb-3 flex-row items-center justify-between border-b border-slate-100 bg-white">
          <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
            <UserCircle size={20} color="#0f172a" />
          </View>
          <Text className="text-base font-bold text-slate-900">My Profile</Text>
          <TouchableOpacity
            onPress={onOpenAuth}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <Settings size={18} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Cover Photo */}
        <View className="relative w-full h-36 bg-slate-900">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute -bottom-9 left-5 w-[74px] h-[74px] rounded-full bg-slate-950 border-4 border-white items-center justify-center shadow-md">
            <UserCircle size={36} color="#ffffff" />
          </View>
        </View>

        {/* User Info */}
        <View className="px-5 pt-12">
          <Text className="text-2xl font-bold text-slate-900">{currentUser.name}</Text>
          <Text className="text-sm text-slate-500 mt-0.5">{currentUser.email}</Text>
          <Text className="text-xs text-slate-400 mt-1">{currentUser.phone}</Text>
        </View>

        {/* Stats Row */}
        <View className="mx-5 mt-5 flex-row border-y border-slate-100 py-4">
          <View className="flex-1 items-center">
            <Text className="text-base font-black text-slate-900">{propertiesCount}</Text>
            <Text className="text-[11px] text-slate-500 mt-0.5">Saved Homes</Text>
          </View>
          <View className="h-8 w-px bg-slate-200 self-center" />
          <View className="flex-1 items-center">
            <Text className="text-base font-black text-slate-900">{inquiriesCount}</Text>
            <Text className="text-[11px] text-slate-500 mt-0.5">Inquiries</Text>
          </View>
          <View className="h-8 w-px bg-slate-200 self-center" />
          <View className="flex-1 items-center">
            <Text className="text-base font-black text-emerald-600">Verified</Text>
            <Text className="text-[11px] text-slate-500 mt-0.5">Account Status</Text>
          </View>
        </View>

        {/* Settings Links */}
        <View className="mx-5 mt-6 rounded-2xl overflow-hidden border border-slate-200 bg-white">
          <TouchableOpacity
            onPress={onOpenAuth}
            className="p-4 flex-row items-center justify-between border-b border-slate-100"
          >
            <Text className="text-sm font-semibold text-slate-800">Account & Profile Settings</Text>
            <ChevronRight size={17} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Help & Support', 'Contact support@investomart.com for help.')}
            className="p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <HelpCircle size={17} color="#0f172a" />
              <Text className="ml-2.5 text-sm font-semibold text-slate-800">Help & Support</Text>
            </View>
            <ChevronRight size={17} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View className="px-5 mt-6 mb-8 space-y-3">
          <TouchableOpacity
            onPress={onOpenAdmin}
            activeOpacity={0.85}
            className="w-full border border-slate-300 bg-white py-3.5 rounded-full flex-row items-center justify-center mt-2.5"
          >
            <Settings size={16} color="#0f172a" />
            <Text className="ml-2 text-sm font-bold text-slate-900">Admin Panel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert('Sign out', 'Sign out of this demo session?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign out', style: 'destructive', onPress: onLogout },
              ])
            }
            activeOpacity={0.8}
            className="w-full border border-red-200 bg-red-50 py-3.5 rounded-full flex-row items-center justify-center mt-2.5"
          >
            <LogOut size={16} color="#dc2626" />
            <Text className="ml-2 text-sm font-bold text-red-600">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const activeProperties = properties.filter((property) => property.status === 'ACTIVE').length;
  const deactivatedProperties = properties.filter((property) => property.status === 'PAUSED' || property.status === 'ARCHIVED').length;
  const pendingProperties = properties.filter((property) => property.status === 'PENDING' || property.status === 'REJECTED').length;

  // Provider profile deliberately uses live app state instead of the
  // decorative public-builder data used elsewhere in the older UI.
  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* 1. Header Bar */}
      <View className="px-5 py-3 flex-row items-center justify-between border-b border-slate-100 bg-white">
        <View className="w-9 h-9" />

        <Text className="text-base font-bold text-slate-900 tracking-tight">Builder Profile</Text>

        <TouchableOpacity
          onPress={onOpenAuth}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
        >
          <Settings size={18} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <View className="mx-5 mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Text className="text-sm font-bold text-slate-900">Account details</Text>
        <Text className="mt-2 text-sm font-semibold text-slate-900">{currentUser.name}</Text>
        <Text className="mt-0.5 text-xs text-slate-600">{currentUser.email || 'Email not added'}</Text>
        <Text className="mt-0.5 text-xs text-slate-600">{currentUser.phone}</Text>
        <Text className="mt-2 text-[11px] font-bold uppercase tracking-wide text-emerald-700">{currentUser.providerType || 'provider'} account</Text>
      </View>

      <View className="mx-5 mt-3 flex-row rounded-2xl border border-slate-200 bg-white py-3">
        <View className="flex-1 items-center">
          <Text className="text-base font-black text-slate-900">{propertiesCount}</Text>
          <Text className="mt-0.5 text-[10px] text-slate-500">Total properties</Text>
        </View>
        <View className="w-px bg-slate-200" />
        <View className="flex-1 items-center">
          <Text className="text-base font-black text-emerald-600">{activeProperties}</Text>
          <Text className="mt-0.5 text-[10px] text-slate-500">Live</Text>
        </View>
        <View className="w-px bg-slate-200" />
        <View className="flex-1 items-center">
          <Text className="text-base font-black text-amber-600">{deactivatedProperties}</Text>
          <Text className="mt-0.5 text-[10px] text-slate-500">Deactivated</Text>
        </View>
        <View className="w-px bg-slate-200" />
        <View className="flex-1 items-center">
          <Text className="text-base font-black text-slate-900">{inquiriesCount}</Text>
          <Text className="mt-0.5 text-[10px] text-slate-500">Enquiries</Text>
        </View>
      </View>

      <View className="mx-5 mt-3 rounded-2xl bg-slate-950 p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-bold text-white">Free listing plan</Text>
            <Text className="mt-1 text-xs text-slate-300">{activeProperties} of {listingCapacity} live slots used</Text>
            {pendingProperties > 0 && <Text className="mt-1 text-[11px] font-semibold text-amber-300">{pendingProperties} awaiting admin approval</Text>}
          </View>
          <View className="rounded-full bg-white/10 px-3 py-1.5">
            <Text className="text-[10px] font-bold text-amber-300">PAYMENT SOON</Text>
          </View>
        </View>
        <Text className="mt-3 text-[11px] leading-4 text-slate-400">Premium upgrades are currently in testing. Payment is not collected from this app yet.</Text>
      </View>

      <View className="mx-5 mt-5">
        <Text className="text-sm font-bold text-slate-900">My properties</Text>
        {properties.length === 0 ? (
          <Text className="mt-2 text-xs text-slate-500">You have not listed a property yet.</Text>
        ) : properties.slice(0, 5).map((property) => (
          <TouchableOpacity
            key={property.id}
            disabled={!onSelectProperty}
            onPress={() => onSelectProperty?.(property)}
            className="mt-2 rounded-xl border border-slate-200 bg-white p-3"
          >
            <View className="flex-row items-center justify-between">
              <Text className="mr-3 flex-1 text-xs font-bold text-slate-900" numberOfLines={1}>{property.title}</Text>
              <Text className="text-[10px] font-bold text-slate-500">{property.status}</Text>
            </View>
            <Text className="mt-1 text-[11px] text-slate-500" numberOfLines={1}>{property.location || property.city}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mx-5 mt-6 mb-8 space-y-3">
        <TouchableOpacity
          onPress={onOpenAdmin}
          activeOpacity={0.85}
          className="w-full border border-slate-300 bg-white py-3.5 rounded-full flex-row items-center justify-center"
        >
          <Settings size={16} color="#0f172a" />
          <Text className="ml-2 text-sm font-bold text-slate-900">Admin Panel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert('Sign out', 'Sign out of this session?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign out', style: 'destructive', onPress: onLogout },
            ])
          }
          activeOpacity={0.8}
          className="w-full border border-red-200 bg-red-50 py-3.5 rounded-full flex-row items-center justify-center mt-2.5"
        >
          <LogOut size={16} color="#dc2626" />
          <Text className="ml-2 text-sm font-bold text-red-600">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
