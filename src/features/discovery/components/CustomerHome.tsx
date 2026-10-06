import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  ArrowLeft,
  Bell,
  Building2,
  ChevronDown,
  DoorOpen,
  Heart,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trees,
  Warehouse,
  X,
} from 'lucide-react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';

import { FilterState, Property } from '../../../types';
import { PropertyCard } from './PropertyCard';
import { LocationPickerModal } from '../../../shared/components/LocationPickerModal';

interface CustomerHomeProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenFilter: () => void;
  filters: FilterState;
  onUpdateFilters?: (filters: FilterState) => void;
  onClearFilters: () => void;
  favoriteIds: string[];
  onToggleFavorite: (propertyId: string) => void;
  onGoBack?: () => void;
  mode?: 'home' | 'results' | 'saved';
}

const CATEGORY_TILES = [
  { id: 'All', label: 'All', Icon: SlidersHorizontal },
  { id: 'Apartment', label: 'Apartment', Icon: Building2 },
  { id: 'Villa', label: 'Villa', Icon: Home },
  { id: 'Plot', label: 'Plot', Icon: Trees },
  { id: 'Bungalow', label: 'Bungalow', Icon: Warehouse },
  { id: 'Studio Apartment', label: 'Studio', Icon: DoorOpen },
];

const cityImages = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=300&q=80',
];

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  properties,
  onSelectProperty,
  onOpenFilter,
  filters,
  onUpdateFilters,
  onClearFilters,
  favoriteIds,
  onToggleFavorite,
  onGoBack,
  mode = 'home',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const isSaved = mode === 'saved';
  const isResults = mode === 'results' || isSaved;

  const visibleProperties = useMemo(
    () =>
      properties.filter((property) => {
        const search = (filters.searchQuery || searchQuery).trim().toLowerCase();
        const matchesSearch =
          !search ||
          [property.title, property.location, property.city, property.builderName].some((value) =>
            value.toLowerCase().includes(search)
          );
        return (
          property.status === 'ACTIVE' &&
          matchesSearch &&
          (selectedCity === 'All Cities' || property.city.toLowerCase() === selectedCity.toLowerCase()) &&
          (selectedType === 'All' || property.type === selectedType || (selectedType === 'Studio Apartment' && property.type.includes('Studio'))) &&
          (filters.city === 'All Cities' ||
            filters.city === 'New Delhi, India' ||
            property.city.toLowerCase() === filters.city.toLowerCase() ||
            filters.city.toLowerCase().includes(property.city.toLowerCase())) &&
          (filters.propertyType === 'All' ||
            property.type.toLowerCase() === filters.propertyType.toLowerCase() ||
            (filters.propertyType === 'Studio' && property.type.includes('Studio'))) &&
          (filters.bhk === null || property.bhk === filters.bhk) &&
          (filters.minRent == null || property.rent >= filters.minRent) &&
          (filters.maxRent == null || property.rent <= filters.maxRent) &&
          (filters.minArea == null || property.areaSqft >= filters.minArea) &&
          (filters.maxArea == null || property.areaSqft <= filters.maxArea) &&
          (filters.furnishing === 'All' || property.furnishing === filters.furnishing) &&
          (filters.selectedAmenities.length === 0 ||
            filters.selectedAmenities.every((item) =>
              property.amenities.some((a) => a.toLowerCase().includes(item.toLowerCase()))
            )) &&
          (!isSaved || favoriteIds.includes(property.id))
        );
      }),
    [favoriteIds, filters, isSaved, properties, searchQuery, selectedCity, selectedType]
  );

  const resetAll = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setSelectedType('All');
    onClearFilters();
  };

  const searchBox = (
    <View className="flex-row items-center bg-white rounded-full border border-slate-100/90 px-4 py-2.5 shadow-xl shadow-slate-200/50 mt-2 mb-3">
      <Search size={20} color="#1e293b" />
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by location, society or property..."
        placeholderTextColor="#94a3b8"
        className="flex-1 text-sm font-medium text-slate-900 ml-3 py-1.5 p-0"
      />
      {searchQuery ? (
        <TouchableOpacity onPress={() => setSearchQuery('')} className="mr-1">
          <X size={16} color="#64748b" />
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        onPress={onOpenFilter}
        activeOpacity={0.8}
        className="w-10 h-10 rounded-full bg-slate-100/90 items-center justify-center ml-2"
        accessibilityLabel="Open filters"
      >
        <SlidersHorizontal size={18} color="#0f172a" />
      </TouchableOpacity>
    </View>
  );

  // Explore Results Mode View
  if (isResults) {
    return (
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Explore Top Navigation Header */}
        <View className="px-5 pt-4 pb-3 border-b border-slate-100">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={onGoBack || resetAll}
              activeOpacity={0.7}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={18} color="#0f172a" />
            </TouchableOpacity>

            <Text className="flex-1 text-center text-lg font-bold text-slate-950">
              {isSaved ? 'Favorites' : 'Explore Properties'}
            </Text>

            <View className="w-9 h-9" />
          </View>

          {/* Search Input Bar with Filter Button Trigger */}
          {searchBox}

          {/* Horizontal Category Cards matching Mockup */}
          {!isSaved && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3.5 -mx-1 px-1">
              {CATEGORY_TILES.map(({ id, label, Icon }) => {
                const isSelected = selectedType === id;
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => setSelectedType(id)}
                    activeOpacity={0.8}
                    className={`w-20 h-16 rounded-2xl items-center justify-center mr-2.5 border ${
                      isSelected
                        ? 'bg-slate-950 border-slate-950 shadow-xs'
                        : 'bg-slate-100/70 border-slate-200/30'
                    }`}
                  >
                    <Icon size={18} color={isSelected ? '#ffffff' : '#1e293b'} />
                    <Text
                      className={`text-xs font-semibold mt-1 ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Property List Results */}
        <View className="px-5 pt-4">
          <View className="mb-3">
            <Text className="text-sm font-bold text-slate-900">
              {visibleProperties.length} {visibleProperties.length === 1 ? 'Property' : 'Properties'} Found
            </Text>
          </View>

          {visibleProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="list"
              onPress={() => onSelectProperty(property)}
              isFavorite={favoriteIds.includes(property.id)}
              onFavoriteToggle={() => onToggleFavorite(property.id)}
            />
          ))}

          {!visibleProperties.length && (
            <View className="items-center py-20">
              <Heart size={30} color="#cbd5e1" />
              <Text className="mt-3 text-base font-bold text-slate-900">
                {isSaved ? 'No saved properties yet' : 'No properties found'}
              </Text>
              <TouchableOpacity onPress={resetAll} className="mt-4 bg-slate-950 px-5 py-3 rounded-2xl">
                <Text className="text-white text-xs font-bold">Reset filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  const featured = visibleProperties.slice(0, 3);
  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="px-5 pt-4">
        {/* Location & Bell Header */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => setShowLocationModal(true)} activeOpacity={0.75}>
            <Text className="text-xs text-slate-500 font-medium">Location</Text>
            <View className="flex-row items-center mt-0.5">
              <MapPin size={16} color="#111827" fill="#111827" />
              <Text className="text-sm font-bold text-slate-950 ml-1 mr-1">
                {filters.city || 'New Delhi, India'}
              </Text>
              <ChevronDown size={16} color="#111827" />
            </View>
          </TouchableOpacity>
          <View className="relative w-11 h-11 rounded-full bg-slate-50 items-center justify-center">
            <Bell size={20} color="#111827" />
            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </View>
        </View>

        {/* LocationPickerModal */}
        <LocationPickerModal
          visible={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          selectedCity={filters.city || 'New Delhi, India'}
          onSelectCity={(city) => {
            setSelectedCity(city);
            if (onUpdateFilters) {
              onUpdateFilters({ ...filters, city });
            } else {
              filters.city = city;
            }
          }}
        />

        {/* Hero Arch Section (Fully Blended into White Background as shown in Mockup) */}
        <View className="relative h-56 mb-1 justify-center overflow-hidden">
          {/* Right-Side Arch House Image with SVG Linear Gradient Mask */}
          <View className="absolute right-0 top-0 bottom-0 w-[58%] overflow-hidden rounded-t-[140px] rounded-bl-[60px]">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* SVG Left-to-Right Fade Gradient Overlay into White */}
            <View className="absolute inset-0">
              <Svg height="100%" width="100%">
                <Defs>
                  <SvgGradient id="heroLeftFade" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
                    <Stop offset="0.35" stopColor="#ffffff" stopOpacity="0.8" />
                    <Stop offset="0.75" stopColor="#ffffff" stopOpacity="0.15" />
                    <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                  </SvgGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroLeftFade)" />
              </Svg>
            </View>
          </View>

          {/* Left-Side Typography */}
          <View className="pr-4 max-w-[60%] justify-center z-10">
            <Text className="text-xl font-medium text-slate-400 tracking-tight">Hey There 👋</Text>
            <Text className="text-[32px] font-black text-slate-950 mt-1 leading-[38px] tracking-tight">
              Find Your{`\n`}Dream Home
            </Text>
            <Text className="text-xs font-normal text-slate-500 mt-2 leading-relaxed">
              Discover the best properties for rent across top locations.
            </Text>
          </View>
        </View>

        {/* Rounded Pill Search Input Bar */}
        {searchBox}

        {/* Category Horizontal Quick Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          {CATEGORY_TILES.map(({ id, label, Icon }) => {
            const isSelected = selectedType === id;
            return (
              <TouchableOpacity
                key={id}
                onPress={() => setSelectedType(id)}
                activeOpacity={0.8}
                className={`w-20 h-16 mr-2 rounded-2xl items-center justify-center border ${
                  isSelected
                    ? 'bg-slate-950 border-slate-950'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Icon size={20} color={isSelected ? '#ffffff' : '#111827'} />
                <Text
                  className={`text-[10px] mt-1 font-bold ${
                    isSelected ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Recommended Properties */}
      <View className="mt-6">
        <View className="px-5 flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-slate-950">Recommended Properties</Text>
          <Text className="text-sm text-slate-500">See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {featured.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="grid"
              onPress={() => onSelectProperty(property)}
              isFavorite={favoriteIds.includes(property.id)}
              onFavoriteToggle={() => onToggleFavorite(property.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Popular Locations */}
      <View className="mt-6">
        <View className="px-5 flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-slate-950">Popular Locations</Text>
          <Sparkles size={17} color="#111827" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {['Delhi', 'Gurugram', 'Noida', 'Greater Noida'].map((city, index) => (
            <TouchableOpacity
              key={city}
              onPress={() => setSelectedCity(city === 'Greater Noida' ? 'All Cities' : city)}
              className="relative w-24 h-24 mr-2 overflow-hidden rounded-2xl bg-slate-200"
            >
              <Image source={{ uri: cityImages[index] }} className="w-full h-full" resizeMode="cover" />
              <View className="absolute inset-x-0 bottom-0 px-2 py-2 bg-black/45">
                <Text className="text-xs font-bold text-white">{city}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View className="h-8" />
    </ScrollView>
  );
};
