import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import { Property } from '../types';
import {
  X,
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
  Sparkles,
  Share2,
} from 'lucide-react-native';

interface PropertyDetailModalProps {
  property: Property | null;
  visible: boolean;
  onClose: () => void;
  onApplyRent: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  visible,
  onClose,
  onApplyRent,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  const allImages = [property.imageUrl, ...(property.additionalImages || [])];

  const handleCall = () => {
    Alert.alert('Contact Builder', `Call ${property.builderName} at ${property.builderPhone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call Now', onPress: () => Linking.openURL(`tel:${property.builderPhone}`) },
    ]);
  };

  const handleWhatsApp = () => {
    Alert.alert('Send Inquiry', `Start WhatsApp conversation with ${property.builderName} regarding "${property.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Chat',
        onPress: () => {
          Alert.alert('Chat Initiated', `Prototype message created: "Hello ${property.builderName}, I am interested in renting ${property.title}."`);
        },
      },
    ]);
  };

  const handleVideoTour = () => {
    Alert.alert(
      'Virtual Video Tour',
      `Streaming HD video tour of ${property.title}.\n\nIn the production app, this plays the builder's uploaded walkthrough video directly in-app.`
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        {/* Floating Top Navigation Bar */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2 z-10 bg-white/95 border-b border-slate-100">
          <TouchableOpacity
            onPress={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <X size={18} color="#1e293b" />
          </TouchableOpacity>

          <Text className="text-sm font-bold text-slate-900 flex-1 text-center mx-2" numberOfLines={1}>
            {property.title}
          </Text>

          <TouchableOpacity
            onPress={() => Alert.alert('Share', `Share link for ${property.title} copied!`)}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <Share2 size={16} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Main Gallery Carousel */}
          <View className="relative w-full h-64 bg-slate-100">
            <Image
              source={{ uri: allImages[activeImageIndex] || property.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* Video Tour Button */}
            {property.hasVideo && (
              <TouchableOpacity
                onPress={handleVideoTour}
                activeOpacity={0.8}
                className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center shadow-sm"
              >
                <Video size={14} color="#ffffff" />
                <Text className="text-xs font-bold text-white ml-1.5">Watch Video Tour</Text>
              </TouchableOpacity>
            )}

            {/* Photo Counter */}
            <View className="absolute bottom-3 left-3 bg-black/50 px-2.5 py-1 rounded-md">
              <Text className="text-white text-[11px] font-semibold">
                {activeImageIndex + 1} / {allImages.length}
              </Text>
            </View>
          </View>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2 bg-slate-50 border-b border-slate-100">
              {allImages.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveImageIndex(idx)}
                  className={`mr-2 rounded-xl overflow-hidden border-2 ${
                    activeImageIndex === idx ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <Image source={{ uri: img }} className="w-16 h-12" resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Details Body */}
          <View className="p-5">
            {/* Price & Security Deposit */}
            <View className="flex-row items-baseline justify-between mb-2">
              <View className="flex-row items-baseline">
                <Text className="text-2xl font-black text-slate-950">
                  ₹{property.rent.toLocaleString('en-IN')}
                </Text>
                <Text className="text-sm font-semibold text-slate-500 ml-1">/month</Text>
              </View>

              <View className="bg-slate-100 px-3 py-1.5 rounded-xl">
                <Text className="text-xs text-slate-600">
                  Deposit: <Text className="font-bold text-slate-900">₹{property.deposit.toLocaleString('en-IN')}</Text>
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text className="text-xl font-bold text-slate-900 leading-snug mb-2">
              {property.title}
            </Text>

            {/* Location & Address */}
            <View className="flex-row items-start mb-5 bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
              <MapPin size={16} color="#2563eb" className="mt-0.5" />
              <View className="ml-2 flex-1">
                <Text className="text-xs font-bold text-blue-900">
                  {property.location}, {property.city}
                </Text>
                <Text className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                  {property.address}
                </Text>
              </View>
            </View>

            {/* Key Specifications Grid */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Property Specifications
            </Text>
            <View className="flex-row flex-wrap justify-between mb-5">
              <View className="w-[48%] bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-2.5 flex-row items-center">
                <BedDouble size={20} color="#2563eb" />
                <View className="ml-2.5">
                  <Text className="text-[10px] font-medium text-slate-500">Configuration</Text>
                  <Text className="text-sm font-bold text-slate-800">{property.bhk} BHK</Text>
                </View>
              </View>

              <View className="w-[48%] bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-2.5 flex-row items-center">
                <Maximize size={20} color="#2563eb" />
                <View className="ml-2.5">
                  <Text className="text-[10px] font-medium text-slate-500">Super Built-up</Text>
                  <Text className="text-sm font-bold text-slate-800">{property.areaSqft} sq.ft</Text>
                </View>
              </View>

              <View className="w-[48%] bg-slate-50 p-3 rounded-2xl border border-slate-100 flex-row items-center">
                <Layers size={20} color="#2563eb" />
                <View className="ml-2.5">
                  <Text className="text-[10px] font-medium text-slate-500">Furnishing</Text>
                  <Text className="text-sm font-bold text-slate-800">{property.furnishing}</Text>
                </View>
              </View>

              <View className="w-[48%] bg-slate-50 p-3 rounded-2xl border border-slate-100 flex-row items-center">
                <Calendar size={20} color="#2563eb" />
                <View className="ml-2.5">
                  <Text className="text-[10px] font-medium text-slate-500">Availability</Text>
                  <Text className="text-sm font-bold text-emerald-600">Immediate</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              About this Home
            </Text>
            <Text className="text-sm text-slate-600 leading-relaxed mb-6">
              {property.description}
            </Text>

            {/* Amenities Grid */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Included Amenities ({property.amenities.length})
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {property.amenities.map((amenity, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full mr-2 mb-2"
                >
                  <CheckCircle2 size={13} color="#10b981" />
                  <Text className="text-xs font-medium text-slate-700 ml-1.5">{amenity}</Text>
                </View>
              ))}
            </View>

            {/* Builder Card */}
            <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Property Builder / Owner Info
            </Text>
            <View className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center shadow-xs">
                    <Text className="text-white font-extrabold text-lg">
                      {property.builderName.charAt(0)}
                    </Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
                        {property.builderName}
                      </Text>
                      {property.builderVerified && (
                        <ShieldCheck size={14} color="#10b981" className="ml-1" />
                      )}
                    </View>
                    <Text className="text-xs text-slate-500">Verified Partner Builder</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-2 pt-2 border-t border-slate-200">
                <TouchableOpacity
                  onPress={handleCall}
                  className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl flex-row items-center justify-center shadow-xs"
                >
                  <Phone size={15} color="#2563eb" />
                  <Text className="text-xs font-bold text-slate-800 ml-1.5">Direct Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleWhatsApp}
                  className="flex-1 bg-emerald-50 border border-emerald-200 py-2.5 rounded-xl flex-row items-center justify-center ml-2"
                >
                  <MessageSquare size={15} color="#059669" />
                  <Text className="text-xs font-bold text-emerald-800 ml-1.5">WhatsApp / Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Action Bar */}
        <View className="flex-row items-center justify-between p-4 bg-white border-t border-slate-100 shadow-lg">
          <View>
            <Text className="text-[11px] text-slate-500 font-medium">Monthly Rent</Text>
            <Text className="text-xl font-black text-slate-900">
              ₹{property.rent.toLocaleString('en-IN')}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onApplyRent(property)}
            activeOpacity={0.85}
            className="bg-blue-600 px-7 py-3.5 rounded-2xl flex-row items-center shadow-md shadow-blue-500/25"
          >
            <Sparkles size={16} color="#ffffff" />
            <Text className="text-white font-bold text-sm ml-2">Apply for Rent</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
