import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { Icon, IconName } from '../components/common/Icon';
import { Header } from '../components/common/Header';
import { WebSafeArea } from '../components/common/WebSafeArea';

// Admin Screens
import { AdminDashboardScreen } from '../features/admin/screens/AdminDashboardScreen';
import { ManageShoesScreen } from '../features/admin/screens/ManageShoesScreen';
import { AddEditShoeScreen } from '../features/admin/screens/AddEditShoeScreen';
import { AdminOrdersScreen } from '../features/admin/screens/AdminOrdersScreen';
import { AdminOrderDetailsScreen } from '../features/admin/screens/AdminOrderDetailsScreen';
import { AdminCustomersScreen } from '../features/admin/screens/AdminCustomersScreen';
import { AdminProfileScreen } from '../features/admin/screens/AdminProfileScreen';

// User Screens
import { UserHomeScreen } from '../features/user/screens/UserHomeScreen';
import { UserCategoriesScreen } from '../features/user/screens/UserCategoriesScreen';
import { ProductDetailsScreen } from '../features/user/screens/ProductDetailsScreen';
import { UserCartScreen } from '../features/user/screens/UserCartScreen';
import { UserOrdersScreen } from '../features/user/screens/UserOrdersScreen';
import { UserProfileScreen } from '../features/user/screens/UserProfileScreen';

// Auth Screen
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { OnboardingScreen } from '../features/auth/screens/OnboardingScreen';

export const AppNavigator: React.FC = () => {
  const { role, activeTab, setActiveTab, selectedShoe, selectedOrder, isLoaded } = useApp();

  if (!isLoaded || activeTab === 'loading') {
    return (
      <WebSafeArea style={styles.launchScreen}>
        <View style={styles.loadingBadge}>
          <Icon name="footprints" color="#FFFFFF" size={28} />
        </View>
        <Text style={styles.loadingTitle}>ShoeCart</Text>
        <Text style={styles.loadingText}>Preparing your storefront experience...</Text>
        <ActivityIndicator size="small" color="#FF3B5C" style={styles.loadingSpinner} />
      </WebSafeArea>
    );
  }

  if (activeTab === 'onboarding') {
    return (
      <WebSafeArea style={styles.safeArea}>
        <OnboardingScreen />
      </WebSafeArea>
    );
  }

  // If user is on Login Screen, render full screen Login without header / bottom nav bar
  if (activeTab === 'login') {
    return (
      <WebSafeArea style={styles.safeArea}>
        <LoginScreen />
      </WebSafeArea>
    );
  }

  // Screen Title Resolution
  const getScreenTitle = () => {
    if (role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return 'Dashboard';
        case 'shoes':
          return 'Manage Shoes';
        case 'add_shoe':
          return 'Add / Edit Shoe';
        case 'orders':
          return 'All Orders';
        case 'order_details':
          return selectedOrder ? `Order #${selectedOrder.id}` : 'Order Details';
        case 'customers':
          return 'Customers';
        case 'profile':
          return 'Profile';
        default:
          return 'Admin Panel';
      }
    } else {
      switch (activeTab) {
        case 'home':
          return 'Shoe Cart';
        case 'categories':
          return 'Categories';
        case 'product_detail':
          return selectedShoe ? selectedShoe.name : 'Product Details';
        case 'cart':
          return 'My Cart';
        case 'my_orders':
          return 'My Orders';
        case 'order_details':
          return selectedOrder ? `Order #${selectedOrder.id}` : 'Order Details';
        case 'profile':
          return 'Profile';
        default:
          return 'Shoe Cart';
      }
    }
  };

  const showBackButton = activeTab === 'order_details' || activeTab === 'product_detail';
  const handleBack = () => {
    if (role === 'admin') {
      setActiveTab('orders');
    } else {
      setActiveTab(activeTab === 'product_detail' ? 'home' : 'my_orders');
    }
  };

  // Render Screen Body
  const renderScreenContent = () => {
    if (role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboardScreen />;
        case 'shoes':
          return <ManageShoesScreen />;
        case 'add_shoe':
          return <AddEditShoeScreen />;
        case 'orders':
          return <AdminOrdersScreen />;
        case 'order_details':
          return <AdminOrderDetailsScreen />;
        case 'customers':
          return <AdminCustomersScreen />;
        case 'profile':
          return <AdminProfileScreen />;
        default:
          return <AdminDashboardScreen />;
      }
    } else {
      switch (activeTab) {
        case 'home':
          return <UserHomeScreen />;
        case 'categories':
          return <UserCategoriesScreen />;
        case 'product_detail':
          return <ProductDetailsScreen />;
        case 'cart':
          return <UserCartScreen />;
        case 'my_orders':
          return <UserOrdersScreen />;
        case 'order_details':
          return <AdminOrderDetailsScreen />;
        case 'profile':
          return <UserProfileScreen />;
        default:
          return <UserHomeScreen />;
      }
    }
  };

  // Production Bottom Nav Bar Tabs Config with Lucide Icons
  const adminTabs: Array<{ id: string; label: string; iconName: IconName }> = [
    { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
    { id: 'shoes', label: 'Shoes', iconName: 'footprints' },
    { id: 'add_shoe', label: '+ Shoe', iconName: 'plus-circle' },
    { id: 'orders', label: 'Orders', iconName: 'package' },
    { id: 'profile', label: 'Profile', iconName: 'user' },
  ];

  const userTabs: Array<{ id: string; label: string; iconName: IconName }> = [
    { id: 'home', label: 'Home', iconName: 'home' },
    { id: 'categories', label: 'Categories', iconName: 'grid' },
    { id: 'cart', label: 'Cart', iconName: 'shopping-bag' },
    { id: 'my_orders', label: 'Orders', iconName: 'package' },
    { id: 'profile', label: 'Profile', iconName: 'user' },
  ];

  const activeNavTabs = role === 'admin' ? adminTabs : userTabs;
  const activeThemeColor = role === 'admin' ? '#7C3AED' : '#FF3B5C';
  const isUser = role === 'user';

  return (
    <WebSafeArea style={styles.safeArea}>
      <Header
        title={getScreenTitle()}
        showBack={showBackButton}
        onBack={handleBack}
        hideRoleTag={activeTab === 'product_detail'}
      />

      <View style={styles.body}>{renderScreenContent()}</View>

      {/* Clean Production Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNav,
          isUser ? styles.userBottomNav : styles.adminBottomNav,
        ]}
      >
        {activeNavTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const iconColor = isActive
            ? activeThemeColor
            : isUser
              ? '#94A3B8'
              : '#94A3B8';

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                isUser && isActive && styles.userActiveTabItem,
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Icon
                name={tab.iconName}
                color={iconColor}
                size={20}
                style={styles.tabIconMargin}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: iconColor },
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </WebSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#F8FAFC',
  },
  launchScreen: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#FFF8F4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingSpinner: {
    marginTop: 18,
  },
  body: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  adminBottomNav: {
    backgroundColor: '#FFFFFF',
  },
  userBottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#FFE4E8',
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 8,
  },
  userActiveTabItem: {
    backgroundColor: '#FFF1F2',
  },
  tabIconMargin: {
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeTabLabel: {
    fontWeight: '800',
  },
});
