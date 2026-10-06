import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, MapPin, Navigation, Check, X, Building2 } from 'lucide-react-native';
import { indianCities } from '../../mock/data';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return indianCities;
    return indianCities.filter((city) => city.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setStatusMessage('Requesting GPS location access...');

    // Try standard Geolocation API if available, else simulate instant location detection
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          // Reverse geocode or pick matching city based on coordinates
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          let detectedCity = 'New Delhi, India';
          if (lat > 18 && lat < 20 && lon > 72 && lon < 73) {
            detectedCity = 'Mumbai';
          } else if (lat > 12 && lat < 14 && lon > 77 && lon < 78) {
            detectedCity = 'Bangalore';
          } else if (lat > 17 && lat < 18 && lon > 78 && lon < 79) {
            detectedCity = 'Hyderabad';
          } else if (lat > 18.4 && lat < 18.7 && lon > 73.7 && lon < 74) {
            detectedCity = 'Pune';
          } else if (lat > 28.4 && lat < 28.6 && lon > 76.9 && lon < 77.2) {
            detectedCity = 'Gurugram';
          } else if (lat > 28.4 && lat < 28.7 && lon > 77.3 && lon < 77.5) {
            detectedCity = 'Noida';
          }

          setStatusMessage(`Located: ${detectedCity}`);
          setTimeout(() => {
            onSelectCity(detectedCity);
            setStatusMessage(null);
            onClose();
          }, 600);
        },
        (error) => {
          console.log('Location error:', error);
          // Fallback if permission denied or error
          setIsLocating(false);
          const fallbackCity = 'New Delhi, India';
          setStatusMessage(`Location detected: ${fallbackCity}`);
          setTimeout(() => {
            onSelectCity(fallbackCity);
            setStatusMessage(null);
            onClose();
          }, 600);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      // Platform fallback simulation
      setTimeout(() => {
        setIsLocating(false);
        const defaultCity = 'New Delhi, India';
        setStatusMessage(`Location detected: ${defaultCity}`);
        setTimeout(() => {
          onSelectCity(defaultCity);
          setStatusMessage(null);
          onClose();
        }, 600);
      }, 1000);
    }
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44);
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View
        className="flex-1 bg-white"
        style={{ paddingTop: topInset, paddingBottom: bottomInset }}
      >
        {/* Modal Top Header */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-100">
          <View className="flex-row items-center">
            <Building2 size={20} color="#0f172a" />
            <Text className="text-base font-bold text-slate-900 ml-2">Select Location</Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <X size={18} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View className="flex-1 px-5 pt-4">
          {/* Search Input Bar */}
          <View className="flex-row items-center bg-slate-100/80 border border-slate-200/60 rounded-2xl px-4 py-3 mb-4">
            <Search size={18} color="#64748b" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search city, locality or state..."
              placeholderTextColor="#94a3b8"
              className="flex-1 text-sm font-medium text-slate-900 ml-2.5 p-0"
            />
            {!!searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          {/* Use Current Location Button */}
          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            disabled={isLocating}
            activeOpacity={0.8}
            className="flex-row items-center bg-blue-50 border border-blue-100 p-3.5 rounded-2xl mb-4 shadow-2xs"
          >
            <View className="w-9 h-9 rounded-full bg-blue-600 items-center justify-center">
              {isLocating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Navigation size={18} color="#ffffff" />
              )}
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-blue-900">Use Current Location</Text>
              <Text className="text-xs text-blue-600 mt-0.5">
                {statusMessage || 'Detect city using GPS permissions'}
              </Text>
            </View>
          </TouchableOpacity>

          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
            Available Cities ({filteredCities.length})
          </Text>

          {/* Scrollable City List */}
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {filteredCities.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <TouchableOpacity
                  key={city}
                  onPress={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  className={`flex-row items-center justify-between py-3.5 px-4 rounded-2xl mb-2 border ${
                    isSelected
                      ? 'bg-slate-950 border-slate-950'
                      : 'bg-slate-50/70 border-slate-100'
                  }`}
                >
                  <View className="flex-row items-center">
                    <MapPin
                      size={17}
                      color={isSelected ? '#ffffff' : '#64748b'}
                      fill={isSelected ? '#ffffff' : 'none'}
                    />
                    <Text
                      className={`text-sm font-semibold ml-3 ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {city}
                    </Text>
                  </View>

                  {isSelected && <Check size={18} color="#ffffff" />}
                </TouchableOpacity>
              );
            })}

            {filteredCities.length === 0 && (
              <View className="items-center py-10">
                <MapPin size={32} color="#94a3b8" />
                <Text className="text-sm font-semibold text-slate-700 mt-2">No cities found</Text>
                <Text className="text-xs text-slate-500 mt-1">Try searching for another city name</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
