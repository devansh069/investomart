import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  MapPin,
  Home,
  Building2,
  Warehouse,
  Trees,
  DoorOpen,
  Wallet,
  BedDouble,
  Bath,
  Maximize2,
  Star,
  Car,
  Sofa,
  Building,
  ShieldCheck,
  Plus,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { FilterState, Property } from '../../../types';
import { LocationPickerModal } from '../../../shared/components/LocationPickerModal';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  allProperties?: Property[];
}

const PROPERTY_TYPES = [
  { id: 'Apartment', label: 'Apartment', Icon: Building2 },
  { id: 'Villa', label: 'Villa', Icon: Home },
  { id: 'Bungalow', label: 'Bungalow', Icon: Warehouse },
  { id: 'Plot', label: 'Plot', Icon: Trees },
  { id: 'Studio', label: 'Studio', Icon: DoorOpen },
];

const BEDROOM_OPTIONS = [
  { label: 'Any', value: null },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4+', value: 4 },
];

const BATHROOM_OPTIONS = [
  { label: 'Any', value: null },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4+', value: 4 },
];

const INITIAL_AMENITIES = [
  { name: 'Parking', Icon: Car },
  { name: 'Furnished', Icon: Sofa },
  { name: 'Lift', Icon: Building },
  { name: 'Security', Icon: ShieldCheck },
];

const MORE_AMENITIES = [
  'Power Backup',
  'Swimming Pool',
  'Clubhouse & Gym',
  'EV Charging Station',
  'Private Garden',
  'Pet Friendly',
  'High Speed WiFi',
  'CCTV Surveillance',
];

interface SliderProps {
  min: number;
  max: number;
  low: number;
  high: number;
  step?: number;
  leftLabel: string;
  rightLabel: string;
  onChange: (low: number, high: number) => void;
}

const PanResponderRangeSlider: React.FC<SliderProps> = ({
  min,
  max,
  low,
  high,
  step = 1000,
  leftLabel,
  rightLabel,
  onChange,
}) => {
  const [trackWidth, setTrackWidth] = useState<number>(300);
  const activeThumbRef = useRef<'low' | 'high' | null>(null);
  const initialValuesRef = useRef<{ low: number; high: number }>({ low, high });

  useEffect(() => {
    initialValuesRef.current = { low, high };
  }, [low, high]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (evt) => {
          const touchX = evt.nativeEvent.locationX;
          const width = trackWidth || 300;
          const currentLow = initialValuesRef.current.low;
          const currentHigh = initialValuesRef.current.high;

          const lowX = ((currentLow - min) / (max - min)) * width;
          const highX = ((currentHigh - min) / (max - min)) * width;

          const distToLow = Math.abs(touchX - lowX);
          const distToHigh = Math.abs(touchX - highX);

          if (distToLow <= distToHigh) {
            activeThumbRef.current = 'low';
          } else {
            activeThumbRef.current = 'high';
          }
        },
        onPanResponderMove: (_, gestureState) => {
          const width = trackWidth || 300;
          const deltaRatio = gestureState.dx / width;
          const deltaVal = deltaRatio * (max - min);

          const startLow = initialValuesRef.current.low;
          const startHigh = initialValuesRef.current.high;

          if (activeThumbRef.current === 'low') {
            let nextLow = Math.round((startLow + deltaVal) / step) * step;
            nextLow = Math.max(min, Math.min(startHigh - step, nextLow));
            onChange(nextLow, startHigh);
          } else if (activeThumbRef.current === 'high') {
            let nextHigh = Math.round((startHigh + deltaVal) / step) * step;
            nextHigh = Math.min(max, Math.max(startLow + step, nextHigh));
            onChange(startLow, nextHigh);
          }
        },
        onPanResponderRelease: () => {
          activeThumbRef.current = null;
        },
        onPanResponderTerminate: () => {
          activeThumbRef.current = null;
        },
      }),
    [min, max, step, trackWidth, onChange]
  );

  const lowPercent = Math.max(0, Math.min(100, ((low - min) / (max - min)) * 100));
  const highPercent = Math.max(0, Math.min(100, ((high - min) / (max - min)) * 100));

  return (
    <View className="mb-4">
      {/* Interactive Slider Track Container */}
      <View
        {...panResponder.panHandlers}
        onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
        className="h-12 justify-center py-2 relative"
      >
        {/* Track Line */}
        <View className="h-1.5 bg-slate-200 rounded-full w-full relative justify-center">
          {/* Filled Range Bar */}
          <View
            className="absolute h-1.5 bg-slate-950 rounded-full"
            style={{
              left: `${lowPercent}%`,
              width: `${Math.max(1, highPercent - lowPercent)}%`,
            }}
          />

          {/* Left Knob */}
          <View
            className="w-7 h-7 rounded-full bg-white border-2 border-slate-950 shadow-md absolute -top-2.5 items-center justify-center"
            style={{ left: `${lowPercent}%`, transform: [{ translateX: -14 }] }}
          >
            <View className="w-2 h-2 rounded-full bg-slate-950" />
          </View>

          {/* Right Knob */}
          <View
            className="w-7 h-7 rounded-full bg-white border-2 border-slate-950 shadow-md absolute -top-2.5 items-center justify-center"
            style={{ left: `${highPercent}%`, transform: [{ translateX: -14 }] }}
          >
            <View className="w-2 h-2 rounded-full bg-slate-950" />
          </View>
        </View>
      </View>

      {/* Range Labels Below Track */}
      <View className="flex-row justify-between items-center -mt-1">
        <Text className="text-xs font-bold text-slate-800">{leftLabel}</Text>
        <Text className="text-xs font-bold text-slate-800">{rightLabel}</Text>
      </View>
    </View>
  );
};

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  allProperties = [],
}) => {
  const insets = useSafeAreaInsets();
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const minBudget = localFilters.minRent ?? 5000;
  const maxBudget = localFilters.maxRent ?? 200000;

  const minArea = localFilters.minArea ?? 500;
  const maxArea = localFilters.maxArea ?? 5000;

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const toggleAmenity = (amenityName: string) => {
    const exists = localFilters.selectedAmenities.includes(amenityName);
    if (exists) {
      setLocalFilters({
        ...localFilters,
        selectedAmenities: localFilters.selectedAmenities.filter((a) => a !== amenityName),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        selectedAmenities: [...localFilters.selectedAmenities, amenityName],
      });
    }
  };

  const matchingCount = useMemo(() => {
    if (!allProperties || allProperties.length === 0) return 1230;

    const matches = allProperties.filter((property) => {
      const search = (localFilters.searchQuery || '').trim().toLowerCase();
      const matchesSearch =
        !search ||
        [property.title, property.location, property.city, property.builderName].some((value) =>
          value.toLowerCase().includes(search)
        );

      const cityMatch =
        localFilters.city === 'All Cities' ||
        localFilters.city === 'New Delhi, India' ||
        property.city.toLowerCase() === localFilters.city.toLowerCase() ||
        localFilters.city.toLowerCase().includes(property.city.toLowerCase());

      const typeMatch =
        localFilters.propertyType === 'All' ||
        property.type.toLowerCase() === localFilters.propertyType.toLowerCase() ||
        (localFilters.propertyType === 'Studio' && property.type.includes('Studio'));

      const bhkMatch = localFilters.bhk === null || property.bhk === localFilters.bhk;

      const rentMatch =
        (localFilters.minRent == null || property.rent >= localFilters.minRent) &&
        (localFilters.maxRent == null || property.rent <= localFilters.maxRent);

      const areaMatch =
        (localFilters.minArea == null || property.areaSqft >= localFilters.minArea) &&
        (localFilters.maxArea == null || property.areaSqft <= localFilters.maxArea);

      const amenitiesMatch =
        localFilters.selectedAmenities.length === 0 ||
        localFilters.selectedAmenities.every((item) =>
          property.amenities.some((a) => a.toLowerCase().includes(item.toLowerCase()))
        );

      return (
        property.status === 'ACTIVE' &&
        matchesSearch &&
        cityMatch &&
        typeMatch &&
        bhkMatch &&
        rentMatch &&
        areaMatch &&
        amenitiesMatch
      );
    });

    return matches.length;
  }, [allProperties, localFilters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    setLocalFilters({
      searchQuery: '',
      city: 'New Delhi, India',
      propertyType: 'Apartment',
      bhk: null,
      bathrooms: null,
      minRent: 5000,
      maxRent: 200000,
      minArea: 500,
      maxArea: 5000,
      furnishing: 'All',
      selectedAmenities: [],
    });
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44);
  const bottomInset = Math.max(insets.bottom, 16);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View className="flex-1 bg-white" style={{ paddingTop: topInset }}>
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

          <Text className="text-base font-bold text-slate-900 tracking-tight">Search & Filters</Text>

          <TouchableOpacity onPress={handleReset} activeOpacity={0.7} className="px-2 py-1">
            <Text className="text-sm font-semibold text-slate-500">Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Filter Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
        >
          {/* Search Input Bar */}
          <View className="flex-row items-center bg-slate-100/70 border border-slate-200/50 rounded-2xl px-4 py-3 mb-6">
            <Search size={18} color="#64748b" />
            <TextInput
              value={localFilters.searchQuery || ''}
              onChangeText={(text) => setLocalFilters({ ...localFilters, searchQuery: text })}
              placeholder="Search by location, society or keyword..."
              placeholderTextColor="#94a3b8"
              className="flex-1 text-sm font-medium text-slate-900 ml-2.5 p-0"
            />
            {!!localFilters.searchQuery && (
              <TouchableOpacity onPress={() => setLocalFilters({ ...localFilters, searchQuery: '' })}>
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          {/* 1. Location Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2.5">
              <MapPin size={18} color="#0f172a" fill="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Location</Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowLocationPicker(true)}
              activeOpacity={0.8}
              className="flex-row items-center justify-between bg-slate-100/70 rounded-2xl px-4 py-3.5 border border-slate-200/40"
            >
              <Text className="text-sm font-semibold text-slate-900">
                {localFilters.city || 'New Delhi, India'}
              </Text>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <LocationPickerModal
              visible={showLocationPicker}
              onClose={() => setShowLocationPicker(false)}
              selectedCity={localFilters.city || 'New Delhi, India'}
              onSelectCity={(city) => setLocalFilters({ ...localFilters, city })}
            />
          </View>

          {/* 2. Property Type Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Home size={18} color="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Property Type</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1">
              {PROPERTY_TYPES.map(({ id, label, Icon }) => {
                const isSelected = localFilters.propertyType === id;
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => setLocalFilters({ ...localFilters, propertyType: id })}
                    activeOpacity={0.8}
                    className={`w-20 h-20 rounded-2xl items-center justify-center mr-2.5 border ${
                      isSelected
                        ? 'bg-slate-950 border-slate-950'
                        : 'bg-slate-100/70 border-slate-200/30'
                    }`}
                  >
                    <Icon size={20} color={isSelected ? '#ffffff' : '#1e293b'} />
                    <Text
                      className={`text-xs font-semibold mt-1.5 ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 3. Budget (Per Month) Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Wallet size={18} color="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Budget (Per Month)</Text>
            </View>

            <PanResponderRangeSlider
              min={5000}
              max={200000}
              low={minBudget}
              high={maxBudget}
              step={5000}
              leftLabel={formatCurrency(minBudget)}
              rightLabel={`${formatCurrency(maxBudget)}+`}
              onChange={(low, high) =>
                setLocalFilters({ ...localFilters, minRent: low, maxRent: high })
              }
            />
          </View>

          {/* 4. Bedrooms Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <BedDouble size={18} color="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Bedrooms</Text>
            </View>

            <View className="flex-row space-x-2">
              {BEDROOM_OPTIONS.map((opt) => {
                const isSelected = localFilters.bhk === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    onPress={() => setLocalFilters({ ...localFilters, bhk: opt.value })}
                    activeOpacity={0.8}
                    className={`flex-1 py-3 rounded-2xl items-center justify-center border mr-2 ${
                      isSelected
                        ? 'bg-slate-950 border-slate-950'
                        : 'bg-slate-100/70 border-transparent'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 5. Bathrooms Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Bath size={18} color="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Bathrooms</Text>
            </View>

            <View className="flex-row space-x-2">
              {BATHROOM_OPTIONS.map((opt) => {
                const isSelected = localFilters.bathrooms === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    onPress={() => setLocalFilters({ ...localFilters, bathrooms: opt.value })}
                    activeOpacity={0.8}
                    className={`flex-1 py-3 rounded-2xl items-center justify-center border mr-2 ${
                      isSelected
                        ? 'bg-slate-950 border-slate-950'
                        : 'bg-slate-100/70 border-transparent'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 6. Area (sq.ft) Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Maximize2 size={18} color="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Area (sq.ft)</Text>
            </View>

            <PanResponderRangeSlider
              min={500}
              max={5000}
              low={minArea}
              high={maxArea}
              step={250}
              leftLabel={`${minArea.toLocaleString()} sq.ft`}
              rightLabel={`${maxArea.toLocaleString()}+ sq.ft`}
              onChange={(low, high) =>
                setLocalFilters({ ...localFilters, minArea: low, maxArea: high })
              }
            />
          </View>

          {/* 7. Amenities Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Star size={18} color="#0f172a" />
              <Text className="text-sm font-bold text-slate-900 ml-2">Amenities</Text>
            </View>

            <View className="flex-row flex-wrap items-center">
              {INITIAL_AMENITIES.map(({ name, Icon }) => {
                const isSelected = localFilters.selectedAmenities.includes(name);
                return (
                  <TouchableOpacity
                    key={name}
                    onPress={() => toggleAmenity(name)}
                    activeOpacity={0.8}
                    className={`flex-row items-center px-4 py-2.5 rounded-2xl mr-2 mb-2 border ${
                      isSelected
                        ? 'bg-slate-950 border-slate-950'
                        : 'bg-slate-100/70 border-slate-200/30'
                    }`}
                  >
                    <Icon size={16} color={isSelected ? '#ffffff' : '#1e293b'} />
                    <Text
                      className={`text-xs font-semibold ml-2 ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() => setShowMoreAmenities(!showMoreAmenities)}
                activeOpacity={0.8}
                className={`flex-row items-center px-4 py-2.5 rounded-2xl mb-2 border ${
                  showMoreAmenities
                    ? 'bg-slate-950 border-slate-950'
                    : 'bg-slate-100/70 border-slate-200/30'
                }`}
              >
                <Plus size={16} color={showMoreAmenities ? '#ffffff' : '#1e293b'} />
                <Text
                  className={`text-xs font-semibold ml-1.5 ${
                    showMoreAmenities ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  More
                </Text>
              </TouchableOpacity>
            </View>

            {/* Extra Amenities Toggle */}
            {showMoreAmenities && (
              <View className="mt-2 p-3 bg-slate-50 rounded-2xl flex-row flex-wrap border border-slate-200/60">
                {MORE_AMENITIES.map((amenity) => {
                  const isSelected = localFilters.selectedAmenities.includes(amenity);
                  return (
                    <TouchableOpacity
                      key={amenity}
                      onPress={() => toggleAmenity(amenity)}
                      className={`px-3 py-2 rounded-xl mr-2 mb-2 border ${
                        isSelected
                          ? 'bg-slate-950 border-slate-950'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-white' : 'text-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}
                        {amenity}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fixed Bottom Action Footer (Flush to Screen Bottom) */}
        <View
          style={{ paddingBottom: bottomInset }}
          className="pt-3 px-5 bg-white border-t border-slate-100 shadow-2xl"
        >
          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.88}
            className="w-full bg-slate-950 py-4 rounded-full items-center justify-center shadow-md active:opacity-90"
          >
            <Text className="text-white text-base font-bold">
              Show {matchingCount > 0 ? matchingCount.toLocaleString('en-US') : '1,230'} Properties
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
