import './global.css';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { User, Property, Inquiry, FilterState } from './src/types';
import { initialProperties, initialInquiries, mockUsers } from './src/mock/data';

import { Header } from './src/components/Header';
import { BottomNav, CustomerTabKey, BuilderTabKey } from './src/components/BottomNav';
import { CustomerHome } from './src/components/CustomerHome';
import { PropertyDetailModal } from './src/components/PropertyDetailModal';
import { RentBookingModal } from './src/components/RentBookingModal';
import { FilterModal } from './src/components/FilterModal';
import { AuthModal } from './src/components/AuthModal';
import { AddPropertyModal } from './src/components/AddPropertyModal';
import { BuilderDashboard } from './src/components/BuilderDashboard';
import { InquiriesScreen } from './src/components/InquiriesScreen';
import { GovtResourcesScreen } from './src/components/GovtResourcesScreen';
import { ProfileScreen } from './src/components/ProfileScreen';

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
  const [activeCustomerTab, setActiveCustomerTab] = useState<CustomerTabKey>('explore');
  const [activeBuilderTab, setActiveBuilderTab] = useState<BuilderTabKey>('listings');

  // Modals state
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addPropertyModalVisible, setAddPropertyModalVisible] = useState(false);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);

  // Search & Filters state
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Handlers
  const handleToggleRole = () => {
    if (currentUser.role === 'customer') {
      setCurrentUser(mockUsers.builder);
      setActiveBuilderTab('listings');
    } else {
      setCurrentUser(mockUsers.customer);
      setActiveCustomerTab('explore');
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
        p.id === id ? { ...p, status: p.status === 'AVAILABLE' ? 'RENTED' : 'AVAILABLE' } : p
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
        case 'explore':
        case 'favorites':
          return (
            <CustomerHome
              properties={properties}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onOpenFilter={() => setFilterModalVisible(true)}
              filters={filters}
              onClearFilters={() => setFilters(defaultFilters)}
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
    } else {
      // Builder View
      switch (activeBuilderTab) {
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
        case 'add':
          // Also renders dashboard while opening add modal
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

        {/* Global App Header */}
        <Header
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalVisible(true)}
          onToggleRole={handleToggleRole}
        />

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
            if (tab === 'add') {
              setAddPropertyModalVisible(true);
            } else {
              setActiveBuilderTab(tab);
            }
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
              setActiveBuilderTab('listings');
            } else {
              setActiveCustomerTab('explore');
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
