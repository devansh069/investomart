import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react-native';

const villaBg = require('../../../../assets/landing-villa.jpg');

interface OtpLoginScreenProps {
  onLoginSuccess: (phone: string) => void;
  onOpenRoleSelection?: () => void;
  onBack?: () => void;
}

export const OtpLoginScreen: React.FC<OtpLoginScreenProps> = ({
  onLoginSuccess,
  onOpenRoleSelection,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44);
  const bottomInset = Math.max(insets.bottom, 14);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);

  const handleSendOtp = () => {
    if (phoneNumber.trim().length < 10) {
      Alert.alert('Phone Number Required', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    onLoginSuccess(phoneNumber || '+91 98765 43210');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-slate-900"
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* 1. UPPER HERO SECTION WITH VILLA PHOTO */}
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
        touchSoundDisabled={true}
      >
        <View className="flex-1 relative bg-slate-900">
          {/* Full Villa Photo Background */}
          <Image
            source={villaBg}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />

          {/* Top Header & Welcome Text directly overlaid on natural sky (No white box) */}
          <View
            className="absolute inset-x-0 top-0 px-6"
            style={{ paddingTop: topInset + 2 }}
          >
            {/* Brand Header Row */}
            <View className="flex-row items-center justify-between mb-2.5">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-2xl bg-emerald-500 items-center justify-center shadow-xs">
                  <Home size={20} color="#ffffff" strokeWidth={2.5} />
                </View>
                <View className="ml-2.5">
                  <View className="flex-row items-center">
                    <Text className="text-lg font-black text-slate-900 tracking-tight">Investor</Text>
                    <Text className="text-lg font-black text-emerald-600 tracking-tight">Mart</Text>
                  </View>
                  <Text className="text-[8px] font-semibold text-slate-500 tracking-wider">
                    Buy • Rent • Invest • Grow
                  </Text>
                </View>
              </View>

              {onBack && (
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    onBack();
                  }}
                  activeOpacity={0.7}
                  className="w-8 h-8 rounded-full bg-white/90 items-center justify-center border border-slate-200/60 shadow-xs"
                >
                  <ArrowLeft size={16} color="#0f172a" />
                </TouchableOpacity>
              )}
            </View>

            {/* Welcome Heading directly over photo */}
            <Text className="text-2xl font-black text-slate-950 tracking-tight">
              {isSignUpMode ? 'Join InvestorMart!' : 'Welcome Back!'}
            </Text>
            <Text className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed max-w-[85%]">
              {isSignUpMode
                ? 'Create your account to start your smart real estate journey.'
                : 'Login to continue your real estate journey with InvestorMart.'}
            </Text>
          </View>

          {/* Overlay Text on Middle Villa Image */}
          <View className="absolute bottom-5 left-6 right-6">
            <Text className="text-2xl font-black text-white leading-tight drop-shadow-md">
              Discover{'\n'}Better{'\n'}Properties
            </Text>
            <Text className="text-xs text-white/90 font-medium mt-1 leading-snug drop-shadow-sm">
              Homes. Commercial Spaces.{'\n'}Verified Builders. All in one app.
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* 2. BOTTOM COMPACT WHITE CARD SHEET */}
      <View
        className="bg-white rounded-t-[32px] shadow-2xl px-6 pt-4"
        style={{ paddingBottom: bottomInset }}
      >
        {!isOtpSent ? (
          <>
            {/* Header inside Bottom Sheet */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View>
                <Text className="text-base font-black text-slate-900 tracking-tight">
                  {isSignUpMode ? 'Sign Up with Phone Number' : 'Login with Phone Number'}
                </Text>
                <Text className="text-[11px] text-slate-400 font-normal mt-0.5">
                  We'll send you a One Time Password (OTP)
                </Text>

                {/* Input Label */}
                <Text className="text-[11px] font-semibold text-slate-700 mt-2.5 mb-1">
                  Phone Number
                </Text>
              </View>
            </TouchableWithoutFeedback>

            {/* Phone Input Box with Flag & +91 */}
            <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-2xs">
              {/* Indian Flag & +91 */}
              <View className="flex-row items-center mr-2">
                <Text className="text-base mr-1.5">🇮🇳</Text>
                <Text className="text-sm font-bold text-slate-900">+91</Text>
                <ChevronDown size={14} color="#64748b" className="ml-1" />
              </View>

              {/* Vertical Divider */}
              <View className="h-5 w-px bg-slate-200 mx-2" />

              {/* Text Input */}
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                maxLength={10}
                className="flex-1 text-sm font-bold text-slate-900 py-0.5"
              />
            </View>

            {/* Send OTP Primary Button */}
            <TouchableOpacity
              onPress={handleSendOtp}
              activeOpacity={0.88}
              className="w-full bg-slate-950 py-3.5 rounded-full flex-row items-center justify-center shadow-md active:opacity-90 mt-3"
            >
              <Text className="text-sm font-bold text-white mr-2">
                {isSignUpMode ? 'Register & Send OTP' : 'Send OTP'}
              </Text>
              <ArrowRight size={16} color="#ffffff" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* OTP Input State */}
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-black text-slate-900 tracking-tight">
                  Enter Verification Code
                </Text>
                <Text className="text-xs text-slate-400 font-normal mt-0.5">
                  Sent to +91 {phoneNumber}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsOtpSent(false)}>
                <Text className="text-xs font-bold text-emerald-600 underline">Change</Text>
              </TouchableOpacity>
            </View>

            {/* 4-digit OTP Boxes */}
            <View className="flex-row justify-between my-3">
              {[0, 1, 2, 3].map((idx) => (
                <TextInput
                  key={idx}
                  value={otpCode[idx]}
                  onChangeText={(val) => {
                    const next = [...otpCode];
                    next[idx] = val;
                    setOtpCode(next);
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  className="w-13 h-13 border border-slate-200 rounded-2xl text-center text-lg font-black text-slate-900 bg-slate-50"
                />
              ))}
            </View>

            {/* Verify & Continue Button */}
            <TouchableOpacity
              onPress={handleVerifyOtp}
              activeOpacity={0.88}
              className="w-full bg-slate-950 py-3.5 rounded-full flex-row items-center justify-center shadow-md active:opacity-90"
            >
              <Text className="text-sm font-bold text-white mr-2">Verify & Continue</Text>
              <CheckCircle2 size={16} color="#ffffff" />
            </TouchableOpacity>
          </>
        )}

        {/* Divider with "OR" */}
        <View className="flex-row items-center my-2.5">
          <View className="flex-1 h-px bg-slate-200" />
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">
            OR
          </Text>
          <View className="flex-1 h-px bg-slate-200" />
        </View>

        {/* Don't have an account? Sign up (enlarged font size) */}
        <View className="flex-row items-center justify-center my-2">
          <Text className="text-sm font-semibold text-slate-700">
            {isSignUpMode ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (!isSignUpMode && onOpenRoleSelection) {
                onOpenRoleSelection();
              } else {
                setIsSignUpMode(!isSignUpMode);
              }
            }}
            activeOpacity={0.7}
          >
            <Text className="text-sm font-black text-emerald-600 underline ml-0.5">
              {isSignUpMode ? 'Log in' : 'Sign up'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3 Compact Feature Badges Row */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-row items-center justify-between space-x-2">
            {/* Badge 1: Verified Properties */}
            <View className="flex-1 bg-emerald-50/70 border border-emerald-100/70 rounded-2xl p-2 items-center mr-1 shadow-2xs">
              <ShieldCheck size={18} color="#10b981" />
              <Text className="text-[10px] font-bold text-slate-800 text-center leading-tight mt-1">
                Verified{'\n'}Properties
              </Text>
            </View>

            {/* Badge 2: Trusted Brokers */}
            <View className="flex-1 bg-emerald-50/70 border border-emerald-100/70 rounded-2xl p-2 items-center mx-1 shadow-2xs">
              <Building2 size={18} color="#10b981" />
              <Text className="text-[10px] font-bold text-slate-800 text-center leading-tight mt-1">
                Trusted{'\n'}Brokers
              </Text>
            </View>

            {/* Badge 3: Better Investments */}
            <View className="flex-1 bg-emerald-50/70 border border-emerald-100/70 rounded-2xl p-2 items-center ml-1 shadow-2xs">
              <TrendingUp size={18} color="#10b981" />
              <Text className="text-[10px] font-bold text-slate-800 text-center leading-tight mt-1">
                Better{'\n'}Investments
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Terms & Conditions Footer */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="mt-2.5 items-center">
            <Text className="text-[9px] text-slate-400 text-center leading-relaxed">
              By continuing, you agree to our{' '}
              <Text className="text-emerald-600 font-semibold underline">Terms & Conditions</Text>
              {' '}and{' '}
              <Text className="text-emerald-600 font-semibold underline">Privacy Policy</Text>.
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};
