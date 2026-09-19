import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { User, UserRole } from '../types';
import { mockUsers } from '../mock/data';
import { Building2, UserCircle, X, ShieldCheck, Mail, Lock, Phone } from 'lucide-react-native';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    // Generate prototype user
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name || (selectedRole === 'customer' ? 'Rahul Sharma' : 'Vikramaditya Oberoi'),
      email: email || (selectedRole === 'customer' ? 'customer@investomart.com' : 'builder@investomart.com'),
      phone: phone || '+91 98765 43210',
      role: selectedRole,
      companyName: selectedRole === 'builder' ? 'Oberoi Green Homes' : undefined,
    };
    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    onLoginSuccess(mockUsers[role]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl p-6 max-h-[90%] shadow-2xl border-t border-slate-100">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
            <View>
              <Text className="text-xl font-black text-slate-900 tracking-tight">
                {isSignup ? 'Create Your Account' : 'Welcome to InvestoMart'}
              </Text>
              <Text className="text-xs text-slate-500 mt-0.5">
                Real Estate Listing & Rental Platform
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            >
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="pt-4">
            {/* Role Selection Tabs */}
            <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Role
            </Text>
            <View className="flex-row space-x-3 mb-5">
              <TouchableOpacity
                onPress={() => setSelectedRole('customer')}
                activeOpacity={0.8}
                className={`flex-1 flex-row items-center justify-center py-3 px-3 rounded-2xl border ${
                  selectedRole === 'customer'
                    ? 'bg-blue-50 border-blue-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <UserCircle size={18} color={selectedRole === 'customer' ? '#2563eb' : '#64748b'} />
                <Text
                  className={`text-xs font-bold ml-2 ${
                    selectedRole === 'customer' ? 'text-blue-700' : 'text-slate-600'
                  }`}
                >
                  Customer / Tenant
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedRole('builder')}
                activeOpacity={0.8}
                className={`flex-1 flex-row items-center justify-center py-3 px-3 rounded-2xl border ml-2 ${
                  selectedRole === 'builder'
                    ? 'bg-blue-50 border-blue-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Building2 size={18} color={selectedRole === 'builder' ? '#2563eb' : '#64748b'} />
                <Text
                  className={`text-xs font-bold ml-2 ${
                    selectedRole === 'builder' ? 'text-blue-700' : 'text-slate-600'
                  }`}
                >
                  Builder / Owner
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Demo Shortcuts */}
            <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-5">
              <View className="flex-row items-center mb-2">
                <ShieldCheck size={14} color="#10b981" />
                <Text className="text-xs font-bold text-slate-700 ml-1.5">
                  1-Tap Instant Demo Login
                </Text>
              </View>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => handleQuickDemoLogin('customer')}
                  className="flex-1 bg-white border border-slate-200 py-2 rounded-xl items-center shadow-xs"
                >
                  <Text className="text-xs font-semibold text-slate-800">👤 As Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleQuickDemoLogin('builder')}
                  className="flex-1 bg-white border border-slate-200 py-2 rounded-xl items-center shadow-xs ml-2"
                >
                  <Text className="text-xs font-semibold text-slate-800">🏗️ As Builder</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Fields */}
            {isSignup && (
              <View className="mb-3">
                <Text className="text-xs font-medium text-slate-600 mb-1">Full Name</Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  <UserCircle size={16} color="#94a3b8" />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder={selectedRole === 'customer' ? 'e.g. Rahul Sharma' : 'e.g. Vikramaditya Oberoi'}
                    placeholderTextColor="#94a3b8"
                    className="flex-1 text-slate-900 text-sm ml-2.5"
                  />
                </View>
              </View>
            )}

            <View className="mb-3">
              <Text className="text-xs font-medium text-slate-600 mb-1">Email Address</Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <Mail size={16} color="#94a3b8" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 text-slate-900 text-sm ml-2.5"
                />
              </View>
            </View>

            {isSignup && (
              <View className="mb-3">
                <Text className="text-xs font-medium text-slate-600 mb-1">Phone Number</Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  <Phone size={16} color="#94a3b8" />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    className="flex-1 text-slate-900 text-sm ml-2.5"
                  />
                </View>
              </View>
            )}

            <View className="mb-5">
              <Text className="text-xs font-medium text-slate-600 mb-1">Password</Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <Lock size={16} color="#94a3b8" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry
                  className="flex-1 text-slate-900 text-sm ml-2.5"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              className="bg-blue-600 py-3.5 rounded-2xl items-center shadow-md shadow-blue-500/20 mb-3"
            >
              <Text className="text-white font-bold text-sm">
                {isSignup ? `Register as ${selectedRole === 'customer' ? 'Customer' : 'Builder'}` : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Toggle Signin / Signup */}
            <View className="flex-row justify-center items-center py-2 mb-4">
              <Text className="text-xs text-slate-500">
                {isSignup ? 'Already have an account?' : "Don't have an account yet?"}
              </Text>
              <TouchableOpacity onPress={() => setIsSignup(!isSignup)} className="ml-1.5">
                <Text className="text-xs font-bold text-blue-600">
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
