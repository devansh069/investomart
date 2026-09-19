import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Property, FilterState } from '../types';
import { PropertyCard } from './PropertyCard';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react-native';
import { indianCities } from '../mock/data';

interface CustomerHomeProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenFilter: () => void;
  filters: FilterState;
  onClearFilters: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  properties,
  onSelectProperty,
  onOpenFilter,
  filters,
  onClearFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedBhk, setSelectedBhk] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Filter pipeline
  const filteredProperties = properties.filter((prop) => {
    // Search query
    const matchesSearch =
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.builderName.toLowerCase().includes(searchQuery.toLowerCase());

    // City pill
    const matchesCityPill = selectedCity === 'All Cities' || prop.city.toLowerCase() === selectedCity.toLowerCase();

    // BHK chip
    const matchesBhkPill = selectedBhk === null || prop.bhk === selectedBhk;

    // Advanced Modal Filters
    const matchesModalCity = filters.city === 'All Cities' || prop.city.toLowerCase() === filters.city.toLowerCase();
    const matchesModalType = filters.propertyType === 'All' || prop.type === filters.propertyType;
    const matchesModalBhk = filters.bhk === null || prop.bhk === filters.bhk;
    const matchesModalRent = filters.maxRent === null || prop.rent <= filters.maxRent;
    const matchesModalFurnishing = filters.furnishing === 'All' || prop.furnishing === filters.furnishing;
    const matchesModalAmenities =
      filters.selectedAmenities.length === 0 ||
      filters.selectedAmenities.every((am) => prop.amenities.includes(am));

    return (
      matchesSearch &&
      matchesCityPill &&
      matchesBhkPill &&
      matchesModalCity &&
      matchesModalType &&
      matchesModalBhk &&
      matchesModalRent &&
      matchesModalFurnishing &&
      matchesModalAmenities
    );
  });

  const hasActiveAdvancedFilters =
    filters.city !== 'All Cities' ||
    filters.propertyType !== 'All' ||
    filters.bhk !== null ||
    filters.maxRent !== null ||
    filters.furnishing !== 'All' ||
    filters.selectedAmenities.length > 0;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Search and Filter Top Header */}
      <View className="bg-white px-5 pt-3 pb-3 border-b border-slate-100 shadow-2xs">
        <View className="flex-row items-center space-x-2">
          {/* Search Input Box */}
          <View className="flex-1 flex-row items-center bg-slate-100 rounded-2xl px-3.5 py-2.5 mr-2">
            <Search size={16} color="#64748b" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by city, locality, builder..."
              placeholderTextColor="#94a3b8"
              className="flex-1 text-sm text-slate-900 ml-2"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={15} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={onOpenFilter}
            className={`w-11 h-11 rounded-2xl items-center justify-center border relative ${
              hasActiveAdvancedFilters ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <SlidersHorizontal size={18} color={hasActiveAdvancedFilters ? '#ffffff' : '#475569'} />
            {hasActiveAdvancedFilters && (
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-2 right-2 border-2 border-blue-600" />
            )}
          </TouchableOpacity>
        </View>

        {/* City Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {indianCities.map((city) => {
            const isActive = selectedCity === city;
            return (
              <TouchableOpacity
                key={city}
                onPress={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-xl mr-2 border ${
                  isActive ? 'bg-blue-600 border-blue-600 shadow-xs' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-700'}`}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Quick BHK Selection Pills */}
        <View className="flex-row items-center mt-2.5 pt-2 border-t border-slate-100">
          <Text className="text-[11px] font-bold text-slate-400 uppercase mr-2">BHK:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { label: 'All', val: null },
              { label: '1 BHK', val: 1 },
              { label: '2 BHK', val: 2 },
              { label: '3 BHK', val: 3 },
              { label: '4+ BHK', val: 4 },
            ].map((b) => {
              const isActive = selectedBhk === b.val;
              return (
                <TouchableOpacity
                  key={b.label}
                  onPress={() => setSelectedBhk(b.val)}
                  className={`px-2.5 py-1 rounded-lg mr-1.5 border ${
                    isActive ? 'bg-slate-900 border-slate-900' : 'bg-slate-100 border-slate-200/80'
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${isActive ? 'text-white' : 'text-slate-600'}`}
                  >
                    {b.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {hasActiveAdvancedFilters && (
            <TouchableOpacity
              onPress={onClearFilters}
              className="flex-row items-center px-2 py-1 rounded-md bg-red-50 border border-red-200"
            >
              <Text className="text-[10px] font-bold text-red-600 mr-1">Clear Filters</Text>
              <X size={10} color="#dc2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Properties Feed */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 pt-4">
        {/* Count banner */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Available Rental Properties ({filteredProperties.length})
          </Text>
          <View className="flex-row items-center">
            <Sparkles size={12} color="#2563eb" />
            <Text className="text-xs text-blue-600 font-semibold ml-1">Verified Listings</Text>
          </View>
        </View>

        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onPress={() => onSelectProperty(prop)}
              isFavorite={favorites.includes(prop.id)}
              onFavoriteToggle={() => toggleFavorite(prop.id)}
            />
          ))
        ) : (
          <View className="py-20 items-center justify-center">
            <View className="w-14 h-14 rounded-full bg-slate-100 items-center justify-center mb-3">
              <Search size={24} color="#94a3b8" />
            </View>
            <Text className="text-base font-bold text-slate-800">No properties match your filters</Text>
            <Text className="text-xs text-slate-500 text-center max-w-xs mt-1">
              Try adjusting your city, budget, or BHK configuration to see more available rentals.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSelectedCity('All Cities');
                setSelectedBhk(null);
                onClearFilters();
              }}
              className="mt-4 bg-blue-600 px-4 py-2 rounded-xl"
            >
              <Text className="text-xs font-bold text-white">Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-12" />
      </ScrollView>
    </View>
  );
};
