import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Icon } from '../../../components/common/Icon';
import { themeColors } from '../../../theme/colors';

export const AdminProfileScreen: React.FC = () => {
  const {
    currentUser,
    orders,
    shoes,
    customers,
    setActiveTab,
    setRole,
    logout,
    resetDataToDefaults,
  } = useApp();

  const theme = themeColors.admin;

  const handleResetData = () => {
    Alert.alert(
      'Reset demo data',
      'Reset shoes, orders, customers, cart, and wishlist back to the initial demo state?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetDataToDefaults();
          },
        },
      ]
    );
  };

  const stats = [
    { label: 'Products', value: shoes.length, icon: 'footprints' as const },
    { label: 'Orders', value: orders.length, icon: 'package' as const },
    { label: 'Customers', value: customers.length, icon: 'users' as const },
  ];

  const quickActions = [
    { label: 'Dashboard', tab: 'dashboard', icon: 'dashboard' as const },
    { label: 'Manage Shoes', tab: 'shoes', icon: 'footprints' as const },
    { label: 'Orders', tab: 'orders', icon: 'package' as const },
    { label: 'Customers', tab: 'customers', icon: 'users' as const },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, { backgroundColor: theme.primary }]}>
        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />
        <View style={styles.heroTopRow}>
          <View style={styles.identityRow}>
            <Image
              source={{
                uri:
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.rolePill}>ADMIN ACCOUNT</Text>
              <Text style={styles.name}>{currentUser?.name || 'Store Administrator'}</Text>
              <Text style={styles.email}>{currentUser?.email || 'admin@shoecart.com'}</Text>
            </View>
          </View>

          <View style={styles.roleBadge}>
            <Icon name="shield-check" color="#FFFFFF" size={18} />
          </View>
        </View>

        <View style={styles.heroMetaRow}>
          <View style={styles.metaChip}>
            <Icon name="dashboard" color="#FFFFFF" size={14} />
            <Text style={styles.metaChipText}>Admin Control Center</Text>
          </View>
          <View style={styles.metaChipSoft}>
            <Text style={styles.metaChipSoftText}>Signed in</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Icon name={item.icon} color={theme.primary} size={18} />
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>

      <View style={styles.menuCard}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.tab}
            style={styles.menuItem}
            onPress={() => setActiveTab(action.tab)}
            activeOpacity={0.8}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrap}>
                <Icon name={action.icon} color={theme.primary} size={18} />
              </View>
              <Text style={styles.menuText}>{action.label}</Text>
            </View>
            <Icon name="chevron-right" color={theme.textMuted} size={18} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Account</Text>
      </View>

      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setRole('user')} activeOpacity={0.8}>
          <View style={styles.menuLeft}>
            <View style={styles.menuIconWrap}>
              <Icon name="user" color={theme.primary} size={18} />
            </View>
            <Text style={styles.menuText}>Switch to Customer Mode</Text>
          </View>
          <Icon name="chevron-right" color={theme.textMuted} size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleResetData} activeOpacity={0.8}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIconWrap, styles.dangerIconWrap]}>
              <Icon name="rotate-ccw" color="#DC2626" size={18} />
            </View>
            <Text style={[styles.menuText, styles.dangerText]}>Reset Demo Data</Text>
          </View>
          <Icon name="chevron-right" color={theme.textMuted} size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={logout} activeOpacity={0.8}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIconWrap, styles.logoutIconWrap]}>
              <Icon name="logout" color="#DC2626" size={18} />
            </View>
            <Text style={[styles.menuText, styles.dangerText]}>Sign Out</Text>
          </View>
          <Icon name="chevron-right" color={theme.textMuted} size={18} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  hero: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlowOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: -60,
    right: -40,
  },
  heroGlowTwo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -20,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  rolePill: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  email: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  metaChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  metaChipSoft: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  metaChipSoftText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3FF',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    flex: 1,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3FF',
  },
  dangerIconWrap: {
    backgroundColor: '#FEF2F2',
  },
  logoutIconWrap: {
    backgroundColor: '#FEF2F2',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  dangerText: {
    color: '#B91C1C',
  },
});
