import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Role } from '../../../types';
import { Icon } from '../../../components/common/Icon';
import { themeColors } from '../../../theme/colors';

export const LoginScreen: React.FC = () => {
  const { login, setRole, setActiveTab } = useApp();

  const [selectedRole, setSelectedRoleTab] = useState<Role>('user');
  const [email, setEmail] = useState<string>('user@shoecart.com');
  const [password, setPassword] = useState<string>('user123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const theme = selectedRole === 'admin' ? themeColors.admin : themeColors.user;

  const ADMIN_CREDENTIALS = {
    email: 'admin@shoecart.com',
    password: 'admin123',
    name: 'Store Administrator',
  };

  const USER_CREDENTIALS = {
    email: 'user@shoecart.com',
    password: 'user123',
    name: 'Sneakerhead Customer',
  };
  const isAdmin = selectedRole === 'admin';
  const heroBackground = isAdmin ? '#F6F0FF' : '#FFF1F2';
  const heroBorder = isAdmin ? '#E9D5FF' : '#FFE4E8';
  const accentLargeColor = isAdmin ? '#C4B5FD' : '#FDBAC8';
  const accentSmallColor = isAdmin ? '#DDD6FE' : '#FECACA';
  const backButtonTextColor = isAdmin ? theme.primaryDark : '#BE123C';
  const backButtonBorder = isAdmin ? '#E9D5FF' : '#FFE4E8';
  const guestLinkColor = isAdmin ? theme.primary : '#BE123C';
  const roleDescription = isAdmin
    ? 'Sign in to manage products, orders, and customers.'
    : 'Sign in to continue your shopping journey.';

  const handleRoleTabChange = (role: Role) => {
    setSelectedRoleTab(role);
    setErrorMessage('');

    if (role === 'admin') {
      setEmail(ADMIN_CREDENTIALS.email);
      setPassword(ADMIN_CREDENTIALS.password);
      return;
    }

    setEmail(USER_CREDENTIALS.email);
    setPassword(USER_CREDENTIALS.password);
  };

  const handleFormSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter an email address');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter a password');
      return;
    }

    setErrorMessage('');
    const targetRole = selectedRole;
    const displayName =
      targetRole === 'admin' ? ADMIN_CREDENTIALS.name : USER_CREDENTIALS.name;

    setSuccessMessage(
      `Signing in... Redirecting to ${
        targetRole === 'admin' ? 'Admin Dashboard' : 'Storefront'
      }...`
    );

    setTimeout(async () => {
      await login(email.trim(), targetRole, displayName);
    }, 400);
  };

  const handleExploreGuest = () => {
    setRole('user');
    setActiveTab('home');
  };

  const handleBackToWelcome = () => {
    setActiveTab('onboarding');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.brandHero,
          {
            backgroundColor: heroBackground,
            borderColor: heroBorder,
          },
        ]}
      >
        <View
          style={[
            styles.heroAccentCircleLarge,
            { backgroundColor: accentLargeColor },
          ]}
        />
        <View
          style={[
            styles.heroAccentCircleSmall,
            { backgroundColor: accentSmallColor },
          ]}
        />

        <TouchableOpacity
          style={[
            styles.backToWelcomeButton,
            { borderColor: backButtonBorder },
          ]}
          onPress={handleBackToWelcome}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={16} color={backButtonTextColor} />
          <Text style={[styles.backToWelcomeText, { color: backButtonTextColor }]}>Back</Text>
        </TouchableOpacity>

        <View style={styles.brandCenter}>
          <View
            style={[
              styles.logoBadge,
              {
                backgroundColor: theme.primary,
                shadowColor: theme.primary,
              },
            ]}
          >
            <Icon name="footprints" color="#FFFFFF" size={30} />
          </View>
          <View style={[styles.rolePill, { backgroundColor: theme.primaryBg }]}>
            <Text style={[styles.rolePillText, { color: theme.primary }]}>
              {isAdmin ? 'Admin Access' : 'Customer Access'}
            </Text>
          </View>
          <Text style={styles.brandTitle}>ShoeCart</Text>
          <Text style={styles.brandSubtitle}>{roleDescription}</Text>
        </View>
      </View>

      {!!successMessage && (
        <View style={styles.successBox}>
          <Icon name="check-circle" color="#15803D" size={18} style={styles.inlineIcon} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Sign in</Text>
        <Text style={styles.authSubtitle}>Choose your role and continue.</Text>

        <View style={styles.roleTabsRow}>
          <TouchableOpacity
            style={[
              styles.roleTabBtn,
              selectedRole === 'user' && styles.roleTabBtnActiveUser,
            ]}
            onPress={() => handleRoleTabChange('user')}
            activeOpacity={0.8}
          >
            <Icon
              name="user"
              color={selectedRole === 'user' ? '#FFFFFF' : '#64748B'}
              size={18}
              style={styles.tabIconMargin}
            />
            <Text
              style={[
                styles.roleTabBtnText,
                selectedRole === 'user' && styles.textWhite,
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTabBtn, selectedRole === 'admin' && styles.roleTabBtnActiveAdmin]}
            onPress={() => handleRoleTabChange('admin')}
            activeOpacity={0.8}
          >
            <Icon
              name="shield-check"
              color={selectedRole === 'admin' ? '#FFFFFF' : '#64748B'}
              size={18}
              style={styles.tabIconMargin}
            />
            <Text
              style={[
                styles.roleTabBtnText,
                selectedRole === 'admin' && styles.textWhite,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {!!errorMessage && (
          <View style={styles.errorBox}>
            <Icon name="alert-circle" color="#B91C1C" size={18} style={styles.inlineIcon} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.inputFieldGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: theme.border,
                color: theme.textDark,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder={
              selectedRole === 'admin' ? 'admin@shoecart.com' : 'user@shoecart.com'
            }
            placeholderTextColor={theme.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputFieldGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.passwordFieldWrap, { borderColor: theme.border }]}>
            <TextInput
              style={[styles.passwordInput, { color: theme.textDark }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtnInside}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.75}
            >
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                color="#64748B"
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleFormSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>
            Sign In as {selectedRole === 'admin' ? 'Admin' : 'Customer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestLink} onPress={handleExploreGuest}>
          <Text style={[styles.guestLinkText, { color: guestLinkColor }]}>
            Continue to Storefront as Guest
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F5',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  brandHero: {
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
  },
  heroAccentCircleLarge: {
    position: 'absolute',
    top: -35,
    right: -25,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.55,
  },
  heroAccentCircleSmall: {
    position: 'absolute',
    bottom: -24,
    left: -16,
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.65,
  },
  backToWelcomeButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  backToWelcomeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '800',
  },
  logoBadge: {
    width: 74,
    height: 74,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 6,
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  brandCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  brandTitle: {
    fontSize: 32,
    lineHeight: 36,
    color: '#111827',
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  brandSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 240,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  inlineIcon: {
    marginRight: 8,
  },
  successText: {
    color: '#15803D',
    fontWeight: '800',
    fontSize: 13,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
  },
  authSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  roleTabBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconMargin: {
    marginRight: 6,
  },
  roleTabBtnActiveUser: {
    backgroundColor: '#FF3B5C',
  },
  roleTabBtnActiveAdmin: {
    backgroundColor: '#7C3AED',
  },
  roleTabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  textWhite: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
  },
  inputFieldGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  passwordFieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  eyeBtnInside: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  guestLink: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 6,
  },
  guestLinkText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
