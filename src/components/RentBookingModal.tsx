import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Property, Inquiry } from '../types';
import { X, CheckCircle, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react-native';

interface RentBookingModalProps {
  property: Property | null;
  visible: boolean;
  onClose: () => void;
  onSubmitBooking: (inquiry: Inquiry) => void;
}

export const RentBookingModal: React.FC<RentBookingModalProps> = ({
  property,
  visible,
  onClose,
  onSubmitBooking,
}) => {
  const [step, setStep] = useState<'DETAILS' | 'PAYMENT' | 'SUCCESS'>('DETAILS');
  const [tenantName, setTenantName] = useState('Rahul Sharma');
  const [tenantPhone, setTenantPhone] = useState('+91 98765 43210');
  const [tenantEmail, setTenantEmail] = useState('rahul.sharma@gmail.com');
  const [moveInDate, setMoveInDate] = useState('01 Nov 2026');
  const [message, setMessage] = useState('Looking forward to moving in. Please review my application.');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');

  if (!property) return null;

  const tokenAmount = 5000; // Standard nominal token advance

  const handleProceedToPayment = () => {
    if (!tenantName || !tenantPhone) {
      Alert.alert('Required Fields', 'Please provide your full name and phone number.');
      return;
    }
    setStep('PAYMENT');
  };

  const handleCompletePayment = () => {
    // Generate new inquiry
    const newInquiry: Inquiry = {
      id: `inq_${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyRent: property.rent,
      customerName: tenantName,
      customerPhone: tenantPhone,
      customerEmail: tenantEmail,
      message,
      moveInDate,
      createdAt: 'Just now',
      status: 'NEW',
    };

    onSubmitBooking(newInquiry);
    setStep('SUCCESS');
  };

  const handleFinish = () => {
    setStep('DETAILS');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 max-h-[92%] shadow-2xl border-t border-slate-100">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
            <View>
              <Text className="text-lg font-black text-slate-900">
                {step === 'DETAILS' && 'Rental Interest Application'}
                {step === 'PAYMENT' && 'Token Advance Payment Gateway'}
                {step === 'SUCCESS' && 'Application Confirmed!'}
              </Text>
              <Text className="text-xs text-slate-500 mt-0.5">
                {property.title.slice(0, 36)}...
              </Text>
            </View>

            {step !== 'SUCCESS' && (
              <TouchableOpacity
                onPress={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="pt-4">
            {/* STEP 1: RENTAL APPLICATION DETAILS */}
            {step === 'DETAILS' && (
              <View>
                {/* Summary Card */}
                <View className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="text-xs text-slate-500">Monthly Rent:</Text>
                    <Text className="text-sm font-bold text-slate-900">
                      ₹{property.rent.toLocaleString('en-IN')}/mo
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="text-xs text-slate-500">Security Deposit:</Text>
                    <Text className="text-sm font-semibold text-slate-700">
                      ₹{property.deposit.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View className="flex-row justify-between pt-2 border-t border-slate-200">
                    <Text className="text-xs font-bold text-slate-700">Booking Token Advance:</Text>
                    <Text className="text-sm font-extrabold text-blue-600">
                      ₹{tokenAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                {/* Tenant Inputs */}
                <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Applicant Information
                </Text>

                <View className="mb-3">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Your Name</Text>
                  <TextInput
                    value={tenantName}
                    onChangeText={setTenantName}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm"
                  />
                </View>

                <View className="mb-3">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Phone Number</Text>
                  <TextInput
                    value={tenantPhone}
                    onChangeText={setTenantPhone}
                    keyboardType="phone-pad"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm"
                  />
                </View>

                <View className="mb-3">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Proposed Move-In Date</Text>
                  <TextInput
                    value={moveInDate}
                    onChangeText={setMoveInDate}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-sm"
                  />
                </View>

                <View className="mb-5">
                  <Text className="text-xs font-medium text-slate-600 mb-1">Message for Builder</Text>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={3}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleProceedToPayment}
                  activeOpacity={0.85}
                  className="bg-blue-600 py-3.5 rounded-2xl flex-row items-center justify-center shadow-md shadow-blue-500/20 mb-4"
                >
                  <Text className="text-white font-bold text-sm mr-2">Proceed to Token Payment</Text>
                  <ArrowRight size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2: DUMMY PAYMENT GATEWAY */}
            {step === 'PAYMENT' && (
              <View>
                {/* Payment Amount Card */}
                <View className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4 items-center">
                  <Text className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    Total Token Payable
                  </Text>
                  <Text className="text-3xl font-black text-blue-900 my-1">
                    ₹{tokenAmount.toLocaleString('en-IN')}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <ShieldCheck size={13} color="#059669" />
                    <Text className="text-[11px] text-emerald-700 font-medium ml-1">
                      100% Refundable if application rejected
                    </Text>
                  </View>
                </View>

                {/* Payment Options */}
                <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Payment Method
                </Text>

                <TouchableOpacity
                  onPress={() => setPaymentMethod('UPI')}
                  className={`flex-row items-center p-3.5 rounded-2xl border mb-2.5 ${
                    paymentMethod === 'UPI' ? 'bg-blue-50/70 border-blue-600' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <View className="w-9 h-9 rounded-xl bg-purple-100 items-center justify-center">
                    <Text className="font-black text-purple-700 text-xs">UPI</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-sm text-slate-900">UPI (GPay / PhonePe / Paytm)</Text>
                    <Text className="text-xs text-slate-500">Instant verification & zero fee</Text>
                  </View>
                  <View className={`w-4 h-4 rounded-full border-2 items-center justify-center ${
                    paymentMethod === 'UPI' ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'UPI' && <View className="w-2 h-2 rounded-full bg-blue-600" />}
                  </View>
                </TouchableOpacity>

                {paymentMethod === 'UPI' && (
                  <View className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <Text className="text-[11px] font-medium text-slate-600 mb-1">Enter UPI ID / VPA</Text>
                    <TextInput
                      value={upiId}
                      onChangeText={setUpiId}
                      placeholder="username@bank"
                      className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
                    />
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => setPaymentMethod('CARD')}
                  className={`flex-row items-center p-3.5 rounded-2xl border mb-2.5 ${
                    paymentMethod === 'CARD' ? 'bg-blue-50/70 border-blue-600' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <View className="w-9 h-9 rounded-xl bg-blue-100 items-center justify-center">
                    <CreditCard size={18} color="#2563eb" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-sm text-slate-900">Credit / Debit Card</Text>
                    <Text className="text-xs text-slate-500">Visa, MasterCard, RuPay</Text>
                  </View>
                  <View className={`w-4 h-4 rounded-full border-2 items-center justify-center ${
                    paymentMethod === 'CARD' ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'CARD' && <View className="w-2 h-2 rounded-full bg-blue-600" />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPaymentMethod('NET_BANKING')}
                  className={`flex-row items-center p-3.5 rounded-2xl border mb-5 ${
                    paymentMethod === 'NET_BANKING' ? 'bg-blue-50/70 border-blue-600' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <View className="w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center">
                    <Text className="font-black text-emerald-700 text-xs">NB</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-sm text-slate-900">Net Banking</Text>
                    <Text className="text-xs text-slate-500">HDFC, ICICI, SBI, Axis & more</Text>
                  </View>
                  <View className={`w-4 h-4 rounded-full border-2 items-center justify-center ${
                    paymentMethod === 'NET_BANKING' ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'NET_BANKING' && <View className="w-2 h-2 rounded-full bg-blue-600" />}
                  </View>
                </TouchableOpacity>

                {/* Submit Payment Button */}
                <TouchableOpacity
                  onPress={handleCompletePayment}
                  activeOpacity={0.85}
                  className="bg-emerald-600 py-3.5 rounded-2xl items-center shadow-md shadow-emerald-600/20 mb-3"
                >
                  <Text className="text-white font-bold text-sm">
                    Pay ₹{tokenAmount.toLocaleString('en-IN')} & Submit Booking
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setStep('DETAILS')}
                  className="py-2 items-center mb-4"
                >
                  <Text className="text-xs font-semibold text-slate-500">← Back to application</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {step === 'SUCCESS' && (
              <View className="items-center py-6">
                <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
                  <CheckCircle size={36} color="#059669" />
                </View>

                <Text className="text-2xl font-black text-slate-900 text-center mb-1">
                  Payment & Booking Received!
                </Text>
                <Text className="text-xs text-slate-500 text-center max-w-xs mb-6">
                  Token advance of ₹{tokenAmount.toLocaleString('en-IN')} recorded successfully. The builder ({property.builderName}) has been notified.
                </Text>

                <View className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-xs text-slate-500">Booking Reference:</Text>
                    <Text className="text-xs font-bold text-slate-800">
                      IVM-RENT-{Math.floor(100000 + Math.random() * 900000)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-xs text-slate-500">Property:</Text>
                    <Text className="text-xs font-semibold text-slate-800 flex-1 text-right ml-2" numberOfLines={1}>
                      {property.title}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-500">Applicant:</Text>
                    <Text className="text-xs font-bold text-slate-800">{tenantName}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleFinish}
                  activeOpacity={0.85}
                  className="w-full bg-blue-600 py-3.5 rounded-2xl items-center shadow-md shadow-blue-500/20"
                >
                  <Text className="text-white font-bold text-sm">Done & Return to Explorer</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
