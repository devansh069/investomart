import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Property, BuilderProfile } from '../../../types';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { BuilderProfileView } from './BuilderProfileView';

interface BuilderProfileModalProps {
  visible: boolean;
  onClose: () => void;
  builderProfile: BuilderProfile;
  builderProperties?: Property[];
  onSelectProperty: (property: Property) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (propertyId: string) => void;
  onOpenMessages: () => void;
}

export const BuilderProfileModal: React.FC<BuilderProfileModalProps> = ({
  visible,
  onClose,
  builderProfile,
  builderProperties = [],
  onSelectProperty,
  favoriteIds = [],
  onToggleFavorite,
  onOpenMessages,
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44);
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View
        className="flex-1 bg-white"
        style={{ paddingTop: topInset, paddingBottom: bottomInset }}
      >
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

          <Text className="text-base font-bold text-slate-900 tracking-tight">Builder Profile</Text>

          <TouchableOpacity
            onPress={() =>
              Share.share({
                message: `Check out ${builderProfile.name || 'Nexa Homes'} on InvestoMart! Verified Developer.`,
              })
            }
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <Share2 size={16} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Page Body */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <BuilderProfileView
            builderProfile={builderProfile}
            builderProperties={builderProperties}
            onSelectProperty={(prop) => {
              onClose();
              onSelectProperty(prop);
            }}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
            onOpenMessages={onOpenMessages}
            isOwnerView={false}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};
