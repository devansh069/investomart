import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { Inquiry, Property } from '../../../types';
import {
  Menu,
  Bell,
  Phone,
  MessageSquare,
  ArrowRight,
  MapPin,
} from 'lucide-react-native';
import { BuilderLogoBadge } from '../../../shared/components/BuilderLogoBadge';

interface InquiriesScreenProps {
  inquiries: Inquiry[];
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
  onMarkContacted?: (id: string) => void;
  onOpenChat?: (inquiry: Inquiry) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
}

type FilterTabKey = 'ALL' | 'NEW' | 'CONTACTED' | 'SITE_VISIT' | 'INTERESTED';

export const InquiriesScreen: React.FC<InquiriesScreenProps> = ({
  inquiries,
  properties = [],
  onSelectProperty,
  onMarkContacted,
  onOpenChat,
  onOpenMenu,
  onOpenNotifications,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTabKey>('ALL');

  // Compute counts dynamically
  const counts = useMemo(() => {
    return {
      all: inquiries.length,
      new: inquiries.filter((i) => i.status === 'NEW').length,
      contacted: inquiries.filter((i) => i.status === 'CONTACTED').length,
      siteVisit: inquiries.filter((i) => i.status === 'SITE_VISIT').length,
      interested: inquiries.filter((i) => i.status === 'INTERESTED').length,
    };
  }, [inquiries]);

  // Filtered inquiries list
  const filteredInquiries = useMemo(() => {
    if (activeTab === 'ALL') return inquiries;
    return inquiries.filter((i) => i.status === activeTab);
  }, [inquiries, activeTab]);

  const handleCall = (inquiry: Inquiry) => {
    Alert.alert('Call Customer', `Dial ${inquiry.customerPhone} (${inquiry.customerName})?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${inquiry.customerPhone}`).catch(() => {
            Alert.alert('Call', `Calling ${inquiry.customerPhone}`);
          });
        },
      },
    ]);
  };

  const handleMessage = (inquiry: Inquiry) => {
    Alert.alert(
      'Message Customer',
      `Send WhatsApp message to ${inquiry.customerName} regarding "${inquiry.propertyTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Message',
          onPress: () => {
            if (onMarkContacted) onMarkContacted(inquiry.id);
            const cleanPhone = inquiry.customerPhone.replace(/[^0-9]/g, '');
            const msg = encodeURIComponent(
              `Hello ${inquiry.customerName}, regarding your inquiry about ${inquiry.propertyTitle}...`
            );
            Linking.openURL(`whatsapp://send?phone=${cleanPhone}&text=${msg}`).catch(() => {
              Alert.alert('Message Sent', `Follow-up logged for ${inquiry.customerName}`);
            });
          },
        },
      ]
    );
  };

  const handleViewDetails = (inquiry: Inquiry) => {
    // If property exists in properties array, open detail modal
    const matchedProp = properties.find(
      (p) => p.id === inquiry.propertyId || p.title.toLowerCase().includes(inquiry.propertyTitle.toLowerCase().split(' ')[0])
    );
    if (matchedProp && onSelectProperty) {
      onSelectProperty(matchedProp);
    } else {
      Alert.alert(
        inquiry.propertyTitle,
        `Location: ${inquiry.propertyLocation || 'Sector 62, Noida'}\nApplicant: ${inquiry.customerName}\nPhone: ${inquiry.customerPhone}\n\nMessage:\n"${inquiry.message}"`
      );
    }
  };

  const renderStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'NEW':
        return (
          <View className="bg-[#DCFCE7] px-2 py-0.5 rounded-md">
            <Text className="text-[11px] font-bold text-[#16A34A]">New</Text>
          </View>
        );
      case 'SITE_VISIT':
        return (
          <View className="bg-[#FEF3C7] px-2 py-0.5 rounded-md">
            <Text className="text-[11px] font-bold text-[#D97706]">Site Visit</Text>
          </View>
        );
      case 'CONTACTED':
        return (
          <View className="bg-[#DBEAFE] px-2 py-0.5 rounded-md">
            <Text className="text-[11px] font-bold text-[#2563EB]">Contacted</Text>
          </View>
        );
      case 'INTERESTED':
        return (
          <View className="bg-[#FEE2E2] px-2 py-0.5 rounded-md">
            <Text className="text-[11px] font-bold text-[#EF4444]">Interested</Text>
          </View>
        );
      default:
        return (
          <View className="bg-slate-100 px-2 py-0.5 rounded-md">
            <Text className="text-[11px] font-bold text-slate-700">{status}</Text>
          </View>
        );
    }
  };

  const tabs: { key: FilterTabKey; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: counts.all },
    { key: 'NEW', label: 'New', count: counts.new },
    { key: 'CONTACTED', label: 'Contacted', count: counts.contacted },
    { key: 'SITE_VISIT', label: 'Site Visit', count: counts.siteVisit },
    { key: 'INTERESTED', label: 'Interested', count: counts.interested },
  ];

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {/* Top Header */}
      <View className="bg-white border-b border-slate-100 px-5 pt-3 pb-3 flex-row items-center justify-between">
        {/* Left: Hamburger menu */}
        <TouchableOpacity
          onPress={onOpenMenu || (() => Alert.alert('Menu', 'Builder Menu Options'))}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-slate-100"
        >
          <Menu size={22} color="#0F172A" />
        </TouchableOpacity>

        {/* Center: Title and Subtitle */}
        <View className="items-center">
          <Text className="text-lg font-bold text-slate-900 leading-tight">Enquiries</Text>
          <Text className="text-xs text-slate-500 mt-0.5">All enquiries for your properties</Text>
        </View>

        {/* Right: Notifications & Profile Avatar */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={onOpenNotifications || (() => Alert.alert('Notifications', 'You have 3 new notifications'))}
            className="w-9 h-9 items-center justify-center rounded-full active:bg-slate-100 relative"
          >
            <Bell size={20} color="#0F172A" />
            {/* Red Notification Badge */}
            <View className="w-2.5 h-2.5 rounded-full bg-red-500 absolute top-1.5 right-1.5 border border-white" />
          </TouchableOpacity>

          <View className="ml-2.5">
            <BuilderLogoBadge size={34} />
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white border-b border-slate-100/70">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
                className={`px-3.5 py-1.5 rounded-xl mr-2.5 ${
                  isActive
                    ? 'bg-[#14532D]'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isActive ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Enquiries List */}
      <ScrollView
        className="flex-1 px-4 pt-3.5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map((inq) => {
            const defaultPropertyImage =
              inq.propertyImage ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80';
            const defaultAvatar =
              inq.customerAvatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
            const locationText = inq.propertyLocation || 'Sector 62, Noida';

            return (
              <View
                key={inq.id}
                className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-xs"
              >
                {/* Header row: Avatar, Name + Badge, Timestamp */}
                <View className="flex-row items-start mb-2.5">
                  <Image
                    source={{ uri: defaultAvatar }}
                    className="w-11 h-11 rounded-full mr-3"
                  />
                  <View className="flex-1 justify-center">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1 mr-2 flex-wrap">
                        <Text
                          className="text-[15px] font-bold text-slate-900 mr-2"
                          numberOfLines={1}
                        >
                          {inq.customerName}
                        </Text>
                        {renderStatusBadge(inq.status)}
                      </View>
                      <Text className="text-[11px] text-slate-400 font-normal">
                        {inq.timeAgo || inq.createdAt || '2 hours ago'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Customer Message Body */}
                <Text className="text-xs text-slate-600 leading-relaxed mb-3">
                  {inq.message}
                </Text>

                {/* Attached Property Card */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleViewDetails(inq)}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex-row items-center mb-3"
                >
                  <Image
                    source={{ uri: defaultPropertyImage }}
                    className="w-14 h-12 rounded-lg mr-3"
                    resizeMode="cover"
                  />
                  <View className="flex-1 justify-center">
                    <Text
                      className="text-xs font-bold text-slate-900 mb-0.5"
                      numberOfLines={1}
                    >
                      {inq.propertyTitle}
                    </Text>
                    <View className="flex-row items-center">
                      <MapPin size={11} color="#475569" />
                      <Text
                        className="text-[11px] text-slate-500 ml-1"
                        numberOfLines={1}
                      >
                        {locationText}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Action Row: Phone, Chat, View Details */}
                <View className="flex-row items-center">
                  {/* Phone Button */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleCall(inq)}
                    className="w-12 h-10 rounded-xl border border-slate-200 items-center justify-center bg-white active:bg-slate-50"
                  >
                    <Phone size={17} color="#1E293B" />
                  </TouchableOpacity>

                  {/* Chat Button */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => (onOpenChat ? onOpenChat(inq) : handleMessage(inq))}
                    className="w-12 h-10 rounded-xl border border-slate-200 items-center justify-center bg-white ml-2.5 active:bg-slate-50"
                  >
                    <MessageSquare size={17} color="#1E293B" />
                  </TouchableOpacity>

                  {/* View Details Button */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleViewDetails(inq)}
                    className="flex-1 h-10 rounded-xl bg-[#ECFDF5] border border-emerald-100 flex-row items-center justify-center ml-2.5 active:bg-emerald-100"
                  >
                    <Text className="text-xs font-bold text-[#059669] mr-1.5">
                      View Details
                    </Text>
                    <ArrowRight size={15} color="#059669" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View className="py-20 items-center justify-center">
            <Text className="text-slate-400 text-sm">
              No enquiries found in this category.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
