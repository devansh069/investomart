import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Inquiry } from '../types';
import { Phone, MessageSquare, Calendar, User, CheckCircle2 } from 'lucide-react-native';

interface InquiriesScreenProps {
  inquiries: Inquiry[];
  onMarkContacted: (id: string) => void;
}

export const InquiriesScreen: React.FC<InquiriesScreenProps> = ({ inquiries, onMarkContacted }) => {
  const handleCall = (inquiry: Inquiry) => {
    Alert.alert('Call Customer', `Dial ${inquiry.customerPhone} (${inquiry.customerName})?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${inquiry.customerPhone}`) },
    ]);
  };

  const handleWhatsApp = (inquiry: Inquiry) => {
    Alert.alert(
      'Message Tenant',
      `Send WhatsApp reply to ${inquiry.customerName} regarding "${inquiry.propertyTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            onMarkContacted(inquiry.id);
            Alert.alert('Message Sent', `Sent prototype response to ${inquiry.customerName}. Status updated to CONTACTED.`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 pt-3" showsVerticalScrollIndicator={false}>
      <View className="mb-4">
        <Text className="text-xl font-black text-slate-900">Tenant Inquiries & Leads</Text>
        <Text className="text-xs text-slate-500">
          Direct rental applications submitted for your listed properties
        </Text>
      </View>

      {inquiries.length > 0 ? (
        inquiries.map((inq) => {
          const isNew = inq.status === 'NEW';
          return (
            <View
              key={inq.id}
              className={`bg-white rounded-2xl p-4 border mb-3.5 shadow-xs ${
                isNew ? 'border-blue-300' : 'border-slate-200'
              }`}
            >
              {/* Top Row: Customer info & Status */}
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                    <User size={15} color="#2563eb" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
                      {inq.customerName}
                    </Text>
                    <Text className="text-[11px] text-slate-500">{inq.customerPhone}</Text>
                  </View>
                </View>

                <View
                  className={`px-2 py-0.5 rounded-full ${
                    isNew ? 'bg-blue-100' : 'bg-emerald-100'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${
                      isNew ? 'text-blue-700' : 'text-emerald-700'
                    }`}
                  >
                    {inq.status}
                  </Text>
                </View>
              </View>

              {/* Property Tag */}
              <View className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-2">
                <Text className="text-[10px] uppercase font-semibold text-slate-500">Property Applied</Text>
                <Text className="text-xs font-bold text-slate-800 leading-tight mt-0.5">
                  {inq.propertyTitle}
                </Text>
              </View>

              {/* Move in date */}
              <View className="flex-row items-center mb-2">
                <Calendar size={12} color="#64748b" />
                <Text className="text-xs text-slate-600 ml-1">
                  Proposed Move-In: <Text className="font-semibold text-slate-900">{inq.moveInDate}</Text>
                </Text>
              </View>

              {/* Message */}
              <Text className="text-xs text-slate-600 italic bg-slate-50/70 p-2 rounded-lg border border-slate-100 mb-3">
                "{inq.message}"
              </Text>

              {/* Action Buttons */}
              <View className="flex-row space-x-2 pt-2 border-t border-slate-100">
                <TouchableOpacity
                  onPress={() => handleCall(inq)}
                  className="flex-1 bg-white border border-slate-200 py-2 rounded-xl flex-row items-center justify-center shadow-xs"
                >
                  <Phone size={13} color="#2563eb" />
                  <Text className="text-xs font-bold text-slate-700 ml-1.5">Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleWhatsApp(inq)}
                  className="flex-1 bg-emerald-50 border border-emerald-200 py-2 rounded-xl flex-row items-center justify-center ml-2"
                >
                  <MessageSquare size={13} color="#059669" />
                  <Text className="text-xs font-bold text-emerald-800 ml-1.5">WhatsApp</Text>
                </TouchableOpacity>

                {isNew && (
                  <TouchableOpacity
                    onPress={() => onMarkContacted(inq.id)}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-200 ml-2"
                  >
                    <CheckCircle2 size={15} color="#475569" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <View className="py-16 items-center justify-center">
          <Text className="text-slate-400 text-sm">No incoming inquiries right now.</Text>
        </View>
      )}

      <View className="h-10" />
    </ScrollView>
  );
};
