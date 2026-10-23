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
  ArrowLeft,
  Settings,
  ArrowLeftRight,
  LogOut,
  UserCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';

import { User, Property } from '../../../types';
import { BuilderProfileView } from '../../broker/components/BuilderProfileView';

interface ProfileScreenProps {
  currentUser: User;
  onToggleRole: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  propertiesCount: number;
  inquiriesCount: number;
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (propertyId: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onToggleRole,
  onOpenAuth,
  onLogout,
  propertiesCount,
  inquiriesCount,
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
            onPress={onToggleRole}
            activeOpacity={0.85}
            className="w-full bg-slate-950 py-3.5 rounded-full flex-row items-center justify-center shadow-xs"
          >
            <ArrowLeftRight size={16} color="#ffffff" />
            <Text className="ml-2 text-sm font-bold text-white">Switch to Builder View</Text>
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

  // Builder Profile matching provided screenshot & reusing BuilderProfileView
  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* 1. Header Bar */}
      <View className="px-5 py-3 flex-row items-center justify-between border-b border-slate-100 bg-white">
        <TouchableOpacity
          onPress={onToggleRole}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
        >
          <ArrowLeft size={18} color="#0f172a" />
        </TouchableOpacity>

        <Text className="text-base font-bold text-slate-900 tracking-tight">Builder Profile</Text>

        <TouchableOpacity
          onPress={onOpenAuth}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
        >
          <Settings size={18} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Shared Unified Builder Profile Component */}
      <BuilderProfileView
        builderProfile={{
          name: currentUser.companyName || currentUser.name || 'Nexa Homes Pvt. Ltd.',
          email: currentUser.email,
          phone: currentUser.phone,
        }}
        builderProperties={properties}
        onSelectProperty={onSelectProperty}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
        isOwnerView={true}
        bottomActions={
          <View className="pt-4 border-t border-slate-100 mt-2 mb-8 space-y-3">
            <TouchableOpacity
              onPress={onToggleRole}
              activeOpacity={0.85}
              className="w-full bg-slate-950 py-3.5 rounded-full flex-row items-center justify-center shadow-xs"
            >
              <ArrowLeftRight size={16} color="#ffffff" />
              <Text className="ml-2 text-sm font-bold text-white">Switch to Client View</Text>
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
        }
      />
    </ScrollView>
  );
};
