import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { User } from '../types';
import {
  UserCircle,
  Building2,
  ShieldCheck,
  ArrowLeftRight,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';

interface ProfileScreenProps {
  currentUser: User;
  onToggleRole: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  propertiesCount: number;
  inquiriesCount: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onToggleRole,
  onOpenAuth,
  onLogout,
  propertiesCount,
  inquiriesCount,
}) => {
  const isBuilder = currentUser.role === 'builder';

  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 pt-3" showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <View className="bg-white p-5 rounded-3xl border border-slate-200/80 items-center mb-4 shadow-xs">
        <View
          className={`w-18 h-18 rounded-full items-center justify-center mb-3 border-2 ${
            isBuilder ? 'bg-amber-100 border-amber-300' : 'bg-blue-100 border-blue-300'
          }`}
        >
          {isBuilder ? (
            <Building2 size={32} color="#b45309" />
          ) : (
            <UserCircle size={36} color="#2563eb" />
          )}
        </View>

        <Text className="text-xl font-black text-slate-900">{currentUser.name}</Text>
        <Text className="text-xs text-slate-500 mt-0.5">{currentUser.email}</Text>
        <Text className="text-xs text-slate-500">{currentUser.phone}</Text>

        {isBuilder && currentUser.companyName && (
          <View className="mt-2 bg-slate-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-semibold text-slate-700">{currentUser.companyName}</Text>
          </View>
        )}

        <View className="flex-row items-center mt-3 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <ShieldCheck size={14} color="#059669" />
          <Text className="text-xs font-bold text-emerald-800 ml-1.5">
            Verified {isBuilder ? 'Partner Builder' : 'Renter Profile'}
          </Text>
        </View>
      </View>

      {/* Instant Role Switcher Highlight Card */}
      <View className="bg-white p-4 rounded-3xl border border-slate-200/80 mb-4 shadow-xs">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Active Mode
          </Text>
          <View className={`px-2.5 py-0.5 rounded-full ${isBuilder ? 'bg-amber-100' : 'bg-blue-100'}`}>
            <Text className={`text-[11px] font-bold ${isBuilder ? 'text-amber-800' : 'text-blue-700'}`}>
              {isBuilder ? 'BUILDER VIEW' : 'CUSTOMER VIEW'}
            </Text>
          </View>
        </View>

        <Text className="text-xs text-slate-500 leading-relaxed mb-3">
          {isBuilder
            ? 'You are currently managing property listings, editing details, and viewing incoming customer inquiries.'
            : 'You are browsing real estate, searching with filters, contacting builders, and submitting rental applications.'}
        </Text>

        <TouchableOpacity
          onPress={onToggleRole}
          activeOpacity={0.85}
          className={`py-3 rounded-2xl flex-row items-center justify-center border ${
            isBuilder
              ? 'bg-blue-600 border-blue-600 shadow-xs'
              : 'bg-amber-600 border-amber-600 shadow-xs'
          }`}
        >
          <ArrowLeftRight size={15} color="#ffffff" />
          <Text className="text-white font-bold text-xs ml-2">
            Switch to {isBuilder ? 'Customer Mode' : 'Builder Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Summary Metrics */}
      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mr-2">
          <Text className="text-[11px] font-medium text-slate-500">
            {isBuilder ? 'Properties Listed' : 'Active Inquiries'}
          </Text>
          <Text className="text-2xl font-black text-slate-900 mt-1">
            {isBuilder ? propertiesCount : inquiriesCount}
          </Text>
        </View>

        <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <Text className="text-[11px] font-medium text-slate-500">Account Status</Text>
          <Text className="text-2xl font-black text-emerald-600 mt-1">Active</Text>
        </View>
      </View>

      {/* Account Settings */}
      <View className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden mb-5 shadow-xs">
        <TouchableOpacity
          onPress={() => onOpenAuth()}
          className="flex-row items-center justify-between p-4 border-b border-slate-100"
        >
          <View className="flex-row items-center">
            <UserCircle size={18} color="#475569" />
            <Text className="text-sm font-semibold text-slate-800 ml-3">Switch / Change Account</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Prototype Specifications',
              'Real Estate Property Listing & Rental Prototype.\n\n• Dual Role: Builder & Customer\n• Bright Theme UI\n• Inquiries & Mock Payment Gateway integrated\n• RERA & Tenancy Act guides included'
            )
          }
          className="flex-row items-center justify-between p-4 border-b border-slate-100"
        >
          <View className="flex-row items-center">
            <Sparkles size={18} color="#2563eb" />
            <Text className="text-sm font-semibold text-slate-800 ml-3">About InvestoMart Real Estate</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert('Help & Support', 'For support or assistance, reach out at support@investomart.com')
          }
          className="flex-row items-center justify-between p-4"
        >
          <View className="flex-row items-center">
            <HelpCircle size={18} color="#475569" />
            <Text className="text-sm font-semibold text-slate-800 ml-3">Help & Support</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => {
          Alert.alert('Sign Out', 'Sign out of current prototype session?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: onLogout },
          ]);
        }}
        className="flex-row items-center justify-center p-4 rounded-2xl bg-red-50 border border-red-200 mb-8"
      >
        <LogOut size={16} color="#ef4444" />
        <Text className="text-red-600 font-bold text-sm ml-2">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
