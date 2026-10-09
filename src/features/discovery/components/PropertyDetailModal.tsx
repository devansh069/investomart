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
import { BuilderProfileModal } from '../../broker/components/BuilderProfileModal';
import {
  ArrowLeft,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  BedDouble,
  Maximize,
  ShieldCheck,
  Video,
  Phone,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Layers,
  Building,
} from 'lucide-react-native';

interface PropertyDetailModalProps {
  property: Property | null;
  visible: boolean;
  onClose: () => void;
  onApplyRent: (property: Property) => void;
  onOpenMessages: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
  allProperties?: Property[];
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  visible,
  onClose,
  onApplyRent,
  onOpenMessages,
  isFavorite = false,
  onToggleFavorite,
  allProperties = [],
}) => {
  const insets = useSafeAreaInsets();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBuilderProfile, setShowBuilderProfile] = useState(false);

  if (!property) return null;

  const allImages = [property.imageUrl, ...(property.additionalImages || [])];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const handleCall = () => {
    Alert.alert('Contact Builder', `Call ${property.builderName} at ${property.builderPhone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call Now', onPress: () => Linking.openURL(`tel:${property.builderPhone}`) },
    ]);
  };

  const handleWhatsApp = () => {
    onClose();
    onOpenMessages();
  };

  const handleVideoTour = () => {
    Alert.alert(
      'Virtual Video Tour',
      `Streaming HD video tour of ${property.title}.\n\nWalkthrough video provided by builder.`
    );
  };

  const currentBuilderProfile: BuilderProfile = {
    id: property.builderId,
    name: property.builderName,
    tagline: 'Building Dreams, Creating Futures',
    verified: property.builderVerified,
    projectsCount: '120+',
    citiesCount: '8+',
    customersCount: '10K+',
    rating: 4.8,
    aboutText: `${property.builderName} is a trusted real estate developer known for delivering premium residential and commercial spaces across India. With a focus on quality, innovation and customer satisfaction, we create spaces that inspire a better tomorrow.`,
    phone: property.builderPhone,
    email: 'contact@developer.com',
  };

  const builderListings = allProperties.filter(
    (p) => p.builderName.toLowerCase() === property.builderName.toLowerCase()
  );

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44);
  const bottomInset = Math.max(insets.bottom, 16);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View className="flex-1 bg-white" style={{ paddingTop: topInset }}>
        {/* Top Header Navigation Bar (Back Arrow on Left, Heart + Share on Right, NO Title text) */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={18} color="#0f172a" />
          </TouchableOpacity>

          {/* Clean center header - No title text as requested */}
          <View className="flex-1" />

          {/* Right Action Icons: Favorite Heart & Share */}
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => onToggleFavorite && onToggleFavorite(property.id)}
              activeOpacity={0.7}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-2"
            >
              <Heart
                size={18}
                color={isFavorite ? '#ef4444' : '#0f172a'}
                fill={isFavorite ? '#ef4444' : 'none'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Share.share({
                  message: `Check out ${property.title} in ${property.city} for ₹${property.rent.toLocaleString(
                    'en-IN'
                  )}/month on InvestorMart.`,
                })
              }
              activeOpacity={0.7}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            >
              <Share2 size={17} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Page Body */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Main Photo Gallery Carousel with Left & Right Arrow Overlay Controls */}
          <View className="relative w-full h-72 bg-slate-900">
            <Image
              source={{ uri: allImages[activeImageIndex] || property.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* Left Carousel Arrow */}
            {allImages.length > 1 && (
              <TouchableOpacity
                onPress={handlePrevImage}
                activeOpacity={0.8}
                className="absolute left-3 top-1/2 -mt-5 w-10 h-10 rounded-full bg-black/50 items-center justify-center z-10 border border-white/20"
                accessibilityLabel="Previous photo"
              >
                <ChevronLeft size={22} color="#ffffff" />
              </TouchableOpacity>
            )}

            {/* Right Carousel Arrow */}
            {allImages.length > 1 && (
              <TouchableOpacity
                onPress={handleNextImage}
                activeOpacity={0.8}
                className="absolute right-3 top-1/2 -mt-5 w-10 h-10 rounded-full bg-black/50 items-center justify-center z-10 border border-white/20"
                accessibilityLabel="Next photo"
              >
                <ChevronRight size={22} color="#ffffff" />
              </TouchableOpacity>
            )}

            {/* Watch Video Tour Button */}
            {property.hasVideo && (
              <TouchableOpacity
                onPress={handleVideoTour}
                activeOpacity={0.8}
                className="absolute bottom-3 right-3 bg-black/75 px-3 py-1.5 rounded-full flex-row items-center border border-white/20"
              >
                <Video size={14} color="#ffffff" />
                <Text className="text-xs font-bold text-white ml-1.5">Watch Video</Text>
              </TouchableOpacity>
            )}

            {/* Photo Index Counter Badge */}
            <View className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">
                {activeImageIndex + 1} / {allImages.length}
              </Text>
            </View>
          </View>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-4 py-2 bg-slate-50 border-b border-slate-100"
            >
              {allImages.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveImageIndex(idx)}
                  className={`mr-2 rounded-xl overflow-hidden border-2 ${
                    activeImageIndex === idx ? 'border-slate-950' : 'border-transparent'
                  }`}
                >
                  <Image source={{ uri: img }} className="w-16 h-12" resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Property Details Body */}
          <View className="p-5">
            {/* Title */}
            <Text className="text-xl font-bold text-slate-900 leading-snug mb-2">
              {property.title}
            </Text>

            {/* Location & Address Badge */}
            <View className="flex-row items-start mb-5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
              <MapPin size={17} color="#0f172a" className="mt-0.5" />
              <View className="ml-2.5 flex-1">
                <Text className="text-xs font-bold text-slate-900">
                  {property.location}, {property.city}
                </Text>
                <Text className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                  {property.address}
                </Text>
              </View>
            </View>

            {/* Specifications Grid */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Property Specifications
            </Text>
            <View className="flex-row flex-wrap justify-between mb-5">
              <View className="w-[48%] bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-2.5 flex-row items-center">
                <BedDouble size={20} color="#0f172a" />
                <View className="ml-2.5">
                  <Text className="text-[10px] font-medium text-slate-500">Bedrooms</Text>
                  <Text className="text-sm font-bold text-slate-800">{property.bhk} BHK</Text>
                </View>
              </View>

              <View className="w-[48%] bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-2.5 flex-row items-center">
                <Maximize size={20} color="#0f172a" />
                <View className="ml-2.5">
                  <Text className="text-[10px] font-medium text-slate-500">Area</Text>
                  <Text className="text-sm font-bold text-slate-800">{property.areaSqft} sq.ft</Text>
                </View>
              </View>

              <View className="w-[48%] bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex-row items-center">
                <Layers size={20} color="#0f172a" />
                <View className="ml-2.5">
                  <Text className="text-[10px] font-medium text-slate-500">Furnishing</Text>
                  <Text className="text-sm font-bold text-slate-800">{property.furnishing}</Text>
                </View>
              </View>

              <View className="w-[48%] bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex-row items-center">
                <Calendar size={20} color="#0f172a" />
                <View className="ml-2.5">
                  <Text className="text-[10px] font-medium text-slate-500">Deposit</Text>
                  <Text className="text-sm font-bold text-slate-800">
                    ₹{property.deposit.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              About this Property
            </Text>
            <Text className="text-sm text-slate-600 leading-relaxed mb-6">
              {property.description}
            </Text>

            {/* Amenities Grid */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Amenities ({property.amenities.length})
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {property.amenities.map((amenity, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-full mr-2 mb-2"
                >
                  <CheckCircle2 size={14} color="#10b981" />
                  <Text className="text-xs font-semibold text-slate-700 ml-1.5">{amenity}</Text>
                </View>
              ))}
            </View>

            {/* Builder Card (Matching User's Specs & Mockup) */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Builder / Owner Info
            </Text>
            <View className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 mb-6">
              {/* Logo on Left, Name on Right (Clickable to open Builder Profile) */}
              <TouchableOpacity
                onPress={() => setShowBuilderProfile(true)}
                activeOpacity={0.8}
                className="flex-row items-center mb-3"
              >
                <View className="w-12 h-12 rounded-full bg-slate-950 items-center justify-center shadow-xs">
                  <Building size={22} color="#f59e0b" />
                </View>
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-base font-bold text-slate-900" numberOfLines={1}>
                      {property.builderName}
                    </Text>
                    {property.builderVerified && (
                      <ShieldCheck size={16} color="#10b981" className="ml-1.5" />
                    )}
                  </View>
                  <Text className="text-xs text-slate-500">Verified Builder Partner</Text>
                </View>
              </TouchableOpacity>

              {/* 3 Lines About Builder with "... Read More v" Dropdown link */}
              <View className="mb-3">
                <Text numberOfLines={3} className="text-xs text-slate-600 leading-relaxed font-normal">
                  {currentBuilderProfile.aboutText}
                </Text>

                <TouchableOpacity
                  onPress={() => setShowBuilderProfile(true)}
                  activeOpacity={0.7}
                  className="flex-row items-center mt-1 py-0.5"
                >
                  <Text className="text-xs font-bold text-slate-900 mr-1">Read More</Text>
                  <ChevronDown size={14} color="#0f172a" />
                </TouchableOpacity>
              </View>

              {/* 2 Action Buttons (Message on Left in Black, Call Now on Right in White with border) */}
              <View className="flex-row items-center pt-3 border-t border-slate-200/80">
                {/* Message Button (Solid Dark Black Pill) */}
                <TouchableOpacity
                  onPress={handleWhatsApp}
                  activeOpacity={0.88}
                  className="flex-1 bg-slate-950 py-3 px-4 rounded-full flex-row items-center justify-center shadow-2xs mr-2 active:opacity-90"
                >
                  <MessageSquare size={15} color="#ffffff" />
                  <Text className="text-xs font-bold text-white ml-2">Message</Text>
                </TouchableOpacity>

                {/* Call Now Button (Light White Pill with Border) */}
                <TouchableOpacity
                  onPress={handleCall}
                  activeOpacity={0.8}
                  className="flex-1 bg-white border border-slate-300 py-3 px-4 rounded-full flex-row items-center justify-center active:bg-slate-50 ml-1"
                >
                  <Phone size={15} color="#0f172a" />
                  <Text className="text-xs font-bold text-slate-900 ml-2">Call Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Footer Action Bar (Flush to Screen Bottom) */}
        <View
          style={{ paddingBottom: bottomInset }}
          className="pt-3 px-5 bg-white border-t border-slate-100 shadow-2xl flex-row items-center justify-between space-x-3"
        >
          {/* Call Now Button */}
          <TouchableOpacity
            onPress={handleCall}
            activeOpacity={0.8}
            className="flex-1 bg-white border border-slate-300 py-3.5 px-4 rounded-full flex-row items-center justify-center shadow-2xs active:bg-slate-50 mr-2"
          >
            <Phone size={16} color="#0f172a" />
            <Text className="text-sm font-bold text-slate-900 ml-2">Call Now</Text>
          </TouchableOpacity>

          {/* Book / Rent Now Button */}
          <TouchableOpacity
            onPress={() => onApplyRent(property)}
            activeOpacity={0.88}
            className="flex-1 bg-slate-950 py-3.5 px-4 rounded-full flex-row items-center justify-center shadow-md active:opacity-90 ml-1"
          >
            <Calendar size={16} color="#ffffff" />
            <Text className="text-sm font-bold text-white ml-2">Book / Rent Now</Text>
          </TouchableOpacity>
        </View>

        {/* Builder Profile Page Modal */}
        <BuilderProfileModal
          visible={showBuilderProfile}
          onClose={() => setShowBuilderProfile(false)}
          builderProfile={currentBuilderProfile}
          builderProperties={builderListings.length > 0 ? builderListings : [property]}
          onSelectProperty={(prop) => {
            setShowBuilderProfile(false);
          }}
          favoriteIds={isFavorite ? [property.id] : []}
          onToggleFavorite={onToggleFavorite}
          onOpenMessages={onOpenMessages}
        />
      </View>
    </Modal>
  );
};
