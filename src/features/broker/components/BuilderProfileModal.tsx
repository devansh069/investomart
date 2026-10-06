import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Share,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Property, BuilderProfile } from '../../../types';
import { PropertyCard } from '../../discovery/components/PropertyCard';
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  Building2,
  MapPin,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Phone,
  Building,
  Mail,
  Globe,
  Clock,
} from 'lucide-react-native';

interface BuilderProfileModalProps {
  visible: boolean;
  onClose: () => void;
  builderProfile: BuilderProfile;
  builderProperties?: Property[];
  onSelectProperty: (property: Property) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (propertyId: string) => void;
  onOpenMessages: () => void;
}

export const BuilderProfileModal: React.FC<BuilderProfileModalProps> = ({
  visible,
  onClose,
  builderProfile,
  builderProperties = [],
  onSelectProperty,
  favoriteIds = [],
  onToggleFavorite,
  onOpenMessages,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Properties' | 'About' | 'Reviews' | 'Contact'>('Properties');
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const handleCall = () => {
    Alert.alert('Call Builder', `Call ${builderProfile.name} at ${builderProfile.phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call Now', onPress: () => Linking.openURL(`tel:${builderProfile.phone}`) },
    ]);
  };

  const handleMessage = () => {
    onClose();
    onOpenMessages();
  };

  const handleWhatsApp = () => {
    const phoneNum = builderProfile.whatsapp || builderProfile.phone;
    const cleanNumber = phoneNum.replace(/[^0-9]/g, '');
    const formatted = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const waUrl = `https://wa.me/${formatted}`;
    Linking.openURL(waUrl).catch(() => {
      Alert.alert('WhatsApp', `Connect with ${builderProfile.name} on WhatsApp at +${formatted}`);
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${builderProfile.email}`).catch(() => {
      Alert.alert('Email', `Send email to ${builderProfile.email}`);
    });
  };

  const handleWebsite = () => {
    const webUrl = builderProfile.websiteUrl || 'https://www.nexa-homes.com';
    Linking.openURL(webUrl).catch(() => {
      Alert.alert('Website', `Opening website: ${webUrl}`);
    });
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44);
  const bottomInset = Math.max(insets.bottom, 12);

  const defaultAbout =
    builderProfile.aboutText ||
    `${builderProfile.name} is a trusted real estate developer known for delivering premium residential and commercial spaces across India. With a focus on quality, innovation and customer satisfaction, we create spaces that inspire a better tomorrow.`;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View
        className="flex-1 bg-white"
        style={{ paddingTop: topInset, paddingBottom: bottomInset }}
      >
        {/* Top Header Navigation Bar */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={18} color="#0f172a" />
          </TouchableOpacity>

          <Text className="text-base font-bold text-slate-900 tracking-tight">Builder Profile</Text>

          <TouchableOpacity
            onPress={() =>
              Share.share({
                message: `Check out ${builderProfile.name} on InvestoMart! Verified Developer.`,
              })
            }
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <Share2 size={16} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Page Body */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Cover Photo Banner with Verified Badge */}
          <View className="relative w-full h-44 bg-slate-900">
            <Image
              source={{
                uri:
                  builderProfile.coverUrl ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/20" />

            {/* Top Right Verified Builder Badge */}
            {builderProfile.verified && (
              <View className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full flex-row items-center shadow-md">
                <CheckCircle2 size={14} color="#10b981" />
                <Text className="text-xs font-bold text-emerald-800 ml-1.5">Verified Builder</Text>
              </View>
            )}
          </View>

          {/* Builder Logo & Name Header */}
          <View className="px-5 pb-4">
            <View className="flex-row items-end justify-between -mt-10 mb-3">
              {/* Circular Company Logo Overlapping Cover Banner */}
              <View className="w-20 h-20 rounded-full border-4 border-white bg-slate-950 shadow-lg items-center justify-center overflow-hidden">
                {builderProfile.logoUrl ? (
                  <Image source={{ uri: builderProfile.logoUrl }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <Building size={32} color="#f59e0b" />
                )}
              </View>
            </View>

            {/* Company Name & Tagline */}
            <Text className="text-xl font-bold text-slate-900 tracking-tight">{builderProfile.name}</Text>
            <Text className="text-xs font-medium text-slate-500 mt-0.5">{builderProfile.tagline}</Text>

            {/* Stats Row Grid (Matching Mockup Image 3) */}
            <View className="flex-row items-center justify-between py-4 my-3 border-y border-slate-100">
              <View className="items-center flex-1">
                <View className="flex-row items-center">
                  <Building2 size={15} color="#0f172a" />
                  <Text className="text-sm font-black text-slate-900 ml-1">
                    {builderProfile.projectsCount}
                  </Text>
                </View>
                <Text className="text-[11px] font-medium text-slate-500 mt-0.5">Projects</Text>
              </View>

              <View className="h-6 w-px bg-slate-200" />

              <View className="items-center flex-1">
                <View className="flex-row items-center">
                  <MapPin size={15} color="#0f172a" />
                  <Text className="text-sm font-black text-slate-900 ml-1">
                    {builderProfile.citiesCount}
                  </Text>
                </View>
                <Text className="text-[11px] font-medium text-slate-500 mt-0.5">Cities</Text>
              </View>

              <View className="h-6 w-px bg-slate-200" />

              <View className="items-center flex-1">
                <View className="flex-row items-center">
                  <Users size={15} color="#0f172a" />
                  <Text className="text-sm font-black text-slate-900 ml-1">
                    {builderProfile.customersCount}
                  </Text>
                </View>
                <Text className="text-[11px] font-medium text-slate-500 mt-0.5">Happy Customers</Text>
              </View>

              <View className="h-6 w-px bg-slate-200" />

              <View className="items-center flex-1">
                <View className="flex-row items-center">
                  <Star size={15} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-sm font-black text-slate-900 ml-1">
                    {builderProfile.rating}
                  </Text>
                </View>
                <Text className="text-[11px] font-medium text-slate-500 mt-0.5">Rating</Text>
              </View>
            </View>

            {/* About Section with Expandable Read More */}
            <View className="mb-4">
              <Text
                numberOfLines={isAboutExpanded ? undefined : 3}
                className="text-xs text-slate-600 leading-relaxed font-normal"
              >
                {defaultAbout}
              </Text>

              <TouchableOpacity
                onPress={() => setIsAboutExpanded(!isAboutExpanded)}
                activeOpacity={0.7}
                className="flex-row items-center mt-1.5 py-1"
              >
                <Text className="text-xs font-bold text-slate-900 mr-1">
                  {isAboutExpanded ? 'Read Less' : 'Read More'}
                </Text>
                {isAboutExpanded ? (
                  <ChevronUp size={14} color="#0f172a" />
                ) : (
                  <ChevronDown size={14} color="#0f172a" />
                )}
              </TouchableOpacity>
            </View>

            {/* Action Buttons Row: Message on Left (Black), Call Now on Right (White) */}
            <View className="flex-row items-center mb-5">
              {/* Message Button (Solid Black Pill) */}
              <TouchableOpacity
                onPress={handleMessage}
                activeOpacity={0.88}
                className="flex-1 bg-slate-950 py-3.5 px-4 rounded-full flex-row items-center justify-center shadow-md active:opacity-90 mr-2"
              >
                <MessageSquare size={16} color="#ffffff" />
                <Text className="text-sm font-bold text-white ml-2">Message</Text>
              </TouchableOpacity>

              {/* Call Now Button (White Pill with Border) */}
              <TouchableOpacity
                onPress={handleCall}
                activeOpacity={0.8}
                className="flex-1 bg-white border border-slate-300 py-3.5 px-4 rounded-full flex-row items-center justify-center shadow-2xs active:bg-slate-50 ml-1"
              >
                <Phone size={16} color="#0f172a" />
                <Text className="text-sm font-bold text-slate-900 ml-2">Call Now</Text>
              </TouchableOpacity>
            </View>

            {/* Navigation Tabs Bar */}
            <View className="flex-row border-b border-slate-200 mb-4">
              {(['Properties', 'About', 'Reviews', 'Contact'] as const).map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`pb-2.5 px-3 mr-4 border-b-2 ${
                      isSelected ? 'border-slate-950' : 'border-transparent'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Properties List / Tab Contents */}
            {activeTab === 'Properties' && (
              <View>
                {builderProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    variant="list"
                    onPress={() => {
                      onClose();
                      onSelectProperty(prop);
                    }}
                    isFavorite={favoriteIds.includes(prop.id)}
                    onFavoriteToggle={() => onToggleFavorite && onToggleFavorite(prop.id)}
                  />
                ))}

                {builderProperties.length === 0 && (
                  <View className="items-center py-10">
                    <Building2 size={32} color="#cbd5e1" />
                    <Text className="text-sm font-bold text-slate-800 mt-2">
                      No active listings currently
                    </Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'About' && (
              <View className="py-2">
                <Text className="text-sm text-slate-700 leading-relaxed">{defaultAbout}</Text>
              </View>
            )}

            {activeTab === 'Reviews' && (
              <View className="py-4 items-center">
                <Star size={30} color="#f59e0b" fill="#f59e0b" />
                <Text className="text-base font-bold text-slate-900 mt-2">
                  4.8 / 5.0 (140+ Verified Reviews)
                </Text>
                <Text className="text-xs text-slate-500 mt-1">
                  100% verified customer ratings on completed handovers.
                </Text>
              </View>
            )}

            {activeTab === 'Contact' && (
              <View className="py-2">
                {/* 5 Circular Contact Action Buttons Row (Matching User Mockup Image) */}
                <View className="flex-row items-center justify-between py-3 mb-4 border-b border-slate-100">
                  {/* 1. Call */}
                  <TouchableOpacity
                    onPress={handleCall}
                    activeOpacity={0.7}
                    className="items-center flex-1"
                  >
                    <View className="w-13 h-13 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center mb-1.5">
                      <Phone size={20} color="#0f172a" />
                    </View>
                    <Text className="text-[11px] font-semibold text-slate-700 text-center">Call</Text>
                  </TouchableOpacity>

                  {/* 2. WhatsApp */}
                  <TouchableOpacity
                    onPress={handleWhatsApp}
                    activeOpacity={0.7}
                    className="items-center flex-1"
                  >
                    <View className="w-13 h-13 rounded-full bg-[#25D366] shadow-xs items-center justify-center mb-1.5">
                      <Phone size={20} color="#ffffff" style={{ transform: [{ rotate: '-10deg' }] }} />
                    </View>
                    <Text className="text-[11px] font-semibold text-slate-700 text-center">WhatsApp</Text>
                  </TouchableOpacity>

                  {/* 3. Message */}
                  <TouchableOpacity
                    onPress={handleMessage}
                    activeOpacity={0.7}
                    className="items-center flex-1"
                  >
                    <View className="w-13 h-13 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center mb-1.5">
                      <MessageSquare size={20} color="#0f172a" />
                    </View>
                    <Text className="text-[11px] font-semibold text-slate-700 text-center">Message</Text>
                  </TouchableOpacity>

                  {/* 4. Email */}
                  <TouchableOpacity
                    onPress={handleEmail}
                    activeOpacity={0.7}
                    className="items-center flex-1"
                  >
                    <View className="w-13 h-13 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center mb-1.5">
                      <Mail size={20} color="#0f172a" />
                    </View>
                    <Text className="text-[11px] font-semibold text-slate-700 text-center">Email</Text>
                  </TouchableOpacity>

                  {/* 5. Website */}
                  <TouchableOpacity
                    onPress={handleWebsite}
                    activeOpacity={0.7}
                    className="items-center flex-1"
                  >
                    <View className="w-13 h-13 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center mb-1.5">
                      <Globe size={20} color="#0f172a" />
                    </View>
                    <Text className="text-[11px] font-semibold text-slate-700 text-center">Website</Text>
                  </TouchableOpacity>
                </View>

                {/* Detailed Contact Cards */}
                <View className="space-y-3">
                  <View className="flex-row items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <View className="w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3">
                      <Phone size={17} color="#0f172a" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</Text>
                      <Text className="text-xs font-bold text-slate-900 mt-0.5">{builderProfile.phone}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 mt-2.5">
                    <View className="w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3">
                      <Mail size={17} color="#0f172a" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</Text>
                      <Text className="text-xs font-bold text-slate-900 mt-0.5">{builderProfile.email}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 mt-2.5">
                    <View className="w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3">
                      <Globe size={17} color="#0f172a" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Website</Text>
                      <Text className="text-xs font-bold text-slate-900 mt-0.5">
                        {builderProfile.websiteUrl || 'https://www.nexa-homes.com'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 mt-2.5">
                    <View className="w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3">
                      <Clock size={17} color="#0f172a" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Working Hours</Text>
                      <Text className="text-xs font-bold text-slate-900 mt-0.5">Mon - Sat: 9:00 AM - 7:00 PM</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
