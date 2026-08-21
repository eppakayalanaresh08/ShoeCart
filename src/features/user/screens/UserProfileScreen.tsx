import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modal } from '../../../components/common/Modal';
import { Icon } from '../../../components/common/Icon';
import { useApp } from '../../../context/AppContext';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

const AVATAR_CHOICES = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
];

export const UserProfileScreen: React.FC = () => {
  const {
    resetDataToDefaults,
    wishlist,
    orders,
    currentUser,
    logout,
    setActiveTab,
    updateCurrentUser,
  } = useApp();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [draftName, setDraftName] = useState(currentUser?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentUser?.avatarUrl || DEFAULT_AVATAR
  );

  const profileName = currentUser?.name || 'ShoeCart Member';
  const profileEmail = currentUser?.email || 'user@shoecart.com';
  const profileAvatar = currentUser?.avatarUrl || DEFAULT_AVATAR;

  const stats = useMemo(
    () => [
      { label: 'Orders', value: orders.length, icon: 'package' as const },
      { label: 'Wishlist', value: wishlist.length, icon: 'heart' as const },
      {
        label: 'Reviews',
        value: 0,
        icon: 'trophy' as const,
      },
    ],
    [orders.length, wishlist.length]
  );

  const openEditModal = () => {
    setDraftName(profileName);
    setSelectedAvatar(profileAvatar);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleSaveProfile = async () => {
    if (!draftName.trim()) {
      Alert.alert('Name required', 'Please enter your name before saving.');
      return;
    }

    await updateCurrentUser({
      name: draftName.trim(),
      avatarUrl: selectedAvatar,
    });

    setIsEditModalVisible(false);
    Alert.alert('Profile updated', 'Your profile changes have been saved.');
  };

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
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       

        <View style={styles.heroCard}>
          <View style={styles.heroGlowLarge} />
          <View style={styles.heroGlowSmall} />

          <View style={styles.avatarWrap}>
            <Image source={{ uri: profileAvatar }} style={styles.heroAvatar} />
          </View>

          <View style={styles.identityCard}>
            <View style={styles.identityText}>
              <Text style={styles.userName}>{profileName}</Text>
              <Text style={styles.userEmail}>{profileEmail}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <View style={styles.statIconBadge}>
                <Icon name={item.icon} color="#FF3B5C" size={18} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrap}>
                <Icon name="map-pin" color="#FF3B5C" size={18} />
              </View>
              <View>
                <Text style={styles.menuText}>Shipping Addresses</Text>
              </View>
            </View>
            <Icon name="chevron-right" color="#94A3B8" size={18} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrap}>
                <Icon name="heart" color="#FF3B5C" size={18} />
              </View>
              <View>
                <Text style={styles.menuText}>Wishlist</Text>
              </View>
            </View>
            <Text style={styles.menuValue}>{wishlist.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab('my_orders')} activeOpacity={0.8}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrap}>
                <Icon name="package" color="#FF3B5C" size={18} />
              </View>
              <View>
                <Text style={styles.menuText}>Order History</Text>
              </View>
            </View>
            <Text style={styles.menuValue}>{orders.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={logout} activeOpacity={0.8}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrap}>
                <Icon name="logout" color="#FF3B5C" size={18} />
              </View>
              <View>
                <Text style={styles.menuText}>Log Out</Text>
              </View>
            </View>
            <Icon name="chevron-right" color="#94A3B8" size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryActionBtn} onPress={handleResetData} activeOpacity={0.85}>
            <Icon name="rotate-ccw" color="#991B1B" size={16} style={styles.actionIcon} />
            <Text style={styles.secondaryActionText}>Reset Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isEditModalVisible} title="Edit Profile" onClose={closeEditModal}>
        <View style={styles.modalBody}>
          <Text style={styles.modalSectionTitle}>Profile Photo</Text>
          <View style={styles.avatarPreviewWrap}>
            <Image source={{ uri: selectedAvatar }} style={styles.modalAvatarPreview} />
            <Text style={styles.avatarHint}>Choose a photo style you like below</Text>
          </View>

          <View style={styles.avatarChoiceGrid}>
            {AVATAR_CHOICES.map((avatarUrl) => {
              const isSelected = selectedAvatar === avatarUrl;

              return (
                <TouchableOpacity
                  key={avatarUrl}
                  style={[styles.avatarChoice, isSelected && styles.avatarChoiceActive]}
                  onPress={() => setSelectedAvatar(avatarUrl)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: avatarUrl }} style={styles.avatarChoiceImage} />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.modalSectionTitle}>Name</Text>
          <TextInput
            style={styles.nameInput}
            value={draftName}
            onChangeText={setDraftName}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.modalActionRow}>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={closeEditModal} activeOpacity={0.85}>
              <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalPrimaryButton} onPress={handleSaveProfile} activeOpacity={0.85}>
              <Text style={styles.modalPrimaryButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8F6',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 40,
    position: 'relative',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  screenHeaderIcon: {
    position: 'absolute',
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1D4DB',
  },
  heroCard: {
    backgroundColor: '#FFEEF2',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFD7E0',
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 59, 92, 0.12)',
    top: -55,
    right: -30,
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    bottom: -35,
    left: -22,
  },
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  identityCard: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  identityText: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F3E8EC',
    alignItems: 'center',
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3E8EC',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF1F2',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  menuValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94A3B8',
  },
  actionRow: {
    marginBottom: 32,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1D4DB',
  },
  secondaryActionText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '800',
  },
  actionIcon: {
    marginRight: 6,
  },
  modalBody: {
    paddingBottom: 8,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  avatarPreviewWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  modalAvatarPreview: {
    width: 96,
    height: 96,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFE4E8',
  },
  avatarHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 10,
  },
  avatarChoiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 22,
    justifyContent: 'center',
  },
  avatarChoice: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 22,
    padding: 4,
    backgroundColor: '#FFFFFF',
  },
  avatarChoiceActive: {
    borderColor: '#FF3B5C',
    backgroundColor: '#FFF1F2',
  },
  avatarChoiceImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    marginBottom: 22,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalSecondaryButtonText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '800',
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: '#FF3B5C',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
