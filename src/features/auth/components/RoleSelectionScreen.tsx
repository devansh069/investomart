import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  Users,
  TrendingUp,
} from 'lucide-react-native';

const userHouseImg = require('../../../../assets/user-role-house.jpg');
const brokerBuildingImg = require('../../../../assets/broker-role-building.jpg');

interface RoleSelectionScreenProps {
  onSelectRole: (role: 'customer' | 'builder') => void;
  onBack: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44);
  const bottomInset = Math.max(insets.bottom, 16);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: topInset + 6,
          paddingBottom: bottomInset + 16,
          paddingHorizontal: 20,
        }}
      >
        {/* 1. TOP HEADER ROW */}
        <View className="flex-row items-center justify-between mb-6">
          {/* Back Button */}
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center border border-slate-200/80 shadow-2xs"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={18} color="#1e293b" />
          </TouchableOpacity>

          {/* InvestorMart Logo & Slogan */}
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-2xl bg-emerald-500 items-center justify-center shadow-xs mr-2">
              <Home size={20} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View>
              <View className="flex-row items-center">
                <Text className="text-xl font-black text-slate-900 tracking-tight">Investor</Text>
                <Text className="text-xl font-black text-emerald-600 tracking-tight">Mart</Text>
              </View>
              <Text className="text-[9px] font-semibold text-slate-500 tracking-wider">
                Buy • Rent • Invest • Grow
              </Text>
            </View>
          </View>

          {/* Placeholder for header symmetry */}
          <View className="w-10" />
        </View>

        {/* 2. HEADING SECTION */}
        <View className="mt-2 mb-6">
          <Text className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
            Choose What{'\n'}Matters to You
          </Text>
          <Text className="text-xs text-slate-500 font-normal mt-2 leading-relaxed max-w-[90%]">
            Whether you want to find a home or connect with clients, InvestorMart is built for you.
          </Text>
        </View>

        {/* 3. SIDE-BY-SIDE ROLE CARDS */}
        <View className="flex-row space-x-3.5 mb-8">
          {/* USER CARD (LEFT) */}
          <TouchableOpacity
            onPress={() => onSelectRole('customer')}
            activeOpacity={0.92}
            className="flex-1 bg-[#edf8f3] border border-emerald-200/60 rounded-[28px] p-3.5 flex-col justify-between shadow-xs"
          >
            <View>
              {/* Home Icon Container */}
              <View className="w-11 h-11 rounded-full bg-white items-center justify-center mb-3 border border-emerald-100 shadow-2xs">
                <Home size={22} color="#10b981" strokeWidth={2.2} />
              </View>

              {/* House Photo */}
              <View className="w-full h-44 rounded-2xl overflow-hidden mb-3.5 shadow-2xs">
                <Image
                  source={userHouseImg}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Title & Description */}
              <Text className="text-lg font-black text-slate-900 tracking-tight mb-1">
                User
              </Text>
              <Text className="text-[11px] text-slate-600 leading-snug font-normal">
                Find, rent or invest in residential and commercial properties.
              </Text>
            </View>

            {/* Circular Arrow Button */}
            <View className="mt-4 flex-row justify-start">
              <View className="w-9 h-9 rounded-full bg-emerald-100/80 items-center justify-center border border-emerald-200/50">
                <ArrowRight size={18} color="#059669" strokeWidth={2.5} />
              </View>
            </View>
          </TouchableOpacity>

          {/* BROKER CARD (RIGHT) */}
          <TouchableOpacity
            onPress={() => onSelectRole('builder')}
            activeOpacity={0.92}
            className="flex-1 bg-[#fdf6ee] border border-amber-200/60 rounded-[28px] p-3.5 flex-col justify-between shadow-xs ml-3.5"
          >
            <View>
              {/* Briefcase Icon Container */}
              <View className="w-11 h-11 rounded-full bg-white items-center justify-center mb-3 border border-amber-100 shadow-2xs">
                <Briefcase size={22} color="#b45309" strokeWidth={2.2} />
              </View>

              {/* Building Photo */}
              <View className="w-full h-44 rounded-2xl overflow-hidden mb-3.5 shadow-2xs">
                <Image
                  source={brokerBuildingImg}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Title & Description */}
              <Text className="text-lg font-black text-slate-900 tracking-tight mb-1">
                Broker
              </Text>
              <Text className="text-[11px] text-slate-600 leading-snug font-normal">
                List properties, connect with clients and grow your business.
              </Text>
            </View>

            {/* Circular Arrow Button */}
            <View className="mt-4 flex-row justify-start">
              <View className="w-9 h-9 rounded-full bg-amber-100/80 items-center justify-center border border-amber-200/50">
                <ArrowRight size={18} color="#b45309" strokeWidth={2.5} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. WHY CHOOSE INVESTORMART SECTION */}
        <View className="mt-2 mb-2">
          {/* Divider line with text */}
          <View className="flex-row items-center justify-center mb-6">
            <View className="flex-1 h-px bg-slate-200" />
            <Text className="text-xs font-semibold text-slate-500 px-3">
              Why Choose InvestorMart?
            </Text>
            <View className="flex-1 h-px bg-slate-200" />
          </View>

          {/* 3 Feature Columns */}
          <View className="flex-row items-start justify-between px-1">
            {/* Feature 1 */}
            <View className="flex-1 items-center px-1">
              <View className="w-11 h-11 rounded-full bg-emerald-50 items-center justify-center mb-2">
                <ShieldCheck size={22} color="#10b981" strokeWidth={2} />
              </View>
              <Text className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                100% Verified{'\n'}Listings
              </Text>
            </View>

            {/* Feature 2 */}
            <View className="flex-1 items-center px-1">
              <View className="w-11 h-11 rounded-full bg-emerald-50 items-center justify-center mb-2">
                <Users size={22} color="#10b981" strokeWidth={2} />
              </View>
              <Text className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                Trusted Users{'\n'}& Brokers
              </Text>
            </View>

            {/* Feature 3 */}
            <View className="flex-1 items-center px-1">
              <View className="w-11 h-11 rounded-full bg-emerald-50 items-center justify-center mb-2">
                <TrendingUp size={22} color="#10b981" strokeWidth={2} />
              </View>
              <Text className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                Better Investment{'\n'}Opportunities
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
