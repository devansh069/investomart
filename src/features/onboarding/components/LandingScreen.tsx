import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Home,
} from 'lucide-react-native';

const landingBg = require('../../../../assets/landing-villa.jpg');

interface LandingScreenProps {
  onGetStarted: () => void;
  onExploreGuest?: () => void;
  onSkip?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGetStarted,
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44);
  const bottomInset = Math.max(insets.bottom, 20);

  return (
    <View className="flex-1 bg-white relative">
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* 1. Full-screen Architectural Villa Photo Background */}
      <Image
        source={landingBg}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />

      {/* 2. Main Screen UI Layout */}
      <View className="flex-1 justify-between" style={{ paddingTop: topInset }}>
        {/* Upper Area: Brand Bar & Hero Text directly over photo sky */}
        <View>
          {/* Top Header Bar: Brand Logo & Name */}
          <View className="px-6 py-2 flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-emerald-500 items-center justify-center shadow-xs">
              <Home size={22} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View className="ml-2.5">
              <View className="flex-row items-center">
                <Text className="text-xl font-extrabold text-slate-900 tracking-tight">Investor</Text>
                <Text className="text-xl font-extrabold text-emerald-600 tracking-tight">Mart</Text>
              </View>
              <Text className="text-[9px] font-semibold text-slate-500 tracking-wider">
                Buy • Rent • Invest • Grow
              </Text>
            </View>
          </View>

          {/* Main Headline & Description */}
          <View className="px-6 pt-5">
            <Text className="text-3xl font-black text-slate-950 leading-[38px] tracking-tight">
              Find Your{'\n'}
              Perfect Property{'\n'}
              with <Text className="text-emerald-600 font-black">InvestorMart</Text>
            </Text>

            <Text className="text-xs text-slate-600 leading-relaxed font-normal mt-3 max-w-[90%]">
              Buy, rent or invest in verified properties. Connect with trusted brokers and make smarter real estate decisions.
            </Text>

            {/* 3 Feature Highlight Badges Row */}
            <View className="flex-row items-center justify-between mt-5">
              {/* Badge 1: Verified Properties */}
              <View className="items-center flex-1">
                <View className="w-12 h-12 rounded-2xl bg-emerald-50/90 border border-emerald-100 items-center justify-center mb-1.5 shadow-2xs">
                  <ShieldCheck size={22} color="#10b981" />
                </View>
                <Text className="text-[11px] font-bold text-slate-800 text-center leading-tight">
                  Verified{'\n'}Properties
                </Text>
              </View>

              {/* Badge 2: Trusted Brokers */}
              <View className="items-center flex-1">
                <View className="w-12 h-12 rounded-2xl bg-emerald-50/90 border border-emerald-100 items-center justify-center mb-1.5 shadow-2xs">
                  <UserCheck size={22} color="#10b981" />
                </View>
                <Text className="text-[11px] font-bold text-slate-800 text-center leading-tight">
                  Trusted{'\n'}Brokers
                </Text>
              </View>

              {/* Badge 3: Great Investments */}
              <View className="items-center flex-1">
                <View className="w-12 h-12 rounded-2xl bg-emerald-50/90 border border-emerald-100 items-center justify-center mb-1.5 shadow-2xs">
                  <TrendingUp size={22} color="#10b981" />
                </View>
                <Text className="text-[11px] font-bold text-slate-800 text-center leading-tight">
                  Great{'\n'}Investments
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lower Area: Bottom White Card Div with Get Started Button */}
        <View
          className="px-6 pt-5 bg-white rounded-t-[32px] shadow-2xl"
          style={{ paddingBottom: bottomInset }}
        >
          {/* Get Started Primary Dark Pill Button */}
          <TouchableOpacity
            onPress={onGetStarted}
            activeOpacity={0.88}
            className="w-full bg-slate-950 py-4 rounded-full flex-row items-center justify-center shadow-lg active:opacity-90"
          >
            <Text className="text-base font-bold text-white mr-2">Get Started</Text>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
