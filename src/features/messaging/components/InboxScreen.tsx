import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { ChatConversation, ChatRole } from '../../../types/chat';
import { UserRole } from '../../../types';
import { BuilderLogoBadge } from '../../../shared/components/BuilderLogoBadge';
import {
  Menu,
  Home,
  Bell,
  Search,
  SlidersHorizontal,
  MapPin,
  BellOff,
} from 'lucide-react-native';

interface InboxScreenProps {
  conversations: ChatConversation[];
  userRole?: UserRole;
  onSelectConversation: (conversation: ChatConversation) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
}

type FilterTabKey = 'ALL' | 'BUYERS' | 'TENANTS' | 'BROKERS';

export const InboxScreen: React.FC<InboxScreenProps> = ({
  conversations,
  userRole = 'customer',
  onSelectConversation,
  onOpenMenu,
  onOpenNotifications,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTabKey>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const counts = useMemo(() => {
    return {
      all: conversations.length,
      buyers: conversations.filter((c) => c.role === 'Buyer').length,
      tenants: conversations.filter((c) => c.role === 'Tenant').length,
      brokers: conversations.filter((c) => c.role === 'Broker').length,
    };
  }, [conversations]);

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    let list = conversations;
    if (activeTab === 'BUYERS') list = list.filter((c) => c.role === 'Buyer');
    if (activeTab === 'TENANTS') list = list.filter((c) => c.role === 'Tenant');
    if (activeTab === 'BROKERS') list = list.filter((c) => c.role === 'Broker');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.property.title.toLowerCase().includes(q) ||
          c.property.location.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, activeTab, searchQuery]);

  const renderRoleBadge = (role: ChatRole) => {
    switch (role) {
      case 'Buyer':
        return (
          <View className="bg-[#DCFCE7] px-2 py-0.5 rounded-md">
            <Text className="text-[11px] font-bold text-[#16A34A]">Buyer</Text>
          </View>
        );
      case 'Tenant':
        return (
          <View className="bg-[#FEF3C7] px-2 py-0.5 rounded-md">
            <Text className="text-[11px] font-bold text-[#D97706]">Tenant</Text>
          </View>
        );
      case 'Broker':
        return (
          <View className="bg-[#DBEAFE] px-2 py-0.5 rounded-md">
            <Text className="text-[11px] font-bold text-[#2563EB]">Broker</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const tabs: { key: FilterTabKey; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: counts.all },
    { key: 'BUYERS', label: 'Buyers', count: counts.buyers },
    { key: 'TENANTS', label: 'Tenants', count: counts.tenants },
    { key: 'BROKERS', label: 'Brokers', count: counts.brokers },
  ];

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {/* Top Header */}
      <View className="bg-white px-5 pt-3 pb-3 border-b border-slate-100 flex-row items-center justify-between">
        {/* Left: Hamburger menu */}
        <TouchableOpacity
          onPress={onOpenMenu || (() => Alert.alert('Menu', 'InvestoMart Menu'))}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-slate-100"
        >
          <Menu size={22} color="#0F172A" />
        </TouchableOpacity>

        {/* Center: InvestoMart Logo & Name */}
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-lg bg-emerald-600 items-center justify-center mr-1.5 shadow-xs">
            <Home size={15} color="#FFFFFF" strokeWidth={2.4} />
          </View>
          <Text className="text-lg font-black text-slate-900 tracking-tight">
            Investo<Text className="text-emerald-700">Mart</Text>
          </Text>
        </View>

        {/* Right: Notification Bell & Profile Avatar / Builder Logo */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={onOpenNotifications || (() => Alert.alert('Notifications', 'No unread notifications'))}
            className="w-9 h-9 items-center justify-center rounded-full active:bg-slate-100 relative"
          >
            <Bell size={20} color="#0F172A" />
            <View className="w-2.5 h-2.5 rounded-full bg-red-500 absolute top-1.5 right-1.5 border border-white" />
          </TouchableOpacity>

          <View className="ml-2.5">
            {userRole === 'builder' ? (
              <BuilderLogoBadge size={34} />
            ) : (
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                }}
                className="w-8 h-8 rounded-full border border-slate-200"
              />
            )}
          </View>
        </View>
      </View>

      {/* Main Body */}
      <ScrollView
        className="flex-1 px-4 pt-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Title and Subtitle */}
        <View className="mb-3 px-1">
          <Text className="text-2xl font-black text-slate-900">Inbox</Text>
          <Text className="text-xs text-slate-500 mt-0.5">
            Chat with buyers, tenants and brokers
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mb-3">
          <View className="flex-1 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center shadow-xs">
            <Search size={18} color="#94A3B8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search conversations..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2.5 text-xs text-slate-900 py-0"
            />
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert('Filters', 'Conversation filter settings')}
            className="w-11 h-11 ml-2.5 bg-white border border-slate-200 rounded-2xl items-center justify-center shadow-xs active:bg-slate-50"
          >
            <SlidersHorizontal size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Horizontal Filter Tabs */}
        <View className="mb-3.5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}
                  className={`px-3.5 py-1.5 rounded-xl mr-2 ${
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

        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            return (
              <TouchableOpacity
                key={conv.id}
                activeOpacity={0.85}
                onPress={() => onSelectConversation(conv)}
                className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-xs"
              >
                {/* Header row: Avatar, Name + Role Badge, Time + Unread/Muted */}
                <View className="flex-row items-start mb-2">
                  <Image
                    source={{ uri: conv.avatar }}
                    className="w-11 h-11 rounded-full mr-3"
                  />
                  <View className="flex-1 justify-center">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1 mr-2 flex-wrap">
                        <Text
                          className="text-[15px] font-bold text-slate-900 mr-2"
                          numberOfLines={1}
                        >
                          {conv.name}
                        </Text>
                        {renderRoleBadge(conv.role)}
                      </View>

                      <View className="items-end">
                        <Text className="text-[11px] text-slate-400 font-normal">
                          {conv.time}
                        </Text>
                        {conv.unreadCount && conv.unreadCount > 0 ? (
                          <View className="w-5 h-5 rounded-full bg-[#16A34A] items-center justify-center mt-1">
                            <Text className="text-[10px] font-bold text-white">
                              {conv.unreadCount}
                            </Text>
                          </View>
                        ) : conv.isMuted ? (
                          <View className="mt-1">
                            <BellOff size={13} color="#94A3B8" />
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Message preview */}
                <Text
                  className="text-xs text-slate-600 leading-relaxed mb-2.5"
                  numberOfLines={2}
                >
                  {conv.lastMessage}
                </Text>

                {/* Attached Property Card Preview */}
                <View className="bg-slate-50 border border-slate-100 rounded-xl p-2 flex-row items-center">
                  <Image
                    source={{ uri: conv.property.image }}
                    className="w-13 h-10 rounded-lg mr-2.5"
                    resizeMode="cover"
                  />
                  <View className="flex-1 justify-center">
                    <Text
                      className="text-xs font-bold text-slate-900 mb-0.5"
                      numberOfLines={1}
                    >
                      {conv.property.title}
                    </Text>
                    <View className="flex-row items-center">
                      <MapPin size={11} color="#475569" />
                      <Text
                        className="text-[11px] text-slate-500 ml-1"
                        numberOfLines={1}
                      >
                        {conv.property.location}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="py-20 items-center justify-center">
            <Text className="text-slate-400 text-sm">
              No conversations found.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
