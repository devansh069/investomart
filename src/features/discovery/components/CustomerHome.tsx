import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Bell, Building2, Heart, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react-native';

import { FilterState, Property } from '../../../types';
import { indianCities } from '../../../mock/data';
import { PropertyCard } from './PropertyCard';

interface CustomerHomeProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenFilter: () => void;
  filters: FilterState;
  onClearFilters: () => void;
  favoriteIds: string[];
  onToggleFavorite: (propertyId: string) => void;
  mode?: 'home' | 'results' | 'saved';
}

const propertyTypes = ['All', 'Apartment', 'Villa', 'Independent House', 'Studio Apartment'];
const cityImages = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=300&q=80',
];

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  properties, onSelectProperty, onOpenFilter, filters, onClearFilters, favoriteIds, onToggleFavorite, mode = 'home',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All');
  const isSaved = mode === 'saved';
  const isResults = mode === 'results' || isSaved;

  const visibleProperties = useMemo(() => properties.filter((property) => {
    const search = searchQuery.trim().toLowerCase();
    const matchesSearch = !search || [property.title, property.location, property.city, property.builderName]
      .some((value) => value.toLowerCase().includes(search));
    return property.status === 'ACTIVE' && matchesSearch &&
      (selectedCity === 'All Cities' || property.city.toLowerCase() === selectedCity.toLowerCase()) &&
      (selectedType === 'All' || property.type === selectedType) &&
      (filters.city === 'All Cities' || property.city.toLowerCase() === filters.city.toLowerCase()) &&
      (filters.propertyType === 'All' || property.type === filters.propertyType) &&
      (filters.bhk === null || property.bhk === filters.bhk) &&
      (filters.maxRent === null || property.rent <= filters.maxRent) &&
      (filters.furnishing === 'All' || property.furnishing === filters.furnishing) &&
      (filters.selectedAmenities.length === 0 || filters.selectedAmenities.every((item) => property.amenities.includes(item))) &&
      (!isSaved || favoriteIds.includes(property.id));
  }), [favoriteIds, filters, isSaved, properties, searchQuery, selectedCity, selectedType]);

  const resetAll = () => { setSearchQuery(''); setSelectedCity('All Cities'); setSelectedType('All'); onClearFilters(); };

  const searchBox = <View className="flex-row items-center bg-white rounded-2xl border border-slate-200 px-4 py-1.5 shadow-xs">
    <Search size={19} color="#111827" />
    <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search by location, society or property..." placeholderTextColor="#9ca3af" className="flex-1 text-sm text-slate-900 ml-2.5 py-2.5" />
    {searchQuery ? <TouchableOpacity onPress={() => setSearchQuery('')}><X size={17} color="#6b7280" /></TouchableOpacity> : null}
    <TouchableOpacity onPress={onOpenFilter} className="ml-2 p-1.5" accessibilityLabel="Open filters"><SlidersHorizontal size={19} color="#111827" /></TouchableOpacity>
  </View>;

  if (isResults) {
    return <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="px-5 pt-4 pb-3 border-b border-slate-100">
        <View className="flex-row items-center mb-4"><View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center"><Search size={19} color="#111827" /></View><Text className="flex-1 text-center text-lg font-bold text-slate-950">{isSaved ? 'Favorites' : 'Explore Properties'}</Text><TouchableOpacity onPress={onOpenFilter} className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center"><SlidersHorizontal size={18} color="#111827" /></TouchableOpacity></View>
        {searchBox}
        {!isSaved && <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3"><TouchableOpacity onPress={() => setSelectedType('All')} className={`mr-2 px-4 py-2 rounded-xl ${selectedType === 'All' ? 'bg-slate-950' : 'bg-slate-100'}`}><Text className={`text-xs font-bold ${selectedType === 'All' ? 'text-white' : 'text-slate-700'}`}>All</Text></TouchableOpacity>{propertyTypes.slice(1).map((type) => <TouchableOpacity key={type} onPress={() => setSelectedType(type)} className={`mr-2 px-4 py-2 rounded-xl ${selectedType === type ? 'bg-slate-950' : 'bg-slate-100'}`}><Text className={`text-xs font-bold ${selectedType === type ? 'text-white' : 'text-slate-700'}`}>{type}</Text></TouchableOpacity>)}</ScrollView>}
      </View>
      <View className="px-5 pt-4"><View className="flex-row justify-between mb-3"><Text className="text-sm font-semibold text-slate-700">{visibleProperties.length} Properties Found</Text><Text className="text-sm font-semibold text-slate-700">Sort by: Relevance</Text></View>{visibleProperties.map((property) => <PropertyCard key={property.id} property={property} variant="list" onPress={() => onSelectProperty(property)} isFavorite={favoriteIds.includes(property.id)} onFavoriteToggle={() => onToggleFavorite(property.id)} />)}{!visibleProperties.length && <View className="items-center py-20"><Heart size={30} color="#cbd5e1" /><Text className="mt-3 text-base font-bold text-slate-900">{isSaved ? 'No saved properties yet' : 'No properties found'}</Text><TouchableOpacity onPress={resetAll} className="mt-4 bg-slate-950 px-5 py-3 rounded-2xl"><Text className="text-white text-xs font-bold">Reset filters</Text></TouchableOpacity></View>}</View>
    </ScrollView>;
  }

  const featured = visibleProperties.slice(0, 3);
  return <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
    <View className="px-5 pt-4">
      <View className="flex-row items-center justify-between mb-5"><View><Text className="text-xs text-slate-500">Location</Text><View className="flex-row items-center mt-0.5"><MapPin size={16} color="#111827" fill="#111827" /><Text className="text-sm font-bold text-slate-950 ml-1">New Delhi, India</Text></View></View><View className="relative w-11 h-11 rounded-full bg-slate-50 items-center justify-center"><Bell size={20} color="#111827" /><View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" /></View></View>
      <View className="relative h-44 mb-4 overflow-hidden rounded-3xl bg-slate-100"><Image source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=90' }} className="absolute w-full h-full" resizeMode="cover" /><View className="absolute inset-0 bg-white/75" /><View className="p-5"><Text className="text-xl text-slate-500 font-medium">Hey There 👋</Text><Text className="text-3xl leading-9 font-black text-slate-950 mt-1">Find Your{`\n`}Dream Home</Text><Text className="text-xs text-slate-600 mt-1.5 max-w-[55%]">Discover the best properties for rent across top locations.</Text></View></View>
      {searchBox}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4"><TouchableOpacity onPress={() => setSelectedType('All')} className={`w-16 h-16 mr-2 rounded-2xl items-center justify-center ${selectedType === 'All' ? 'bg-slate-950' : 'bg-slate-50 border border-slate-200'}`}><Building2 size={21} color={selectedType === 'All' ? '#ffffff' : '#111827'} /><Text className={`text-[10px] mt-1 font-bold ${selectedType === 'All' ? 'text-white' : 'text-slate-700'}`}>All</Text></TouchableOpacity>{propertyTypes.slice(1).map((type) => <TouchableOpacity key={type} onPress={() => setSelectedType(type)} className={`w-20 h-16 mr-2 rounded-2xl items-center justify-center ${selectedType === type ? 'bg-slate-950' : 'bg-slate-50 border border-slate-200'}`}><Building2 size={20} color={selectedType === type ? '#ffffff' : '#111827'} /><Text numberOfLines={1} className={`text-[10px] mt-1 font-bold ${selectedType === type ? 'text-white' : 'text-slate-700'}`}>{type === 'Independent House' ? 'House' : type}</Text></TouchableOpacity>)}</ScrollView>
    </View>
    <View className="mt-6"><View className="px-5 flex-row justify-between items-center mb-3"><Text className="text-lg font-bold text-slate-950">Recommended Properties</Text><Text className="text-sm text-slate-500">See all</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>{featured.map((property) => <PropertyCard key={property.id} property={property} variant="grid" onPress={() => onSelectProperty(property)} isFavorite={favoriteIds.includes(property.id)} onFavoriteToggle={() => onToggleFavorite(property.id)} />)}</ScrollView></View>
    <View className="mt-6"><View className="px-5 flex-row justify-between items-center mb-3"><Text className="text-lg font-bold text-slate-950">Popular Locations</Text><Sparkles size={17} color="#111827" /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>{['Delhi', 'Gurugram', 'Noida', 'Greater Noida'].map((city, index) => <TouchableOpacity key={city} onPress={() => setSelectedCity(city === 'Greater Noida' ? 'All Cities' : city)} className="relative w-24 h-24 mr-2 overflow-hidden rounded-2xl bg-slate-200"><Image source={{ uri: cityImages[index] }} className="w-full h-full" resizeMode="cover" /><View className="absolute inset-x-0 bottom-0 px-2 py-2 bg-black/45"><Text className="text-xs font-bold text-white">{city}</Text></View></TouchableOpacity>)}</ScrollView></View>
    <View className="h-8" />
  </ScrollView>;
};
