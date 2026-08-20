import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Icon } from '../../../components/common/Icon';

export const UserProfileScreen: React.FC = () => {
  const { resetDataToDefaults, wishlist, orders, currentUser, logout, setActiveTab } = useApp();

  const handleResetData = async () => {
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Reset all shoes, cart, and order data to default state?')) {
        await resetDataToDefaults();
        Alert.alert('Reset Complete', 'App data restored to initial demo state!');
      }
    } else {
      Alert.alert('Reset Data', 'Reset all shoes, cart, and order data to default state?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: async () => await resetDataToDefaults() },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerAccent} />
        <Image
          source={{
            uri: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.profileLabel}>Profile</Text>
          <Text style={styles.userName}>{currentUser?.name || 'ShoeCart member'}</Text>
          <Text style={styles.userEmail}>{currentUser?.email || 'user@shoecart.com'}</Text>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab('login')}>
          <View style={styles.menuLeft}>
            <Icon name="key" color="#475569" size={18} />
            <Text style={styles.menuText}>Login Page & Role Switcher</Text>
          </View>
          <Icon name="chevron-right" color="#94A3B8" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Icon name="user" color="#475569" size={18} />
            <Text style={styles.menuText}>Personal Information</Text>
          </View>
          <Icon name="chevron-right" color="#94A3B8" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Icon name="map-pin" color="#475569" size={18} />
            <Text style={styles.menuText}>Shipping Addresses</Text>
          </View>
          <Icon name="chevron-right" color="#94A3B8" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Icon name="heart" color="#475569" size={18} />
            <Text style={styles.menuText}>Wishlist ({wishlist.length} saved)</Text>
          </View>
          <Icon name="chevron-right" color="#94A3B8" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab('my_orders')}>
          <View style={styles.menuLeft}>
            <Icon name="package" color="#475569" size={18} />
            <Text style={styles.menuText}>Order History ({orders.length} orders)</Text>
          </View>
          <Icon name="chevron-right" color="#94A3B8" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={logout}>
          <View style={styles.menuLeft}>
            <Icon name="logout" color="#DC2626" size={18} />
            <Text style={[styles.menuText, styles.dangerText]}>Sign Out</Text>
          </View>
          <Icon name="chevron-right" color="#94A3B8" size={18} />
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryActionBtn} onPress={logout} activeOpacity={0.85}>
          <Icon name="logout" color="#FFFFFF" size={16} style={styles.actionIcon} />
          <Text style={styles.primaryActionText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryActionBtn} onPress={handleResetData} activeOpacity={0.85}>
          <Icon name="rotate-ccw" color="#991B1B" size={16} style={styles.actionIcon} />
          <Text style={styles.secondaryActionText}>Reset Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  headerBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerAccent: {
    width: 4,
    height: 54,
    borderRadius: 999,
    backgroundColor: '#FF3B5C',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFE4E8',
  },
  headerInfo: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF3B5C',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  dangerText: {
    color: '#DC2626',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B5C',
    paddingVertical: 13,
    borderRadius: 14,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryActionText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
  },
  actionIcon: {
    marginRight: 6,
  },
});
