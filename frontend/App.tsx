import './global.css';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { User, Property, Inquiry, FilterState } from './src/types';
import { clearSession, readSession, saveSession, StoredSession } from './src/core/auth/session';
import {
  createProviderListing,
  fetchFavorites,
  fetchListings,
  fetchProviderDashboard,
  fetchProviderInquiries,
  logout,
  mapAccount,
  submitInquiry,
  toggleFavorite,
  updateInquiryStatus,
  updateMyProfile,
  updateProviderListingStatus,
  type ProviderListingStatusAction,
  uploadLegacyPropertyImage,
} from './src/core/api/investormart';

import { BottomNav, CustomerTabKey, BuilderTabKey } from './src/shared/components/BottomNav';
import { CustomerHome } from './src/features/discovery/components/CustomerHome';
import { PropertyDetailModal } from './src/features/discovery/components/PropertyDetailModal';
import { RentBookingModal } from './src/features/booking/components/RentBookingModal';
import { FilterModal } from './src/features/discovery/components/FilterModal';
import { AddPropertyModal, type PropertyListingDraft } from './src/features/broker/components/AddPropertyModal';
import { BuilderDashboard } from './src/features/broker/components/BuilderDashboard';
import { BuilderPropertiesScreen } from './src/features/broker/components/BuilderPropertiesScreen';
import { InquiriesScreen } from './src/features/broker/components/InquiriesScreen';
import { GovtResourcesScreen } from './src/features/resources/components/GovtResourcesScreen';
import { ProfileScreen } from './src/features/profile/components/ProfileScreen';
import { LandingScreen } from './src/features/onboarding/components/LandingScreen';
import { OtpLoginScreen, type SignupDetails } from './src/features/auth/components/OtpLoginScreen';
import { RoleSelectionScreen } from './src/features/auth/components/RoleSelectionScreen';
import { AdminPanelScreen } from './src/features/admin/components/AdminPanelScreen';

const defaultFilters: FilterState = {
  searchQuery: '',
  city: 'All Cities',
  propertyType: 'All',
  bhk: null,
  bathrooms: null,
  // No hidden budget or area limit on first load. The catalogue contains
  // sale and large-area properties in addition to ordinary rentals.
  minRent: null,
  maxRent: null,
  minArea: null,
  maxArea: null,
  furnishing: 'All',
  selectedAmenities: [],
};

const guestUser: User = { id: 'guest', name: 'Guest', email: '', phone: '', role: 'customer' };

export default function App() {
  // Onboarding stages: 'landing' -> 'otp' -> 'role_select' -> 'authenticated'
  const [onboardingStage, setOnboardingStage] = useState<'landing' | 'otp' | 'role_select' | 'authenticated'>('landing');

  // App state
  const [session, setSession] = useState<StoredSession | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(guestUser);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [listingCapacity, setListingCapacity] = useState(10);

  // Active navigation tabs
  const [activeCustomerTab, setActiveCustomerTab] = useState<CustomerTabKey>('home');
  const [activeBuilderTab, setActiveBuilderTab] = useState<BuilderTabKey>('home');

  // Modals state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addPropertyModalVisible, setAddPropertyModalVisible] = useState(false);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [adminPanelVisible, setAdminPanelVisible] = useState(false);

  const loadPublicListings = useCallback(async () => {
    try {
      setProperties(await fetchListings());
    } catch {
      Alert.alert('Unable to load properties', 'Please check your internet connection and try again.');
    }
  }, []);

  const loadAuthenticatedData = useCallback(async (activeSession: StoredSession) => {
    if (['builder', 'owner', 'broker'].includes(activeSession.account.role)) {
      const [dashboard, providerInquiries] = await Promise.all([
        fetchProviderDashboard(activeSession.accessToken),
        fetchProviderInquiries(activeSession.accessToken),
      ]);
      setProperties(dashboard.listings);
      setInquiries(providerInquiries);
      setListingCapacity(dashboard.capacity.total);
    } else {
      const [catalogue, favorites] = await Promise.all([fetchListings(), fetchFavorites(activeSession.accessToken)]);
      setProperties(catalogue);
      setFavoriteIds(favorites.map((property) => property.id));
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const existingSession = await readSession();
      if (existingSession) {
        setSession(existingSession);
        setCurrentUser(mapAccount(existingSession.account));
        if (existingSession.account.requires_role_selection) {
          setOnboardingStage('role_select');
        } else {
          setOnboardingStage('authenticated');
          await loadAuthenticatedData(existingSession);
        }
      } else {
        await loadPublicListings();
      }
    })();
  }, [loadAuthenticatedData, loadPublicListings]);

  // Handlers
  const handleAddProperty = async (draft: PropertyListingDraft) => {
    if (!session) throw new Error('Please sign in before adding a property.');
    const imageKeys: string[] = [];
    for (const image of draft.images) {
      imageKeys.push(await uploadLegacyPropertyImage(session.accessToken, image));
    }
    const { images, ...propertyPayload } = draft;
    const listing = await createProviderListing(session.accessToken, {
      ...propertyPayload,
      cover_image: imageKeys[0],
      gallery_images: imageKeys,
      contact_phone: currentUser.phone,
    });
    setProperties((current) => [listing, ...current]);
  };

  const handleDeleteProperty = async (id: string) => {
    const property = properties.find((item) => item.id === id);
    if (!property || !session || property.readOnly) return;
    try {
      await updateProviderListingStatus(session.accessToken, property, 'delete');
      // Provider deletion is a soft delete in the legacy database. It is no
      // longer returned by the provider API, so remove it from this device too.
      setProperties((current) => current.filter((item) => item.id !== id));
    } catch {
      Alert.alert('Unable to delete property', 'Please try again. Your property has not been removed.');
    }
  };

  const handleChangePropertyStatus = async (id: string, action: ProviderListingStatusAction) => {
    const property = properties.find((item) => item.id === id);
    if (!property || !session || property.readOnly) return;
    try {
      const listing = await updateProviderListingStatus(session.accessToken, property, action);
      setProperties((current) => current.map((item) => item.id === id ? listing : item));
      if (action === 'restore') {
        Alert.alert('Sent for approval', 'The property has been restored and sent to the admin for approval before it becomes live.');
      }
    } catch {
      Alert.alert('Unable to update property', 'Please try again. The property status was not changed.');
    }
  };

  const handleBookingSubmit = async (newInquiry: Inquiry) => {
    const property = properties.find((item) => item.id === newInquiry.propertyId);
    if (!session || !property) {
      setOnboardingStage('otp');
      throw new Error('Please log in before sending an enquiry.');
    }
    const inquiry = await submitInquiry(session.accessToken, property, {
      channel: 'form', name: newInquiry.customerName, phone: newInquiry.customerPhone,
      email: newInquiry.customerEmail, message: newInquiry.message, move_in_date: newInquiry.moveInDate,
    });
    setInquiries((current) => [inquiry, ...current]);
  };

  const handleMarkContacted = async (id: string) => {
    if (!session) return;
    await updateInquiryStatus(session.accessToken, id, 'contacted');
    setInquiries((current) => current.map((inq) => (inq.id === id ? { ...inq, status: 'CONTACTED' } : inq)));
  };

  const handleFavorite = async (propertyId: string) => {
    const property = properties.find((item) => item.id === propertyId);
    if (!property || !session) {
      Alert.alert('Login required', 'Please log in to save properties to your favourites.');
      setOnboardingStage('otp');
      return;
    }
    const isFavorite = await toggleFavorite(session.accessToken, property);
    setFavoriteIds((current) => isFavorite ? [...new Set([...current, propertyId])] : current.filter((id) => id !== propertyId));
  };

  const handleContact = async (property: Property, channel: 'call' | 'whatsapp'): Promise<boolean> => {
    if (!session) {
      Alert.alert('Login required', 'Please log in before contacting a provider.');
      setOnboardingStage('otp');
      return false;
    }
    try {
      const inquiry = await submitInquiry(session.accessToken, property, { channel });
      setInquiries((current) => [inquiry, ...current]);
      return true;
    } catch {
      Alert.alert('Unable to record enquiry', 'Please try again before contacting the provider.');
      return false;
    }
  };

  const handleLogout = async () => {
    if (session) {
      try { await logout(session.accessToken); } catch { /* Local token removal still protects this device. */ }
    }
    await clearSession();
    setSession(null);
    setCurrentUser(guestUser);
    setFavoriteIds([]);
    setInquiries([]);
    setOnboardingStage('landing');
    await loadPublicListings();
  };

  const openAdminPanel = () => {
    if (!session?.account.is_admin) {
      Alert.alert('Admin access required', 'Sign in with an account configured as an InvestorMart administrator.');
      return;
    }
    setAdminPanelVisible(true);
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
              onUpdateFilters={setFilters}
              onClearFilters={() => setFilters(defaultFilters)}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleFavorite}
            />
          );
        case 'explore':
          return (
            <CustomerHome
              properties={properties}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onOpenFilter={() => setFilterModalVisible(true)}
              filters={filters}
              onUpdateFilters={setFilters}
              onClearFilters={() => setFilters(defaultFilters)}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleFavorite}
              onGoBack={() => setActiveCustomerTab('home')}
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
              onUpdateFilters={setFilters}
              onClearFilters={() => setFilters(defaultFilters)}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleFavorite}
              onGoBack={() => setActiveCustomerTab('home')}
              mode="saved"
            />
          );
        case 'profile':
          return (
            <ProfileScreen
              currentUser={currentUser}
              onOpenAuth={() => setOnboardingStage('otp')}
              onOpenAdmin={openAdminPanel}
              onLogout={() => { void handleLogout(); }}
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
          return (
            <BuilderDashboard
              properties={properties}
              inquiries={inquiries}
              onOpenAddModal={() => setAddPropertyModalVisible(true)}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onDeleteProperty={handleDeleteProperty}
              onChangeStatus={handleChangePropertyStatus}
              builderName={currentUser.companyName || currentUser.name}
              listingCapacity={listingCapacity}
            />
          );
        case 'listings':
          return (
            <BuilderPropertiesScreen
              properties={properties}
              onOpenAddModal={() => setAddPropertyModalVisible(true)}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onDeleteProperty={handleDeleteProperty}
              onChangeStatus={handleChangePropertyStatus}
              onBack={() => setActiveBuilderTab('home')}
            />
          );
        case 'inquiries':
          return (
            <InquiriesScreen
              inquiries={inquiries}
              properties={properties}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              onMarkContacted={handleMarkContacted}
            />
          );
        case 'profile':
          return (
            <ProfileScreen
              currentUser={currentUser}
              onOpenAuth={() => setOnboardingStage('otp')}
              onOpenAdmin={openAdminPanel}
              onLogout={() => { void handleLogout(); }}
              propertiesCount={properties.length}
              inquiriesCount={inquiries.length}
              listingCapacity={listingCapacity}
              properties={properties}
              onSelectProperty={(prop) => setDetailProperty(prop)}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleFavorite}
            />
          );
        default:
          return null;
      }
    }
  };

  if (onboardingStage === 'landing') {
    return (
      <SafeAreaProvider>
        <LandingScreen
          onGetStarted={() => {
            setOnboardingStage('otp');
          }}
        />
      </SafeAreaProvider>
    );
  }

  if (onboardingStage === 'otp') {
    return (
      <SafeAreaProvider>
        <OtpLoginScreen
          onLoginSuccess={async (nextSession, signupDetails?: SignupDetails) => {
            let resolvedSession = nextSession;

            // The server marks a number as new only after successful OTP
            // verification. Apply registration data only in that case, so an
            // existing user cannot accidentally overwrite their saved role.
            if (signupDetails && nextSession.account.requires_role_selection) {
              const account = await updateMyProfile(nextSession.accessToken, signupDetails);
              resolvedSession = { ...nextSession, account };
            } else if (signupDetails) {
              Alert.alert('Account already exists', 'You have been signed in with your saved InvestorMart account type.');
            }

            await saveSession(resolvedSession);
            setSession(resolvedSession);
            setCurrentUser(mapAccount(resolvedSession.account));
            if (resolvedSession.account.requires_role_selection) {
              setOnboardingStage('role_select');
            } else {
              setOnboardingStage('authenticated');
              await loadAuthenticatedData(resolvedSession);
            }
            setActiveCustomerTab('home');
          }}
          onBack={() => {
            setOnboardingStage('landing');
          }}
          onSkip={() => {
            setSession(null);
            setCurrentUser(guestUser);
            setActiveCustomerTab('home');
            setOnboardingStage('authenticated');
            void loadPublicListings();
          }}
        />
      </SafeAreaProvider>
    );
  }

  if (onboardingStage === 'role_select') {
    return (
      <SafeAreaProvider>
        <RoleSelectionScreen
          onSelectRole={async (role) => {
            if (!session) return;
            try {
              const account = await updateMyProfile(session.accessToken, { role });
              const nextSession = { ...session, account };
              await saveSession(nextSession);
              setSession(nextSession);
              setCurrentUser(mapAccount(account));
              if (['builder', 'owner', 'broker'].includes(role)) setActiveBuilderTab('home'); else setActiveCustomerTab('home');
              setOnboardingStage('authenticated');
              await loadAuthenticatedData(nextSession);
            } catch {
              Alert.alert('Unable to save account type', 'Please check your connection and try again.');
            }
          }}
          onBack={() => {
            setOnboardingStage('otp');
          }}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        {adminPanelVisible && session ? (
          <AdminPanelScreen accessToken={session.accessToken} onBack={() => setAdminPanelVisible(false)} />
        ) : <>

        {/* Main View Area */}
        <View className="flex-1 bg-slate-50">
          {renderScreenContent()}
        </View>

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
          onOpenMessages={() => undefined}
          onRecordContact={handleContact}
          isFavorite={detailProperty ? favoriteIds.includes(detailProperty.id) : false}
          onToggleFavorite={handleFavorite}
          allProperties={properties}
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
          allProperties={properties}
        />

        {/* Builder Add Property Modal */}
        <AddPropertyModal
          visible={addPropertyModalVisible}
          onClose={() => setAddPropertyModalVisible(false)}
          onAddProperty={handleAddProperty}
        />
        </>}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
