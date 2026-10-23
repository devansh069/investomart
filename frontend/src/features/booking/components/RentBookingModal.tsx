import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Property, Inquiry } from '../../../types';
import { X, CheckCircle, ArrowRight } from 'lucide-react-native';

interface RentBookingModalProps {
  property: Property | null;
  visible: boolean;
  onClose: () => void;
  onSubmitBooking: (inquiry: Inquiry) => Promise<void> | void;
}

export const RentBookingModal: React.FC<RentBookingModalProps> = ({
  property,
  visible,
  onClose,
  onSubmitBooking,
}) => {
  const [isSent, setIsSent] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!property) return null;

  const handleSubmit = async () => {
    if (!tenantName.trim() || !tenantPhone.trim()) {
      Alert.alert('Required fields', 'Please provide your name and phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitBooking({
        id: `inquiry_${Date.now()}`,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyRent: property.rent,
        customerName: tenantName.trim(),
        customerPhone: tenantPhone.trim(),
        customerEmail: tenantEmail.trim(),
        message: message.trim(),
        moveInDate: moveInDate.trim() || undefined,
        createdAt: 'Just now',
        status: 'NEW',
      });
      setIsSent(true);
    } catch (error) {
      Alert.alert('Unable to send enquiry', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSent(false);
    setTenantName('');
    setTenantPhone('');
    setTenantEmail('');
    setMoveInDate('');
    setMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 max-h-[92%] shadow-2xl border-t border-slate-100">
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
            <View>
              <Text className="text-lg font-black text-slate-900">{isSent ? 'Enquiry Sent!' : 'Property Enquiry'}</Text>
              <Text className="text-xs text-slate-500 mt-0.5">{property.title.slice(0, 36)}...</Text>
            </View>
            {!isSent && (
              <TouchableOpacity onPress={handleClose} className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="pt-4">
            {!isSent ? (
              <View>
                <View className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="text-xs text-slate-500">{property.listingType === 'Rent' ? 'Monthly Rent:' : 'Price:'}</Text>
                    <Text className="text-sm font-bold text-slate-900">{property.priceDisplay || `₹${property.rent.toLocaleString('en-IN')}`}</Text>
                  </View>
                  {property.listingType === 'Rent' && property.deposit > 0 && (
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-slate-500">Security Deposit:</Text>
                      <Text className="text-sm font-semibold text-slate-700">₹{property.deposit.toLocaleString('en-IN')}</Text>
                    </View>
                  )}
                </View>

                <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Your Information</Text>
                <View className="mb-3">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Your Name</Text>
                  <TextInput value={tenantName} onChangeText={setTenantName} autoCapitalize="words" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm" />
                </View>
                <View className="mb-3">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Phone Number</Text>
                  <TextInput value={tenantPhone} onChangeText={setTenantPhone} keyboardType="phone-pad" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm" />
                </View>
                <View className="mb-3">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Email (optional)</Text>
                  <TextInput value={tenantEmail} onChangeText={setTenantEmail} keyboardType="email-address" autoCapitalize="none" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm" />
                </View>
                <View className="mb-3">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Proposed Move-In Date (optional)</Text>
                  <TextInput value={moveInDate} onChangeText={setMoveInDate} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm" />
                </View>
                <View className="mb-5">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Message for Provider (optional)</Text>
                  <TextInput value={message} onChangeText={setMessage} multiline numberOfLines={3} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm" />
                </View>
                <TouchableOpacity disabled={isSubmitting} onPress={handleSubmit} activeOpacity={0.85} className={`py-3.5 rounded-2xl flex-row items-center justify-center mb-4 ${isSubmitting ? 'bg-slate-400' : 'bg-slate-950'}`}>
                  <Text className="text-white font-bold text-sm mr-2">{isSubmitting ? 'Sending...' : 'Send Enquiry'}</Text>
                  <ArrowRight size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-6">
                <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4"><CheckCircle size={36} color="#059669" /></View>
                <Text className="text-2xl font-black text-slate-900 text-center mb-1">Enquiry Received!</Text>
                <Text className="text-xs text-slate-500 text-center max-w-xs mb-6">The provider ({property.builderName}) can now see your enquiry in their workspace.</Text>
                <View className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                  <View className="flex-row justify-between mb-2"><Text className="text-xs text-slate-500">Property:</Text><Text className="text-xs font-semibold text-slate-800 flex-1 text-right ml-2" numberOfLines={1}>{property.title}</Text></View>
                  <View className="flex-row justify-between"><Text className="text-xs text-slate-500">Applicant:</Text><Text className="text-xs font-bold text-slate-800">{tenantName}</Text></View>
                </View>
                <TouchableOpacity onPress={handleClose} activeOpacity={0.85} className="w-full bg-slate-950 py-3.5 rounded-2xl items-center"><Text className="text-white font-bold text-sm">Done & Return to Explorer</Text></TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
