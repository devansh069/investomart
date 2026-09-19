import './global.css';
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Header } from './src/components/ui/Header';
import { BottomNav, TabKey } from './src/components/ui/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { MarketsScreen } from './src/screens/MarketsScreen';
import { PortfolioScreen } from './src/screens/PortfolioScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { mockUser } from './src/mock/data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'markets':
        return <MarketsScreen />;
      case 'portfolio':
        return <PortfolioScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-950" edges={['top', 'left', 'right']}>
        <StatusBar style="light" />

        {/* Global App Header */}
        <Header
          user={mockUser}
          onNotificationPress={() =>
            Alert.alert(
              'Notifications',
              '• Market Alert: Bitcoin up +3.82% in last 24h\n• Dividend received: $14.20 from AAPL'
            )
          }
        />

        {/* Dynamic Screen Content */}
        <View className="flex-1 bg-slate-950">
          {renderContent()}
        </View>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
