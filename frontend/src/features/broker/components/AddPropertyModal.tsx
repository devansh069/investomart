import React, { useMemo, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, ArrowRight, Building, Building2, Check, CheckCircle2, Compass, Home, ImagePlus, Trash2 } from 'lucide-react-native';
import { allAmenitiesList } from '../../../mock/data';
import { ApiError } from '../../../core/api/client';
import type { FurnishingType, ListingType, PropertyType } from '../../../types';

export type PropertyImageDraft = {
  uri: string;
  filename: string;
  contentType: 'image/jpeg' | 'image/png' | 'image/webp';
  sizeBytes: number;
};

export type PropertyListingDraft = Record<string, string | number | boolean | string[] | PropertyImageDraft[] | undefined> & {
  title: string;
  listing_type: ListingType;
  property_type: PropertyType;
  city: string;
  location: string;
  price: number;
  images: PropertyImageDraft[];
};

interface AddPropertyModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProperty: (property: PropertyListingDraft) => Promise<void> | void;
}

type StepKey = 1 | 2 | 3 | 4;
type ExtraField = { key: string; label: string; numeric?: boolean; multiline?: boolean; placeholder?: string };

const propertyTypeOptions: { type: PropertyType; label: string; icon: typeof Building }[] = [
  { type: 'Apartment', label: 'Apartment', icon: Building },
  { type: 'Villa', label: 'Villa', icon: Home },
  { type: 'Independent House', label: 'Independent House', icon: Home },
  { type: 'Commercial', label: 'Commercial', icon: Building2 },
  { type: 'Plot/Land', label: 'Plot/Land', icon: Compass },
];

// Provider-editable legacy website fields. Approval, SEO, boost, plan and
// analytics fields are system-controlled and therefore intentionally absent.
const detailFields: ExtraField[] = [
  { key: 'balconies', label: 'Balconies', numeric: true },
  { key: 'project_name', label: 'Project / Society name' },
  { key: 'address', label: 'Complete address' },
  { key: 'sub_type', label: 'Property sub-type' },
  { key: 'floor_number', label: 'Floor number' },
  { key: 'total_floors', label: 'Total floors' },
  { key: 'facing', label: 'Facing' },
  { key: 'overlooking', label: 'Overlooking' },
  { key: 'flat_view', label: 'Flat view' },
  { key: 'property_age', label: 'Property age' },
  { key: 'transaction_type', label: 'Transaction type', placeholder: 'New Property / Resale' },
  { key: 'possession_status', label: 'Possession status', placeholder: 'Ready To Move / Under Construction' },
  { key: 'possession_date', label: 'Possession date', placeholder: 'YYYY-MM-DD' },
  { key: 'completion_date', label: 'Completion date', placeholder: 'YYYY-MM-DD' },
  { key: 'available_from_month', label: 'Available from month' },
  { key: 'price_unit', label: 'Price unit', placeholder: 'Total Price / Per month' },
  { key: 'price_per_unit', label: 'Price per unit' },
  { key: 'price_breakup', label: 'Price breakup' },
  { key: 'booking_amount', label: 'Booking amount' },
  { key: 'maintenance', label: 'Maintenance charge' },
  { key: 'unit_number', label: 'Unit / flat number' },
  { key: 'super_area', label: 'Super area' },
  { key: 'project_area', label: 'Project area' },
  { key: 'total_units', label: 'Total units' },
  { key: 'total_towers', label: 'Total towers' },
  { key: 'car_parking', label: 'Number of car parks', numeric: true },
  { key: 'parking', label: 'Parking details' },
  { key: 'flooring', label: 'Flooring' },
  { key: 'type_of_ownership', label: 'Type of ownership', placeholder: 'Freehold / Leasehold' },
  { key: 'additional_rooms', label: 'Additional rooms' },
  { key: 'pooja_rooms', label: 'Pooja room' },
  { key: 'study_rooms', label: 'Study room' },
  { key: 'servant_rooms', label: 'Servant room' },
  { key: 'other_rooms', label: 'Other rooms' },
  { key: 'water_availability', label: 'Water availability' },
  { key: 'status_of_electricity', label: 'Electricity status' },
  { key: 'landmarks', label: 'Landmarks' },
  { key: 'nearby_bus', label: 'Nearby bus stop' },
  { key: 'nearby_railway', label: 'Nearby railway / metro' },
  { key: 'nearby_atm', label: 'Nearby ATM' },
  { key: 'nearby_school', label: 'Nearby school' },
  { key: 'nearby_hospital', label: 'Nearby hospital' },
  { key: 'map_location', label: 'Map location / map URL' },
  { key: 'video_link', label: 'Video URL' },
  { key: 'other_features', label: 'Other features', multiline: true },
  { key: 'rent_details', label: 'Rent details', multiline: true },
];

const booleanFields = [
  ['reserved_parking', 'Reserved parking'], ['visitor_parking', 'Visitor parking'], ['garden', 'Garden'],
  ['swimming', 'Swimming pool'], ['power_backup', 'Power backup'], ['lift', 'Lift'],
  ['club', 'Club house'], ['security', 'Security'], ['gym', 'Gym'],
] as const;

const initialDetails = Object.fromEntries(detailFields.map(({ key }) => [key, ''])) as Record<string, string>;

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ visible, onClose, onAddProperty }) => {
  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [listingType, setListingType] = useState<ListingType>('Rent');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Noida');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('Sq Ft');
  const [furnishing, setFurnishing] = useState<FurnishingType>('Semi-Furnished');
  const [deposit, setDeposit] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [details, setDetails] = useState<Record<string, string>>(initialDetails);
  const [images, setImages] = useState<PropertyImageDraft[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredMissing = useMemo(() => !title.trim() || !city.trim() || !location.trim() || !price.trim() || images.length === 0, [title, city, location, price, images.length]);

  const resetAndClose = () => {
    setCurrentStep(1); setTitle(''); setCity('Noida'); setLocation(''); setPrice(''); setBedrooms(''); setBathrooms('');
    setArea(''); setAreaUnit('Sq Ft'); setFurnishing('Semi-Furnished'); setDeposit(''); setDescription(''); setAmenities([]);
    setFlags({}); setDetails(initialDetails); setImages([]); setIsSubmitting(false); onClose();
  };

  const updateDetail = (key: string, value: string) => setDetails((current) => ({ ...current, [key]: value }));
  const toggleAmenity = (amenity: string) => setAmenities((current) => current.includes(amenity) ? current.filter((value) => value !== amenity) : [...current, amenity]);
  const toggleFlag = (key: string) => setFlags((current) => ({ ...current, [key]: !current[key] }));

  const normalizeImage = (asset: ImagePicker.ImagePickerAsset): PropertyImageDraft | null => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(asset.mimeType ?? '')) {
      Alert.alert('Unsupported image', 'Use a JPEG, PNG or WebP property image.');
      return null;
    }
    const contentType = asset.mimeType as PropertyImageDraft['contentType'];
    const sizeBytes = asset.fileSize ?? 0;
    if (!asset.uri || sizeBytes > 10 * 1024 * 1024) {
      Alert.alert('Image too large', 'Each property image must be 10 MB or smaller.');
      return null;
    }
    const extension = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
    const filename = asset.fileName?.replace(/[^A-Za-z0-9._-]/g, '_') || `property-${Date.now()}.${extension}`;
    return { uri: asset.uri, filename, contentType, sizeBytes: Math.max(1, sizeBytes) };
  };

  const addFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: Math.max(1, 7 - images.length), quality: 0.8 });
    if (result.canceled) return;
    const selected = result.assets.map(normalizeImage).filter((item): item is PropertyImageDraft => item !== null);
    setImages((current) => [...current, ...selected].slice(0, 7));
  };

  const addFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission required', 'Allow camera access to photograph this property.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return;
    const selected = normalizeImage(result.assets[0]);
    if (selected) setImages((current) => [...current, selected].slice(0, 7));
  };

  const chooseImage = () => Alert.alert('Add property photo', 'Select the source for a real property photo.', [
    { text: 'Camera', onPress: () => void addFromCamera() },
    { text: 'Photo library', onPress: () => void addFromLibrary() },
    { text: 'Cancel', style: 'cancel' },
  ]);

  const publish = async () => {
    if (requiredMissing) {
      Alert.alert('Complete required fields', 'Add title, city, locality, price and at least one real property photo.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onAddProperty({
        title: title.trim(), listing_type: listingType, property_type: propertyType, city: city.trim(), location: location.trim(),
        price: Number(price.replace(/[^0-9.]/g, '')), bedrooms, configuration: bedrooms,
        bathrooms: bathrooms ? Number(bathrooms) : undefined, area: area ? Number(area.replace(/[^0-9.]/g, '')) : undefined,
        area_unit: areaUnit, furnishing, deposit: deposit ? Number(deposit.replace(/[^0-9.]/g, '')) : undefined,
        description: description.trim() || undefined, amenities, images, ...details, ...flags,
      });
      Alert.alert('Property submitted', 'Your property has been sent for admin approval.');
      resetAndClose();
    } catch (error) {
      const validationMessage = error instanceof ApiError
        ? Object.values(error.body?.errors ?? {}).flat()[0]
        : undefined;
      Alert.alert('Unable to submit property', validationMessage || (error instanceof Error ? error.message : 'Please try again.'));
      setIsSubmitting(false);
    }
  };

  return <Modal visible={visible} animationType="slide" onRequestClose={resetAndClose}>
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
      <View className="px-5 py-3 flex-row items-center border-b border-slate-100"><TouchableOpacity onPress={currentStep === 1 ? resetAndClose : () => setCurrentStep((value) => (value - 1) as StepKey)} className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"><ArrowLeft size={18} color="#0f172a" /></TouchableOpacity><Text className="flex-1 text-center text-lg font-bold text-slate-900">Add New Property</Text><View className="w-10" /></View>
      <View className="px-5 py-3 flex-row justify-between border-b border-slate-100">{(['Basic', 'Details', 'Photos', 'Review'] as const).map((label, index) => <TouchableOpacity key={label} onPress={() => setCurrentStep((index + 1) as StepKey)} className="items-center"><View className={`w-6 h-6 rounded-full items-center justify-center ${currentStep === index + 1 ? 'bg-slate-950' : 'bg-slate-200'}`}><Text className={`text-xs font-bold ${currentStep === index + 1 ? 'text-white' : 'text-slate-600'}`}>{index + 1}</Text></View><Text className={`text-[10px] mt-1 ${currentStep === index + 1 ? 'font-bold text-slate-950' : 'text-slate-400'}`}>{label}</Text></TouchableOpacity>)}</View>
      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 112 }} keyboardShouldPersistTaps="handled">
        {currentStep === 1 && <><Text className="text-sm font-bold text-slate-900 mb-2">Property type</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} className="mb-5">{propertyTypeOptions.map(({ type, label, icon: Icon }) => <TouchableOpacity key={type} onPress={() => setPropertyType(type)} className={`w-24 h-20 rounded-2xl border items-center justify-center px-2 ${propertyType === type ? 'bg-slate-950 border-slate-950' : 'bg-white border-slate-200'}`}><Icon size={20} color={propertyType === type ? '#fff' : '#475569'} /><Text className={`text-[10px] text-center mt-1 ${propertyType === type ? 'text-white font-bold' : 'text-slate-700'}`}>{label}</Text></TouchableOpacity>)}</ScrollView><View className="flex-row bg-slate-100 p-1 rounded-xl mb-5"><TouchableOpacity onPress={() => setListingType('Rent')} className={`flex-1 py-3 rounded-lg items-center ${listingType === 'Rent' ? 'bg-slate-950' : ''}`}><Text className={listingType === 'Rent' ? 'text-white font-bold' : 'text-slate-600 font-bold'}>For rent</Text></TouchableOpacity><TouchableOpacity onPress={() => setListingType('Sale')} className={`flex-1 py-3 rounded-lg items-center ${listingType === 'Sale' ? 'bg-slate-950' : ''}`}><Text className={listingType === 'Sale' ? 'text-white font-bold' : 'text-slate-600 font-bold'}>For sale</Text></TouchableOpacity></View><Field label="Property title *" value={title} onChangeText={setTitle} placeholder="e.g. Luxury 3 BHK Apartment" /><Field label="City *" value={city} onChangeText={setCity} placeholder="e.g. Noida" /><Field label="Locality / location *" value={location} onChangeText={setLocation} placeholder="e.g. Sector 62" /><Field label="Price *" value={price} onChangeText={setPrice} numeric placeholder="e.g. 32000" /><Field label="Configuration / bedrooms" value={bedrooms} onChangeText={setBedrooms} placeholder="e.g. 3 BHK" /><View className="flex-row gap-3"><View className="flex-1"><Field label="Bathrooms" value={bathrooms} onChangeText={setBathrooms} numeric /></View><View className="flex-1"><Field label="Area" value={area} onChangeText={setArea} numeric /></View></View><Field label="Area unit" value={areaUnit} onChangeText={setAreaUnit} placeholder="Sq Ft" /><Field label="Full description" value={description} onChangeText={setDescription} multiline placeholder="Describe the property, its location and highlights" /></>}
        {currentStep === 2 && <><Text className="text-base font-bold text-slate-900 mb-1">Website property details</Text><Text className="text-xs text-slate-500 mb-4">Complete every applicable field. Empty optional fields are not saved.</Text><Text className="text-xs font-semibold text-slate-700 mb-2">Furnishing</Text><View className="flex-row gap-2 mb-4">{(['Fully Furnished', 'Semi-Furnished', 'Unfurnished'] as FurnishingType[]).map((value) => <TouchableOpacity key={value} onPress={() => setFurnishing(value)} className={`flex-1 p-2 rounded-xl border items-center ${furnishing === value ? 'bg-slate-950 border-slate-950' : 'border-slate-200'}`}><Text className={`text-[10px] ${furnishing === value ? 'text-white font-bold' : 'text-slate-700'}`}>{value}</Text></TouchableOpacity>)}</View><Field label="Security deposit" value={deposit} onChangeText={setDeposit} numeric />{detailFields.map((field) => <Field key={field.key} label={field.label} value={details[field.key]} onChangeText={(value) => updateDetail(field.key, value)} numeric={field.numeric} multiline={field.multiline} placeholder={field.placeholder} />)}<Text className="text-xs font-semibold text-slate-700 mb-2">Parking, amenities and facilities</Text><View className="flex-row flex-wrap gap-2 mb-4">{booleanFields.map(([key, label]) => <Choice key={key} label={label} selected={!!flags[key]} onPress={() => toggleFlag(key)} />)}</View><Text className="text-xs font-semibold text-slate-700 mb-2">Legacy amenities</Text><View className="flex-row flex-wrap gap-2">{allAmenitiesList.map((amenity) => <Choice key={amenity} label={amenity} selected={amenities.includes(amenity)} onPress={() => toggleAmenity(amenity)} />)}</View></>}
        {currentStep === 3 && <><Text className="text-base font-bold text-slate-900 mb-1">Real property photos</Text><Text className="text-xs text-slate-500 mb-4">Select up to seven JPEG, PNG or WebP images. The first photo is the cover. Each image must be 10 MB or smaller.</Text><View className="flex-row flex-wrap gap-3">{images.map((image, index) => <View key={`${image.uri}-${index}`} className="w-[30%] aspect-square rounded-xl overflow-hidden border border-slate-200"><Image source={{ uri: image.uri }} className="w-full h-full" /><TouchableOpacity onPress={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} className="absolute top-1 right-1 bg-white rounded-full p-1"><Trash2 size={14} color="#dc2626" /></TouchableOpacity>{index === 0 && <View className="absolute bottom-0 left-0 right-0 bg-black/60 py-1"><Text className="text-[9px] font-bold text-white text-center">COVER</Text></View>}</View>)}</View>{images.length < 7 && <TouchableOpacity onPress={chooseImage} className="mt-4 h-32 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50 items-center justify-center"><ImagePlus size={25} color="#059669" /><Text className="mt-2 text-sm font-bold text-emerald-800">Add real property photos</Text></TouchableOpacity>}</>}
        {currentStep === 4 && <><Text className="text-base font-bold text-slate-900 mb-3">Review property listing</Text>{images[0] && <Image source={{ uri: images[0].uri }} className="w-full h-48 rounded-2xl mb-3" resizeMode="cover" />}<View className="rounded-2xl bg-slate-50 border border-slate-200 p-4"><Text className="text-lg font-bold text-slate-950">{title || 'Property title required'}</Text><Text className="text-sm text-slate-500 mt-1">{location || 'Locality'}, {city || 'City'}</Text><Text className="text-base font-black text-emerald-600 mt-3">₹{price || '0'} · {listingType}</Text><Text className="text-xs text-slate-600 mt-2">{propertyType} · {bedrooms || 'Configuration not specified'} · {area || 'Area not specified'} {areaUnit}</Text><Text className="text-xs text-slate-500 mt-3">{images.length} real photo(s) will be uploaded securely to InvestorMart storage before the property is submitted.</Text></View></>}
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5">{currentStep < 4 ? <TouchableOpacity onPress={() => setCurrentStep((value) => (value + 1) as StepKey)} className="bg-slate-950 py-4 rounded-full flex-row items-center justify-center"><Text className="text-white font-bold">Next</Text><ArrowRight size={17} color="#fff" className="ml-2" /></TouchableOpacity> : <TouchableOpacity disabled={isSubmitting} onPress={publish} className={`py-4 rounded-full flex-row items-center justify-center ${isSubmitting ? 'bg-slate-400' : 'bg-emerald-600'}`}><CheckCircle2 size={17} color="#fff" /><Text className="ml-2 text-white font-bold">{isSubmitting ? 'Uploading photos…' : 'Submit for approval'}</Text></TouchableOpacity>}</View>
    </KeyboardAvoidingView></SafeAreaView>
  </Modal>;
};

const Field = ({ label, value, onChangeText, numeric, multiline, placeholder }: { label: string; value: string; onChangeText: (value: string) => void; numeric?: boolean; multiline?: boolean; placeholder?: string }) => <View className="mb-3"><Text className="text-xs font-semibold text-slate-700 mb-1">{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#94a3b8" keyboardType={numeric ? 'numeric' : 'default'} multiline={multiline} className={`border border-slate-200 bg-slate-50 rounded-xl px-3 py-3 text-sm text-slate-900 ${multiline ? 'min-h-24' : ''}`} /></View>;
const Choice = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => <TouchableOpacity onPress={onPress} className={`px-3 py-2 rounded-xl border flex-row items-center ${selected ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>{selected && <Check size={12} color="#059669" />}<Text className={`text-xs ml-1 ${selected ? 'font-bold text-emerald-800' : 'text-slate-700'}`}>{label}</Text></TouchableOpacity>;
