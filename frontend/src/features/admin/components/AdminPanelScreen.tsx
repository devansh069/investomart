import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Check, Clock3, X } from 'lucide-react-native';
import { fetchAdminOverview, reviewListing } from '../../../core/api/investormart';
import type { Inquiry, Property } from '../../../types';

interface AdminPanelScreenProps {
  accessToken: string;
  onBack: () => void;
}

export function AdminPanelScreen({ accessToken, onBack }: AdminPanelScreenProps) {
  const [pending, setPending] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const overview = await fetchAdminOverview(accessToken);
      setPending(overview.pending);
      setInquiries(overview.inquiries);
    } catch {
      Alert.alert('Unable to load admin data', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const review = async (property: Property, decision: 'approved' | 'rejected') => {
    try {
      await reviewListing(accessToken, property, decision);
      setPending((current) => current.filter((item) => item.id !== property.id));
    } catch (error) {
      Alert.alert('Review failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 32 }}>
      <View className="px-5 py-4 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={onBack} className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
          <ArrowLeft size={18} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-base font-bold text-slate-900 mr-9">Admin Panel</Text>
      </View>

      <View className="px-5 pt-5">
        <Text className="text-lg font-bold text-slate-900">Pending Property Approvals</Text>
        <Text className="text-xs text-slate-500 mt-1">Review provider submissions before clients can view them.</Text>

        {loading ? <Text className="text-sm text-slate-500 mt-5">Loading admin data…</Text> : null}
        {!loading && pending.length === 0 ? <Text className="text-sm text-slate-500 mt-5">No properties are awaiting approval.</Text> : null}

        {pending.map((property) => (
          <View key={property.id} className="mt-4 p-4 bg-white rounded-2xl border border-slate-200">
            <Text className="text-sm font-bold text-slate-900">{property.title}</Text>
            <Text className="text-xs text-slate-500 mt-1">{property.location}, {property.city} · {property.builderName}</Text>
            <View className="flex-row mt-3">
              <TouchableOpacity onPress={() => void review(property, 'approved')} className="flex-1 py-2.5 rounded-xl bg-emerald-600 items-center flex-row justify-center mr-2">
                <Check size={15} color="#fff" /><Text className="text-xs font-bold text-white ml-1">Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => void review(property, 'rejected')} className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-200 items-center flex-row justify-center ml-2">
                <X size={15} color="#dc2626" /><Text className="text-xs font-bold text-red-600 ml-1">Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text className="text-lg font-bold text-slate-900 mt-8">Recent Enquiries</Text>
        {inquiries.map((inquiry) => (
          <View key={inquiry.id} className="mt-3 p-4 bg-white rounded-2xl border border-slate-200">
            <View className="flex-row items-center justify-between"><Text className="text-sm font-bold text-slate-900">{inquiry.customerName}</Text><Clock3 size={15} color="#64748b" /></View>
            <Text className="text-xs text-slate-500 mt-1">{inquiry.propertyTitle} · {inquiry.status}</Text>
            <Text className="text-xs text-slate-600 mt-2">{inquiry.message}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
