import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, Image } from 'react-native';
import { Property, PropertyType, FurnishingType } from '../types';
import { allAmenitiesList, indianCities } from '../mock/data';
import { X, Upload, Video, CheckCircle2 } from 'lucide-react-native';

interface AddPropertyModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProperty: (property: Property) => void;
  builderName: string;
  builderPhone: string;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  visible,
  onClose,
  onAddProperty,
  builderName,
  builderPhone,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('Apartment');
  const [bhk, setBhk] = useState<number>(2);
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [areaSqft, setAreaSqft] = useState('');
  const [furnishing, setFurnishing] = useState<FurnishingType>('Fully Furnished');
  const [city, setCity] = useState('Bangalore');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [hasVideo, setHasVideo] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Covered Parking',
    '24/7 Security',
    'Power Backup',
  ]);

  // Preset gallery images for selection in prototype
  const sampleImages = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  ];
  const [selectedImage, setSelectedImage] = useState(sampleImages[0]);

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleSave = () => {
    if (!title || !rent || !location) {
      Alert.alert('Missing Details', 'Please provide a property title, monthly rent, and location.');
      return;
    }

    const newProperty: Property = {
      id: `prop_${Date.now()}`,
      title,
      builderId: 'bld_1',
      builderName: builderName || 'Oberoi Green Homes & Realty',
      builderPhone: builderPhone || '+91 98230 11223',
      builderVerified: true,
      type,
      bhk,
      rent: parseInt(rent, 10) || 30000,
      deposit: parseInt(deposit, 10) || 90000,
      areaSqft: parseInt(areaSqft, 10) || 1200,
      furnishing,
      city,
      location,
      address: address || `${location}, ${city}`,
      description: description || 'Beautifully maintained rental property in a prime neighborhood with modern amenities.',
      amenities: selectedAmenities,
      imageUrl: selectedImage,
      hasVideo,
      status: 'AVAILABLE',
      postedDate: 'Just now',
    };

    onAddProperty(newProperty);
    Alert.alert('Listing Published!', 'Your property is now active and visible to all prospective tenants.');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <View>
            <Text className="text-xl font-black text-slate-900">List New Property</Text>
            <Text className="text-xs text-slate-500 mt-0.5">Builder / Owner Portal</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <X size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
          {/* Photo & Video Uploader Simulation */}
          <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Property Photographs & Media
          </Text>
          <View className="mb-4">
            <View className="relative w-full h-40 rounded-2xl overflow-hidden mb-2 bg-slate-100 border border-slate-200">
              <Image source={{ uri: selectedImage }} className="w-full h-full" resizeMode="cover" />
              <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-md flex-row items-center">
                <Upload size={12} color="#ffffff" />
                <Text className="text-[10px] text-white font-bold ml-1">Selected Cover Photo</Text>
              </View>
            </View>

            <Text className="text-[11px] text-slate-500 mb-1.5">Choose from uploaded demonstration photos:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sampleImages.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedImage(img)}
                  className={`mr-2 rounded-xl overflow-hidden border-2 ${
                    selectedImage === img ? 'border-blue-600' : 'border-slate-200'
                  }`}
                >
                  <Image source={{ uri: img }} className="w-16 h-12" resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Video Tour Toggle */}
            <TouchableOpacity
              onPress={() => setHasVideo(!hasVideo)}
              className="flex-row items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 mt-3"
            >
              <View className="flex-row items-center">
                <Video size={16} color="#2563eb" />
                <Text className="text-xs font-semibold text-slate-800 ml-2">Attach Video Tour</Text>
              </View>
              <Text className={`text-xs font-bold ${hasVideo ? 'text-blue-600' : 'text-slate-400'}`}>
                {hasVideo ? 'ENABLED' : 'DISABLED'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View className="mb-3">
            <Text className="text-xs font-medium text-slate-600 mb-1">Listing Headline</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Spacious 3 BHK Sea View Apartment"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
            />
          </View>

          {/* Property Type & BHK */}
          <View className="flex-row space-x-3 mb-3">
            <View className="flex-1 mr-2">
              <Text className="text-xs font-medium text-slate-600 mb-1">Property Type</Text>
              <TextInput
                value={type}
                onChangeText={(t) => setType(t as any)}
                placeholder="Apartment / Villa / Studio"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
              />
            </View>

            <View className="w-24">
              <Text className="text-xs font-medium text-slate-600 mb-1">BHK</Text>
              <View className="flex-row bg-slate-50 border border-slate-200 rounded-xl py-1 px-1 justify-around">
                {[1, 2, 3, 4].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setBhk(num)}
                    className={`px-2 py-1 rounded-lg ${bhk === num ? 'bg-blue-600' : ''}`}
                  >
                    <Text className={`text-xs font-bold ${bhk === num ? 'text-white' : 'text-slate-600'}`}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Pricing Row */}
          <View className="flex-row space-x-3 mb-3">
            <View className="flex-1 mr-2">
              <Text className="text-xs font-medium text-slate-600 mb-1">Monthly Rent (₹)</Text>
              <TextInput
                value={rent}
                onChangeText={setRent}
                placeholder="e.g. 35000"
                keyboardType="numeric"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
              />
            </View>

            <View className="flex-1">
              <Text className="text-xs font-medium text-slate-600 mb-1">Security Deposit (₹)</Text>
              <TextInput
                value={deposit}
                onChangeText={setDeposit}
                placeholder="e.g. 100000"
                keyboardType="numeric"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
              />
            </View>
          </View>

          {/* Area & Furnishing */}
          <View className="flex-row space-x-3 mb-3">
            <View className="flex-1 mr-2">
              <Text className="text-xs font-medium text-slate-600 mb-1">Area (sq.ft)</Text>
              <TextInput
                value={areaSqft}
                onChangeText={setAreaSqft}
                placeholder="e.g. 1450"
                keyboardType="numeric"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
              />
            </View>

            <View className="flex-1">
              <Text className="text-xs font-medium text-slate-600 mb-1">Furnishing</Text>
              <TextInput
                value={furnishing}
                onChangeText={(f) => setFurnishing(f as any)}
                placeholder="Fully Furnished"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
              />
            </View>
          </View>

          {/* Location & City */}
          <View className="mb-3">
            <Text className="text-xs font-medium text-slate-600 mb-1">City</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
              {indianCities.filter((c) => c !== 'All Cities').map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCity(c)}
                  className={`px-3 py-1.5 rounded-xl mr-2 border ${
                    city === c ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <Text className={`text-xs font-semibold ${city === c ? 'text-white' : 'text-slate-700'}`}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="mb-3">
            <Text className="text-xs font-medium text-slate-600 mb-1">Locality / Landmark</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Indiranagar, Near Metro Station"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
            />
          </View>

          <View className="mb-3">
            <Text className="text-xs font-medium text-slate-600 mb-1">Full Property Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Tower, Floor, Building name, Pin code"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900"
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-slate-600 mb-1">Property Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the property highlights, sunlight, ventilation, and nearby conveniences..."
              multiline
              numberOfLines={3}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900"
            />
          </View>

          {/* Amenities Selector */}
          <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Select Included Amenities
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {allAmenitiesList.map((amenity) => {
              const selected = selectedAmenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={amenity}
                  onPress={() => toggleAmenity(amenity)}
                  className={`flex-row items-center px-3 py-1.5 rounded-full border mr-2 mb-2 ${
                    selected ? 'bg-blue-50 border-blue-600' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {selected && <CheckCircle2 size={12} color="#2563eb" className="mr-1" />}
                  <Text className={`text-xs ${selected ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>
                    {amenity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Publish Button */}
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.85}
            className="bg-blue-600 py-4 rounded-2xl items-center shadow-md shadow-blue-500/25 mb-8"
          >
            <Text className="text-white font-bold text-base">Publish Property Listing</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};
