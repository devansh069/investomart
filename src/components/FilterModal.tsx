import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { FilterState } from '../types';
import { indianCities, allAmenitiesList } from '../mock/data';
import { X, RotateCcw } from 'lucide-react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const propertyTypes = ['All', 'Apartment', 'Villa', 'Studio Apartment', 'Penthouse'];
  const bhkOptions = [
    { label: 'All', value: null },
    { label: '1 BHK', value: 1 },
    { label: '2 BHK', value: 2 },
    { label: '3 BHK', value: 3 },
    { label: '4+ BHK', value: 4 },
  ];
  const budgetOptions = [
    { label: 'Any', value: null },
    { label: 'Under ₹25k', value: 25000 },
    { label: 'Under ₹50k', value: 50000 },
    { label: 'Under ₹1 Lakh', value: 100000 },
  ];
  const furnishingOptions = ['All', 'Fully Furnished', 'Semi-Furnished', 'Unfurnished'];

  const toggleAmenity = (amenity: string) => {
    const exists = localFilters.selectedAmenities.includes(amenity);
    if (exists) {
      setLocalFilters({
        ...localFilters,
        selectedAmenities: localFilters.selectedAmenities.filter((a) => a !== amenity),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        selectedAmenities: [...localFilters.selectedAmenities, amenity],
      });
    }
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 max-h-[90%] shadow-2xl border-t border-slate-100">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
            <Text className="text-lg font-black text-slate-900">Filter Properties</Text>
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity
                onPress={() => {
                  onResetFilters();
                  onClose();
                }}
                className="flex-row items-center px-3 py-1.5 rounded-full bg-slate-100 mr-2"
              >
                <RotateCcw size={12} color="#64748b" />
                <Text className="text-xs font-semibold text-slate-600 ml-1">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="pt-4">
            {/* City Selection */}
            <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              City / Location
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {indianCities.map((city) => {
                const isActive = localFilters.city === city;
                return (
                  <TouchableOpacity
                    key={city}
                    onPress={() => setLocalFilters({ ...localFilters, city })}
                    className={`px-3.5 py-1.5 rounded-xl mr-2 border ${
                      isActive ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* BHK Configuration */}
            <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              BHK Configuration
            </Text>
            <View className="flex-row space-x-2 mb-4">
              {bhkOptions.map((opt) => {
                const isActive = localFilters.bhk === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    onPress={() => setLocalFilters({ ...localFilters, bhk: opt.value })}
                    className={`flex-1 py-2 rounded-xl border items-center mr-1.5 ${
                      isActive ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Monthly Rent Budget */}
            <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Monthly Budget
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {budgetOptions.map((opt) => {
                const isActive = localFilters.maxRent === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    onPress={() => setLocalFilters({ ...localFilters, maxRent: opt.value })}
                    className={`px-3 py-2 rounded-xl border mr-2 mb-2 ${
                      isActive ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Property Type */}
            <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Property Type
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {propertyTypes.map((type) => {
                const isActive = localFilters.propertyType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setLocalFilters({ ...localFilters, propertyType: type })}
                    className={`px-3 py-1.5 rounded-xl border mr-2 mb-2 ${
                      isActive ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Furnishing */}
            <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Furnishing State
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {furnishingOptions.map((f) => {
                const isActive = localFilters.furnishing === f;
                return (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setLocalFilters({ ...localFilters, furnishing: f })}
                    className={`px-3 py-1.5 rounded-xl border mr-2 mb-2 ${
                      isActive ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Amenities Checklist */}
            <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Desired Amenities
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {allAmenitiesList.map((amenity) => {
                const isSelected = localFilters.selectedAmenities.includes(amenity);
                return (
                  <TouchableOpacity
                    key={amenity}
                    onPress={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full border mr-2 mb-2 ${
                      isSelected ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? 'text-emerald-700 font-bold' : 'text-slate-600'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{amenity}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              onPress={handleApply}
              activeOpacity={0.85}
              className="bg-blue-600 py-3.5 rounded-2xl items-center shadow-md shadow-blue-500/25 mb-4"
            >
              <Text className="text-white font-bold text-sm">Apply Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
