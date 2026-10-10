import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Home,
  Building2,
  Compass,
  MapPin,
  Crosshair,
  ChevronDown,
  Check,
  Upload,
  CheckCircle2,
} from 'lucide-react-native';
import { Property, PropertyType, ListingType, FurnishingType } from '../../../types';
import { allAmenitiesList } from '../../../mock/data';

interface AddPropertyModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProperty: (property: Property) => void;
  builderName: string;
  builderPhone: string;
}

type StepKey = 1 | 2 | 3 | 4;

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  visible,
  onClose,
  onAddProperty,
  builderName,
  builderPhone,
}) => {
  // Stepper state
  const [currentStep, setCurrentStep] = useState<StepKey>(1);

  // Step 1: Basic Info fields
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [listingType, setListingType] = useState<ListingType>('Rent');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('32000');
  const [pricePeriod, setPricePeriod] = useState('/month');
  const [bedrooms, setBedrooms] = useState('3 BHK');
  const [bathrooms, setBathrooms] = useState('2');
  const [area, setArea] = useState('1450');
  const [areaUnit, setAreaUnit] = useState('sq.ft');
  const [description, setDescription] = useState('');

  // Dropdown toggles
  const [showBedroomsPicker, setShowBedroomsPicker] = useState(false);
  const [showBathroomsPicker, setShowBathroomsPicker] = useState(false);

  // Step 2 & 3: Details & Media
  const [furnishing, setFurnishing] = useState<FurnishingType>('Fully Furnished');
  const [deposit, setDeposit] = useState('90000');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Covered Parking',
    '24/7 Security',
    'Power Backup',
  ]);

  const sampleImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
  ];
  const [selectedImage, setSelectedImage] = useState(sampleImages[0]);

  const handleUseCurrentLocation = () => {
    setLocation('Sector 62, Noida');
  };

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const parseBhkNumber = (bhkStr: string): number => {
    const match = bhkStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 2;
  };

  const handlePublish = () => {
    const propTitle = title.trim() || 'Modern Luxury Residence';
    const propLocation = location.trim() || 'Sector 62, Noida';
    const rentValue = parseInt(price.replace(/[^0-9]/g, ''), 10) || 32000;
    const depositValue = parseInt(deposit.replace(/[^0-9]/g, ''), 10) || rentValue * 2;
    const areaValue = parseInt(area.replace(/[^0-9]/g, ''), 10) || 1450;
    const bhkValue = parseBhkNumber(bedrooms);
    const bathValue = parseInt(bathrooms, 10) || 2;

    const newProperty: Property = {
      id: `prop_${Date.now()}`,
      title: propTitle,
      builderId: 'bld_1',
      builderName: builderName || 'Oberoi Green Homes & Realty',
      builderPhone: builderPhone || '+91 98230 11223',
      builderVerified: true,
      type: propertyType,
      listingType: listingType,
      bhk: bhkValue,
      bathrooms: bathValue,
      rent: rentValue,
      priceDisplay: listingType === 'Rent' ? `₹${rentValue.toLocaleString('en-IN')} /month` : `₹${(rentValue / 10000000).toFixed(2)} Cr`,
      deposit: depositValue,
      areaSqft: areaValue,
      furnishing: furnishing,
      city: 'Noida',
      location: propLocation,
      address: `${propLocation}, NCR`,
      description: description.trim() || 'Beautiful property with excellent ventilation, modern amenities and strategic location.',
      amenities: selectedAmenities,
      imageUrl: selectedImage,
      hasVideo: true,
      status: 'ACTIVE',
      postedDate: 'Just now',
      viewsCount: 1,
      likesCount: 0,
      inquiriesCount: 0,
    };

    onAddProperty(newProperty);
    Alert.alert('Property Published!', 'Your listing is now live and visible to all users.');
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setCurrentStep(1);
    setTitle('');
    setLocation('');
    setDescription('');
    onClose();
  };

  const propertyTypeOptions: { type: PropertyType; label: string; icon: any }[] = [
    { type: 'Apartment', label: 'Apartment', icon: Building },
    { type: 'Villa', label: 'Villa', icon: Home },
    { type: 'Independent House', label: 'Independent\nHouse', icon: Home },
    { type: 'Commercial', label: 'Commercial', icon: Building2 },
    { type: 'Plot/Land', label: 'Plot/Land', icon: Compass },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleResetAndClose}
    >
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 bg-white"
        >
          {/* Top Header */}
          <View className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b border-slate-100 bg-white">
            <TouchableOpacity
              onPress={currentStep > 1 ? () => setCurrentStep((prev) => (prev - 1) as StepKey) : handleResetAndClose}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200"
            >
              <ArrowLeft size={18} color="#0f172a" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-slate-900 tracking-tight">Add New Property</Text>
            <View className="w-10" />
          </View>

        {/* Stepper Wizard Indicator */}
        <View className="px-5 py-3 border-b border-slate-100 bg-white">
          <View className="flex-row items-center justify-between">
            {/* Step 1 */}
            <TouchableOpacity
              onPress={() => setCurrentStep(1)}
              className="flex-row items-center gap-1.5"
            >
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  currentStep === 1 ? 'bg-slate-950' : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    currentStep === 1 ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  1
                </Text>
              </View>
              <Text
                className={`text-xs ${
                  currentStep === 1 ? 'font-bold text-slate-950' : 'text-slate-400 font-medium'
                }`}
              >
                Basic Info
              </Text>
            </TouchableOpacity>

            {/* Step 2 */}
            <TouchableOpacity
              onPress={() => setCurrentStep(2)}
              className="flex-row items-center gap-1.5"
            >
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  currentStep === 2 ? 'bg-slate-950' : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    currentStep === 2 ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  2
                </Text>
              </View>
              <Text
                className={`text-xs ${
                  currentStep === 2 ? 'font-bold text-slate-950' : 'text-slate-400 font-medium'
                }`}
              >
                Details
              </Text>
            </TouchableOpacity>

            {/* Step 3 */}
            <TouchableOpacity
              onPress={() => setCurrentStep(3)}
              className="flex-row items-center gap-1.5"
            >
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  currentStep === 3 ? 'bg-slate-950' : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    currentStep === 3 ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  3
                </Text>
              </View>
              <Text
                className={`text-xs ${
                  currentStep === 3 ? 'font-bold text-slate-950' : 'text-slate-400 font-medium'
                }`}
              >
                Media
              </Text>
            </TouchableOpacity>

            {/* Step 4 */}
            <TouchableOpacity
              onPress={() => setCurrentStep(4)}
              className="flex-row items-center gap-1.5"
            >
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  currentStep === 4 ? 'bg-slate-950' : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    currentStep === 4 ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  4
                </Text>
              </View>
              <Text
                className={`text-xs ${
                  currentStep === 4 ? 'font-bold text-slate-950' : 'text-slate-400 font-medium'
                }`}
              >
                Review
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Form Content */}
        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 1 && (
            <>
              {/* 1. Property Type */}
              <View className="mb-4">
                <Text className="text-sm font-bold text-slate-900 mb-2.5">
                  Property Type
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {propertyTypeOptions.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = propertyType === item.type;
                    return (
                      <TouchableOpacity
                        key={item.type}
                        onPress={() => setPropertyType(item.type)}
                        activeOpacity={0.8}
                        className={`w-20 h-20 rounded-2xl items-center justify-center p-2 border ${
                          isSelected
                            ? 'bg-slate-100 border-slate-950 shadow-xs'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <IconComponent
                          size={22}
                          color={isSelected ? '#0f172a' : '#64748b'}
                        />
                        <Text
                          className={`text-[10px] text-center font-medium mt-1.5 leading-3 ${
                            isSelected ? 'text-slate-950 font-bold' : 'text-slate-600'
                          }`}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* 2. Listing Type */}
              <View className="mb-4">
                <Text className="text-sm font-bold text-slate-900 mb-2">
                  Listing Type
                </Text>
                <View className="flex-row bg-slate-100 p-1 rounded-2xl">
                  <TouchableOpacity
                    onPress={() => {
                      setListingType('Rent');
                      setPricePeriod('/month');
                    }}
                    className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
                      listingType === 'Rent' ? 'bg-slate-950 shadow-xs' : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        listingType === 'Rent' ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      For Rent
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setListingType('Sale');
                      setPricePeriod('Cr');
                    }}
                    className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
                      listingType === 'Sale' ? 'bg-slate-950 shadow-xs' : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        listingType === 'Sale' ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      For Sale
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 3. Basic Information */}
              <View className="mb-2">
                <Text className="text-sm font-bold text-slate-900 mb-3">
                  Basic Information
                </Text>

                {/* Property Title */}
                <View className="mb-3.5">
                  <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                    Property Title <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Luxury 3 BHK Apartment"
                    placeholderTextColor="#94a3b8"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-medium"
                  />
                </View>

                {/* Location */}
                <View className="mb-3.5">
                  <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                    Location <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                      <MapPin size={16} color="#94a3b8" />
                      <TextInput
                        value={location}
                        onChangeText={setLocation}
                        placeholder="e.g. Sector 62, Noida"
                        placeholderTextColor="#94a3b8"
                        className="flex-1 pl-2 text-sm text-slate-900 font-medium"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={handleUseCurrentLocation}
                      className="flex-row items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-3 rounded-xl active:bg-slate-200"
                    >
                      <Crosshair size={14} color="#0f172a" />
                      <Text className="text-xs font-bold text-slate-800">Use Current Location</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Price & Bedrooms Row */}
                <View className="flex-row gap-3 mb-3.5">
                  {/* Price */}
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                      Price <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                      <Text className="text-sm font-bold text-slate-800 mr-1.5">₹</Text>
                      <TextInput
                        value={price}
                        onChangeText={setPrice}
                        placeholder="32,000"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                        className="flex-1 text-sm font-semibold text-slate-900"
                      />
                      <Text className="text-xs text-slate-500 font-medium ml-1">
                        {pricePeriod}
                      </Text>
                      <ChevronDown size={14} color="#94a3b8" className="ml-1" />
                    </View>
                  </View>

                  {/* Bedrooms */}
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                      Bedrooms <Text className="text-red-500">*</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowBedroomsPicker(!showBedroomsPicker)}
                      className="flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-3"
                    >
                      <Text className="text-sm font-semibold text-slate-900">{bedrooms}</Text>
                      <ChevronDown size={14} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Dropdown Options for Bedrooms */}
                {showBedroomsPicker && (
                  <View className="bg-white border border-slate-200 rounded-xl p-2 mb-3 shadow-md flex-row flex-wrap gap-1.5">
                    {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'].map((bhkOption) => (
                      <TouchableOpacity
                        key={bhkOption}
                        onPress={() => {
                          setBedrooms(bhkOption);
                          setShowBedroomsPicker(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg border ${
                          bedrooms === bhkOption
                            ? 'bg-slate-950 border-slate-950'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            bedrooms === bhkOption ? 'text-white' : 'text-slate-800'
                          }`}
                        >
                          {bhkOption}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Bathrooms & Built-up Area Row */}
                <View className="flex-row gap-3 mb-3.5">
                  {/* Bathrooms */}
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                      Bathrooms <Text className="text-red-500">*</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowBathroomsPicker(!showBathroomsPicker)}
                      className="flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-3"
                    >
                      <Text className="text-sm font-semibold text-slate-900">{bathrooms}</Text>
                      <ChevronDown size={14} color="#64748b" />
                    </TouchableOpacity>
                  </View>

                  {/* Built-up Area */}
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                      Built-up Area <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                      <TextInput
                        value={area}
                        onChangeText={setArea}
                        placeholder="1450"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                        className="flex-1 text-sm font-semibold text-slate-900"
                      />
                      <Text className="text-xs text-slate-500 font-medium ml-1">
                        {areaUnit}
                      </Text>
                      <ChevronDown size={14} color="#94a3b8" className="ml-1" />
                    </View>
                  </View>
                </View>

                {/* Dropdown Options for Bathrooms */}
                {showBathroomsPicker && (
                  <View className="bg-white border border-slate-200 rounded-xl p-2 mb-3 shadow-md flex-row gap-2">
                    {['1', '2', '3', '4', '5+'].map((bathOption) => (
                      <TouchableOpacity
                        key={bathOption}
                        onPress={() => {
                          setBathrooms(bathOption);
                          setShowBathroomsPicker(false);
                        }}
                        className={`flex-1 py-1.5 rounded-lg border items-center ${
                          bathrooms === bathOption
                            ? 'bg-slate-950 border-slate-950'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            bathrooms === bathOption ? 'text-white' : 'text-slate-800'
                          }`}
                        >
                          {bathOption}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Short Description */}
                <View className="mb-4">
                  <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                    Short Description <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <TextInput
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Describe your property in a few words..."
                      placeholderTextColor="#94a3b8"
                      multiline
                      numberOfLines={4}
                      maxLength={300}
                      className="w-full text-sm text-slate-900 h-24 text-top"
                    />
                    <Text className="text-[11px] text-slate-400 text-right mt-1">
                      {description.length}/300
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <View>
              <Text className="text-sm font-bold text-slate-900 mb-3">
                Property Amenities & Specifications
              </Text>

              {/* Furnishing */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-2">Furnishing Status</Text>
                <View className="flex-row gap-2">
                  {(['Fully Furnished', 'Semi-Furnished', 'Unfurnished'] as FurnishingType[]).map((f) => (
                    <TouchableOpacity
                      key={f}
                      onPress={() => setFurnishing(f)}
                      className={`flex-1 py-2.5 rounded-xl border items-center ${
                        furnishing === f ? 'bg-slate-950 border-slate-950' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Text className={`text-[11px] font-bold ${furnishing === f ? 'text-white' : 'text-slate-700'}`}>
                        {f}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Deposit */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Security Deposit (₹)</Text>
                <TextInput
                  value={deposit}
                  onChangeText={setDeposit}
                  placeholder="90,000"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-semibold"
                />
              </View>

              {/* Amenities */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-2">Select Amenities</Text>
                <View className="flex-row flex-wrap gap-2">
                  {allAmenitiesList.map((item) => {
                    const isSelected = selectedAmenities.includes(item);
                    return (
                      <TouchableOpacity
                        key={item}
                        onPress={() => toggleAmenity(item)}
                        className={`px-3 py-2 rounded-xl border flex-row items-center gap-1.5 ${
                          isSelected ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {isSelected && <Check size={12} color="#16a34a" />}
                        <Text
                          className={`text-xs font-medium ${
                            isSelected ? 'text-emerald-800 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* Step 3: Media */}
          {currentStep === 3 && (
            <View>
              <Text className="text-sm font-bold text-slate-900 mb-1">
                Property Visuals & Photos
              </Text>
              <Text className="text-xs text-slate-500 mb-4">
                High quality photos increase inquiry rates by up to 300%.
              </Text>

              {/* Main Selected Preview */}
              <View className="w-full h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-4 relative">
                <Image source={{ uri: selectedImage }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute bottom-2 right-2 bg-black/60 px-2.5 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-white">Cover Image</Text>
                </View>
              </View>

              {/* Sample Gallery Choices */}
              <Text className="text-xs font-semibold text-slate-700 mb-2">Select from architectural gallery:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {sampleImages.map((imgUri, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedImage(imgUri)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      selectedImage === imgUri ? 'border-emerald-500 scale-105' : 'border-transparent opacity-75'
                    }`}
                  >
                    <Image source={{ uri: imgUri }} className="w-full h-full" resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <View>
              <Text className="text-sm font-bold text-slate-900 mb-3">
                Review Listing Summary
              </Text>

              <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
                <View className="w-full h-40 rounded-xl overflow-hidden mb-3">
                  <Image source={{ uri: selectedImage }} className="w-full h-full" resizeMode="cover" />
                </View>
                <Text className="text-base font-extrabold text-slate-950">
                  {title || 'Luxury 3 BHK Apartment'}
                </Text>
                <Text className="text-xs text-slate-500 mt-0.5">{location || 'Sector 62, Noida'}</Text>
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-200">
                  <Text className="text-base font-black text-emerald-600">
                    ₹{parseInt(price || '32000', 10).toLocaleString('en-IN')} {pricePeriod}
                  </Text>
                  <Text className="text-xs font-bold text-slate-700">
                    {bedrooms} • {bathrooms} Baths • {area} {areaUnit}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Sticky Bottom Action Button */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 shadow-lg">
          {currentStep < 4 ? (
            <TouchableOpacity
              onPress={() => setCurrentStep((prev) => (prev + 1) as StepKey)}
              activeOpacity={0.85}
              className="w-full bg-slate-950 py-4 rounded-full flex-row items-center justify-center gap-2 shadow-md active:bg-slate-800"
            >
              <Text className="text-white text-base font-bold">
                {currentStep === 1
                  ? 'Next: Add Details'
                  : currentStep === 2
                  ? 'Next: Add Media'
                  : 'Next: Review'}
              </Text>
              <ArrowRight size={18} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handlePublish}
              activeOpacity={0.85}
              className="w-full bg-emerald-600 py-4 rounded-full flex-row items-center justify-center gap-2 shadow-md active:bg-emerald-700"
            >
              <CheckCircle2 size={18} color="#ffffff" />
              <Text className="text-white text-base font-bold">
                Publish Property Listing
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>
  );
};
