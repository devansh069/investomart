import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from 'react-native';
import {
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
  CheckCircle2,
  Camera,
  Pencil,
  Share2,
  Calendar,
} from 'lucide-react-native';
import { Property, BuilderProfile } from '../../../types';
import { PropertyCard } from '../../discovery/components/PropertyCard';

export interface BuilderProfileViewProps {
  builderProfile?: Partial<BuilderProfile>;
  builderProperties?: Property[];
  onSelectProperty?: (property: Property) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (propertyId: string) => void;
  onOpenMessages?: () => void;
  isOwnerView?: boolean;
  bottomActions?: React.ReactNode;
}

export const BuilderProfileView: React.FC<BuilderProfileViewProps> = ({
  builderProfile = {},
  builderProperties = [],
  onSelectProperty,
  favoriteIds = [],
  onToggleFavorite,
  onOpenMessages,
  isOwnerView = false,
  bottomActions,
}) => {
  const [activeTab, setActiveTab] = useState<'About' | 'Projects' | 'Reviews' | 'Contact'>('About');
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const profile: BuilderProfile = {
    id: builderProfile.id || 'bld_1',
    name: builderProfile.name || 'Nexa Homes Pvt. Ltd.',
    tagline: builderProfile.tagline || 'Building Dreams, Creating Futures',
    verified: builderProfile.verified !== undefined ? builderProfile.verified : true,
    projectsCount: builderProfile.projectsCount || '120+',
    citiesCount: builderProfile.citiesCount || '8+',
    customersCount: builderProfile.customersCount || '10K+',
    rating: builderProfile.rating || 4.8,
    aboutText:
      builderProfile.aboutText ||
      'Nexa Homes is a trusted real estate developer known for delivering premium residential and commercial spaces across India. With a focus on quality, innovation and customer satisfaction, we create spaces that inspire a better tomorrow.',
    phone: builderProfile.phone || '+91 98765 43210',
    email: builderProfile.email || 'info@nexahomes.in',
    websiteUrl: builderProfile.websiteUrl || 'www.nexahomes.in',
    whatsapp: builderProfile.whatsapp || '+919876543210',
    coverUrl: builderProfile.coverUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    logoUrl: builderProfile.logoUrl,
  };

  const handleCall = () => {
    Alert.alert('Call Builder', `Call ${profile.name} at ${profile.phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call Now', onPress: () => Linking.openURL(`tel:${profile.phone}`) },
    ]);
  };

  const handleMessage = () => {
    if (onOpenMessages) {
      onOpenMessages();
    } else {
      Alert.alert('Message Builder', `Send inquiry message to ${profile.name}?`);
    }
  };

  const handleWhatsApp = () => {
    const phoneNum = profile.whatsapp || profile.phone;
    const cleanNumber = phoneNum.replace(/[^0-9]/g, '');
    const formatted = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const waUrl = `https://wa.me/${formatted}`;
    Linking.openURL(waUrl).catch(() => {
      Alert.alert('WhatsApp', `Connect with ${profile.name} on WhatsApp at +${formatted}`);
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${profile.email}`).catch(() => {
      Alert.alert('Email', `Send email to ${profile.email}`);
    });
  };

  const handleWebsite = () => {
    const site = profile.websiteUrl || 'www.nexahomes.in';
    const webUrl = site.startsWith('http') ? site : `https://${site}`;
    Linking.openURL(webUrl).catch(() => {
      Alert.alert('Website', `Opening website: ${webUrl}`);
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* 1. Cover Image Banner */}
      <View className="relative w-full h-44 bg-slate-900">
        <Image
          source={{ uri: profile.coverUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/10" />

        {isOwnerView ? (
          <TouchableOpacity
            onPress={() => Alert.alert('Edit Cover', 'Choose a photo from your gallery to update cover image.')}
            activeOpacity={0.8}
            className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full flex-row items-center shadow-xs"
          >
            <Camera size={14} color="#0f172a" />
            <Text className="text-xs font-semibold text-slate-900 ml-1.5">Edit Cover</Text>
          </TouchableOpacity>
        ) : (
          profile.verified && (
            <View className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full flex-row items-center shadow-xs">
              <CheckCircle2 size={14} color="#10b981" />
              <Text className="text-xs font-bold text-emerald-800 ml-1.5">Verified Builder</Text>
            </View>
          )
        )}
      </View>

      {/* 2. Builder Logo & Name Header */}
      <View className="px-5 pb-3">
        <View className="flex-row items-end justify-between -mt-10 mb-3">
          {/* Logo Circle with Golden NEXA HOMES Badge */}
          <View className="relative">
            <View className="w-20 h-20 rounded-full border-4 border-white bg-black items-center justify-center overflow-hidden shadow-lg">
              {profile.logoUrl ? (
                <Image source={{ uri: profile.logoUrl }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="items-center justify-center">
                  <Building2 size={24} color="#fbbf24" />
                  <Text className="text-[7px] font-black text-white tracking-widest uppercase mt-0.5">
                    NEXA HOMES
                  </Text>
                  <Text className="text-[4px] text-amber-300 font-medium tracking-tighter uppercase">
                    BUILDING BETTER LIVING
                  </Text>
                </View>
              )}
            </View>
            {isOwnerView && (
              <TouchableOpacity
                onPress={() => Alert.alert('Edit Logo', 'Update company logo photo.')}
                activeOpacity={0.8}
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-100 border border-white items-center justify-center shadow-xs"
              >
                <Camera size={12} color="#0f172a" />
              </TouchableOpacity>
            )}
          </View>

          {/* Verified Builder Badge (Right of logo if owner view) */}
          {isOwnerView && profile.verified && (
            <View className="bg-emerald-50 px-3 py-1.5 rounded-full flex-row items-center border border-emerald-200/60 mb-1">
              <CheckCircle2 size={14} color="#10b981" fill="#10b981" />
              <Text className="text-xs font-bold text-emerald-600 ml-1.5">Verified Builder</Text>
            </View>
          )}
        </View>

        {/* Company Name & Tagline */}
        <Text className="text-xl font-bold text-slate-900 tracking-tight">{profile.name}</Text>
        <Text className="text-xs font-medium text-slate-500 mt-0.5">{profile.tagline}</Text>

        {/* 3. Stats Row Grid */}
        <View className="flex-row items-center justify-between py-3.5 my-3 border-y border-slate-100">
          <View className="items-center flex-1">
            <View className="flex-row items-center">
              <Building2 size={15} color="#0f172a" />
              <Text className="text-sm font-black text-slate-900 ml-1">{profile.projectsCount}</Text>
            </View>
            <Text className="text-[11px] font-medium text-slate-500 mt-0.5">Projects</Text>
          </View>

          <View className="h-6 w-px bg-slate-200" />

          <View className="items-center flex-1">
            <View className="flex-row items-center">
              <MapPin size={15} color="#0f172a" />
              <Text className="text-sm font-black text-slate-900 ml-1">{profile.citiesCount}</Text>
            </View>
            <Text className="text-[11px] font-medium text-slate-500 mt-0.5">Cities</Text>
          </View>

          <View className="h-6 w-px bg-slate-200" />

          <View className="items-center flex-1">
            <View className="flex-row items-center">
              <Users size={15} color="#0f172a" />
              <Text className="text-sm font-black text-slate-900 ml-1">{profile.customersCount}</Text>
            </View>
            <Text className="text-[11px] font-medium text-slate-500 mt-0.5">Happy Customers</Text>
          </View>

          <View className="h-6 w-px bg-slate-200" />

          <View className="items-center flex-1">
            <View className="flex-row items-center">
              <Star size={15} color="#f59e0b" fill="#f59e0b" />
              <Text className="text-sm font-black text-slate-900 ml-1">{profile.rating}</Text>
            </View>
            <Text className="text-[11px] font-medium text-slate-500 mt-0.5">Rating</Text>
          </View>
        </View>

        {/* 4. About Bio with Expandable Read More */}
        <View className="mb-4">
          <Text
            numberOfLines={isAboutExpanded ? undefined : 3}
            className="text-xs text-slate-600 leading-relaxed font-normal"
          >
            {profile.aboutText}
          </Text>

          <TouchableOpacity
            onPress={() => setIsAboutExpanded(!isAboutExpanded)}
            activeOpacity={0.7}
            className="flex-row items-center mt-1 py-1"
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

        {/* 5. Action Buttons Row */}
        {isOwnerView ? (
          <View className="flex-row items-center mb-5">
            <TouchableOpacity
              onPress={() => Alert.alert('Edit Profile', 'Update company information and profile photo.')}
              activeOpacity={0.88}
              className="flex-1 bg-slate-950 py-3.5 px-4 rounded-full flex-row items-center justify-center shadow-xs mr-2"
            >
              <Pencil size={15} color="#ffffff" />
              <Text className="text-sm font-bold text-white ml-2">Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Share.share({
                  message: `Check out ${profile.name} on InvestorMart! Verified Developer.`,
                })
              }
              activeOpacity={0.8}
              className="flex-1 bg-white border border-slate-300 py-3.5 px-4 rounded-full flex-row items-center justify-center ml-1"
            >
              <Share2 size={15} color="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Share Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center mb-5">
            <TouchableOpacity
              onPress={handleMessage}
              activeOpacity={0.88}
              className="flex-1 bg-slate-950 py-3.5 px-4 rounded-full flex-row items-center justify-center shadow-md active:opacity-90 mr-2"
            >
              <MessageSquare size={16} color="#ffffff" />
              <Text className="text-sm font-bold text-white ml-2">Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCall}
              activeOpacity={0.8}
              className="flex-1 bg-white border border-slate-300 py-3.5 px-4 rounded-full flex-row items-center justify-center shadow-2xs active:bg-slate-50 ml-1"
            >
              <Phone size={16} color="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Call Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 6. Navigation Tabs Bar */}
        <View className="flex-row border-b border-slate-200 mb-4">
          {(['About', 'Projects', 'Reviews', 'Contact'] as const).map((tab) => {
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

        {/* 7. Tab Contents */}

        {/* TAB 1: ABOUT */}
        {activeTab === 'About' && (
          <View className="mb-6 space-y-4">
            {/* Company Info Card (Matching Screenshot Specs) */}
            <View className="bg-slate-50/50 border border-slate-200/70 rounded-2xl p-4 space-y-3.5">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center mr-3">
                  <Building2 size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] font-semibold text-slate-400">Company Name</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">{profile.name}</Text>
                </View>
              </View>

              <View className="flex-row items-center mt-2.5">
                <View className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center mr-3">
                  <Calendar size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] font-semibold text-slate-400">Established</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">2015</Text>
                </View>
              </View>

              <View className="flex-row items-center mt-2.5">
                <View className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center mr-3">
                  <MapPin size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] font-semibold text-slate-400">Head Office</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">Sector 62, Noida, Uttar Pradesh</Text>
                </View>
              </View>

              <View className="flex-row items-center mt-2.5">
                <View className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center mr-3">
                  <Globe size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] font-semibold text-slate-400">Website</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">{profile.websiteUrl}</Text>
                </View>
              </View>

              <View className="flex-row items-center mt-2.5">
                <View className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center mr-3">
                  <Mail size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] font-semibold text-slate-400">Email</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">{profile.email}</Text>
                </View>
              </View>

              <View className="flex-row items-center mt-2.5">
                <View className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center mr-3">
                  <Phone size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] font-semibold text-slate-400">Phone</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">{profile.phone}</Text>
                </View>
              </View>
            </View>

            {/* Our Mission Section */}
            <View className="mt-4">
              <Text className="text-sm font-bold text-slate-900 mb-2">Our Mission</Text>
              <View className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60">
                <Text className="text-xs text-slate-600 font-medium italic leading-relaxed">
                  "To create sustainable and modern spaces that enhance lives and build stronger communities."
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === 'Projects' && (
          <View className="mb-4 space-y-3">
            {builderProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                variant="list"
                onPress={() => onSelectProperty && onSelectProperty(prop)}
                isFavorite={favoriteIds.includes(prop.id)}
                onFavoriteToggle={() => onToggleFavorite && onToggleFavorite(prop.id)}
              />
            ))}

            {builderProperties.length === 0 && (
              <View className="items-center py-10 bg-slate-50 rounded-2xl border border-slate-200/70 p-6">
                <Building2 size={32} color="#cbd5e1" />
                <Text className="text-sm font-bold text-slate-800 mt-2">
                  No active listings currently
                </Text>
                <Text className="text-xs text-slate-500 mt-1 text-center">
                  New project developments will be listed here soon.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === 'Reviews' && (
          <View className="mb-6 space-y-3">
            {/* Rating Summary Header Card */}
            <View className="py-4 items-center bg-slate-50 rounded-2xl border border-slate-200/60 p-4">
              <Star size={32} color="#f59e0b" fill="#f59e0b" />
              <Text className="text-base font-bold text-slate-900 mt-2">{profile.rating} / 5.0 Rating</Text>
              <Text className="text-xs text-slate-500 mt-0.5">Based on 140+ verified buyer & tenant reviews</Text>
            </View>

            {/* Review Items */}
            <View className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 mt-2">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-xs font-bold text-slate-900">Arjun Kapoor</Text>
                <View className="flex-row items-center">
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-xs font-bold text-slate-900 ml-1">5.0</Text>
                </View>
              </View>
              <Text className="text-xs text-slate-600 leading-relaxed">
                Exceptional quality of construction! Delivered property right on schedule with top-notch amenities and transparent communication.
              </Text>
            </View>

            <View className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 mt-2">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-xs font-bold text-slate-900">Pooja Sharma</Text>
                <View className="flex-row items-center">
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-xs font-bold text-slate-900 ml-1">4.5</Text>
                </View>
              </View>
              <Text className="text-xs text-slate-600 leading-relaxed">
                Very smooth leasing process and responsive builder support team. Highly recommended real estate developer.
              </Text>
            </View>
          </View>
        )}

        {/* TAB 4: CONTACT */}
        {activeTab === 'Contact' && (
          <View className="mb-6">
            {/* 5 Circular Contact Action Buttons Row */}
            <View className="flex-row items-center justify-between py-3 mb-4 border-b border-slate-100">
              {/* 1. Call */}
              <TouchableOpacity onPress={handleCall} activeOpacity={0.7} className="items-center flex-1">
                <View className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center mb-1.5">
                  <Phone size={18} color="#0f172a" />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700 text-center">Call</Text>
              </TouchableOpacity>

              {/* 2. WhatsApp */}
              <TouchableOpacity onPress={handleWhatsApp} activeOpacity={0.7} className="items-center flex-1">
                <View className="w-12 h-12 rounded-full bg-[#25D366] shadow-xs items-center justify-center mb-1.5">
                  <Phone size={18} color="#ffffff" style={{ transform: [{ rotate: '-10deg' }] }} />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700 text-center">WhatsApp</Text>
              </TouchableOpacity>

              {/* 3. Message */}
              <TouchableOpacity onPress={handleMessage} activeOpacity={0.7} className="items-center flex-1">
                <View className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center mb-1.5">
                  <MessageSquare size={18} color="#0f172a" />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700 text-center">Message</Text>
              </TouchableOpacity>

              {/* 4. Email */}
              <TouchableOpacity onPress={handleEmail} activeOpacity={0.7} className="items-center flex-1">
                <View className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center mb-1.5">
                  <Mail size={18} color="#0f172a" />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700 text-center">Email</Text>
              </TouchableOpacity>

              {/* 5. Website */}
              <TouchableOpacity onPress={handleWebsite} activeOpacity={0.7} className="items-center flex-1">
                <View className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center mb-1.5">
                  <Globe size={18} color="#0f172a" />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700 text-center">Website</Text>
              </TouchableOpacity>
            </View>

            {/* Detailed Contact Cards */}
            <View className="space-y-2.5">
              <View className="flex-row items-center bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/80">
                <View className="w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3">
                  <Phone size={16} color="#0f172a" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">{profile.phone}</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/80 mt-2.5">
                <View className="w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3">
                  <Mail size={16} color="#0f172a" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">{profile.email}</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/80 mt-2.5">
                <View className="w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3">
                  <Globe size={16} color="#0f172a" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Website</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">{profile.websiteUrl}</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/80 mt-2.5">
                <View className="w-9 h-9 rounded-xl bg-white border border-slate-200 items-center justify-center mr-3">
                  <Clock size={16} color="#0f172a" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Working Hours</Text>
                  <Text className="text-xs font-bold text-slate-900 mt-0.5">Mon - Sat: 9:00 AM - 7:00 PM</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 8. Bottom Actions Slot (If provided, e.g. Switch to Client View & Sign Out) */}
        {bottomActions}
      </View>
    </View>
  );
};
