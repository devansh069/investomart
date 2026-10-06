import './global.css';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { User, Property, Inquiry, FilterState } from './src/types';
import { initialProperties, initialInquiries, mockUsers } from './src/mock/data';

import { BottomNav, CustomerTabKey, BuilderTabKey } from './src/shared/components/BottomNav';
import { CustomerHome } from './src/features/discovery/components/CustomerHome';
import { PropertyDetailModal } from './src/features/discovery/components/PropertyDetailModal';
import { RentBookingModal } from './src/features/booking/components/RentBookingModal';
import { FilterModal } from './src/features/discovery/components/FilterModal';
import { AuthModal } from './src/features/auth/components/AuthModal';
import { AddPropertyModal } from './src/features/broker/components/AddPropertyModal';
import { BuilderDashboard } from './src/features/broker/components/BuilderDashboard';
import { InquiriesScreen } from './src/features/broker/components/InquiriesScreen';
import { GovtResourcesScreen } from './src/features/resources/components/GovtResourcesScreen';
import { ProfileScreen } from './src/features/profile/components/ProfileScreen';
import { MessagesScreen } from './src/features/messaging/components/MessagesScreen';

const defaultFilters: FilterState = {
  city: 'All Cities',
  propertyType: 'All',
  bhk: null,
  maxRent: null,
  furnishing: 'All',
  selectedAmenities: [],
};

export default function App() {
  // App state
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.customer);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);

  // Active navigation tabs
  const [activeCustomerTab, setActiveCustomerTab] = useState<CustomerTabKey>('home');
  const [activeBuilderTab, setActiveBuilderTab] = useState<BuilderTabKey>('home');

  // Modals state
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addPropertyModalVisible, setAddPropertyModalVisible] = useState(false);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);

  // Search & Filters state
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Handlers
  const handleToggleRole = () => {
    if (currentUser.role === 'customer') {
      setCurrentUser(mockUsers.builder);
      setActiveBuilderTab('home');
    } else {
      setCurrentUser(mockUsers.customer);
      setActiveCustomerTab('home');
    }
  };

  const handleAddProperty = (newProperty: Property) => {
    setProperties([newProperty, ...properties]);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  const handleTogglePropertyStatus = (id: string) => {
    setProperties(
      properties.map((p) =>
        p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : p
      )
    );
  };

  const handleBookingSubmit = (newInquiry: Inquiry) => {
    setInquiries([newInquiry, ...inquiries]);
  };

  const handleMarkContacted = (id: string) => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: 'CONTACTED' } : inq))
    );
  };

  // Render main screen content based on user role and active tab
  const renderScreenContent = () => {
    if (currentUser.role === 'customer') {
      switch (activeCustomerTab) {
        case 'home':
          return (
            <CustomerHome
              properties={properties}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onOpenFilter={() => setFilterModalVisible(true)}
              filters={filters}
              onClearFilters={() => setFilters(defaultFilters)}
              favoriteIds={favoriteIds}
              onToggleFavorite={(propertyId) => setFavoriteIds((current) => current.includes(propertyId) ? current.filter((id) => id !== propertyId) : [...current, propertyId])}
            />
          );
        case 'explore':
          return (
            <CustomerHome
              properties={properties}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onOpenFilter={() => setFilterModalVisible(true)}
              filters={filters}
              onClearFilters={() => setFilters(defaultFilters)}
              favoriteIds={favoriteIds}
              onToggleFavorite={(propertyId) => setFavoriteIds((current) => current.includes(propertyId) ? current.filter((id) => id !== propertyId) : [...current, propertyId])}
              mode="results"
            />
          );
        case 'favorites':
          return (
            <CustomerHome
              properties={properties}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onOpenFilter={() => setFilterModalVisible(true)}
              filters={filters}
              onClearFilters={() => setFilters(defaultFilters)}
              favoriteIds={favoriteIds}
              onToggleFavorite={(propertyId) => setFavoriteIds((current) => current.includes(propertyId) ? current.filter((id) => id !== propertyId) : [...current, propertyId])}
              mode="saved"
            />
          );
        case 'messages':
          return <MessagesScreen />;
        case 'profile':
          return (
            <ProfileScreen
              currentUser={currentUser}
              onToggleRole={handleToggleRole}
              onOpenAuth={() => setAuthModalVisible(true)}
              onLogout={() => {
                setCurrentUser(mockUsers.customer);
                setAuthModalVisible(true);
              }}
              propertiesCount={properties.length}
              inquiriesCount={inquiries.length}
            />
          );
        default:
          return null;
      }
    } else {
      // Builder View
      switch (activeBuilderTab) {
        case 'home':
        case 'listings':
          return (
            <BuilderDashboard
              properties={properties}
              inquiries={inquiries}
              onOpenAddModal={() => setAddPropertyModalVisible(true)}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onDeleteProperty={handleDeleteProperty}
              onToggleStatus={handleTogglePropertyStatus}
              builderName={currentUser.companyName || currentUser.name}
            />
          );
        case 'inquiries':
          return (
            <InquiriesScreen
              inquiries={inquiries}
              onMarkContacted={handleMarkContacted}
            />
          );
        case 'resources':
          return <GovtResourcesScreen />;
        case 'profile':
          return (
            <ProfileScreen
              currentUser={currentUser}
              onToggleRole={handleToggleRole}
              onOpenAuth={() => setAuthModalVisible(true)}
              onLogout={() => {
                setCurrentUser(mockUsers.customer);
                setAuthModalVisible(true);
              }}
              propertiesCount={properties.length}
              inquiriesCount={inquiries.length}
            />
          );
        default:
          return null;
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        {/* Main View Area */}
        <View className="flex-1 bg-slate-50">
          {renderScreenContent()}
        </View>

        {/* Bottom Navigation */}
        <BottomNav
          role={currentUser.role}
          activeCustomerTab={activeCustomerTab}
          activeBuilderTab={activeBuilderTab}
          onSelectCustomerTab={setActiveCustomerTab}
          onSelectBuilderTab={(tab) => {
            setActiveBuilderTab(tab);
          }}
          inquiriesCount={inquiries.filter((i) => i.status === 'NEW').length}
        />

        {/* Property Detail Modal */}
        <PropertyDetailModal
          property={detailProperty}
          visible={detailProperty !== null}
          onClose={() => setDetailProperty(null)}
          onApplyRent={(prop) => {
            setDetailProperty(null);
            setBookingProperty(prop);
          }}
          onOpenMessages={() => setActiveCustomerTab('messages')}
        />

        {/* Rent Booking & Payment Gateway Modal */}
        <RentBookingModal
          property={bookingProperty}
          visible={bookingProperty !== null}
          onClose={() => setBookingProperty(null)}
          onSubmitBooking={handleBookingSubmit}
        />

        {/* Multi-Parameter Filter Modal */}
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          filters={filters}
          onApplyFilters={setFilters}
          onResetFilters={() => setFilters(defaultFilters)}
        />

        {/* Login & Signup Modal */}
        <AuthModal
          visible={authModalVisible}
          onClose={() => setAuthModalVisible(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (user.role === 'builder') {
              setActiveBuilderTab('home');
            } else {
              setActiveCustomerTab('home');
            }
          }}
        />

        {/* Builder Add Property Modal */}
        <AddPropertyModal
          visible={addPropertyModalVisible}
          onClose={() => setAddPropertyModalVisible(false)}
          onAddProperty={handleAddProperty}
          builderName={currentUser.companyName || currentUser.name}
          builderPhone={currentUser.phone}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
