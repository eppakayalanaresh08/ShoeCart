import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../theme/colors';
import { Icon } from './Icon';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  hideRoleTag?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  rightAction,
  hideRoleTag = false,
}) => {
  const { role, cartItemCount, setActiveTab, logout } = useApp();
  const theme = themeColors[role];
  const isUser = role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser
          ? [styles.userContainer, { borderBottomColor: theme.border }]
          : { backgroundColor: theme.primary },
      ]}
    >
      {/* Clean Mobile App Header */}
      <View style={styles.headerBar}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              style={[
                styles.backButton,
                isUser ? styles.userActionButton : styles.adminBackButton,
              ]}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={18} color={isUser ? theme.textDark : '#FFFFFF'} />
            </TouchableOpacity>
          )}
          <Text style={[styles.titleText, isUser && { color: theme.textDark }]}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {rightAction}

          {/* Logged in Role Indicator Pill */}
          {!hideRoleTag && (
            <View
              style={[
                styles.roleTagPill,
                isUser && { backgroundColor: theme.primaryBg },
              ]}
            >
              {role === 'admin' ? (
                <Icon
                  name="shield-check"
                  size={14}
                  color={isUser ? theme.primary : '#FFFFFF'}
                  style={styles.pillIcon}
                />
              ) : (
                <Icon
                  name="user"
                  size={14}
                  color={isUser ? theme.primary : '#FFFFFF'}
                  style={styles.pillIcon}
                />
              )}
              <Text style={[styles.roleTagText, isUser && { color: theme.primary }]}>
                {role === 'admin' ? 'Admin' : 'Customer'}
              </Text>
            </View>
          )}

          {/* Cart Icon for User */}
          {role === 'user' && (
            <TouchableOpacity
              style={[
                styles.cartButton,
                isUser ? styles.userActionButton : styles.adminCartButton,
              ]}
              onPress={() => setActiveTab('cart')}
              activeOpacity={0.7}
            >
              <Icon name="shopping-bag" size={20} color={isUser ? theme.textDark : '#FFFFFF'} />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Quick Logout Button */}
          <TouchableOpacity
            style={[
              styles.logoutBtn,
              isUser ? styles.userActionButton : styles.adminLogoutButton,
            ]}
            onPress={logout}
            activeOpacity={0.7}
          >
            <Icon name="logout" size={16} color={isUser ? theme.textDark : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  userContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillIcon: {
    marginRight: 4,
  },
  roleTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  cartButton: {
    position: 'relative',
    padding: 7,
    borderRadius: 10,
  },
  adminCartButton: {
    backgroundColor: 'transparent',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#FF3B5C',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  logoutBtn: {
    padding: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminLogoutButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  userActionButton: {
    backgroundColor: '#F8FAFC',
  },
});
