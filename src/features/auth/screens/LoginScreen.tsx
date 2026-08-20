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
      <View style={styles.brandHero}>
        <View style={styles.heroAccentCircleLarge} />
        <View style={styles.heroAccentCircleSmall} />

        <View style={styles.brandTopRow}>
          <TouchableOpacity
            style={styles.backToWelcomeButton}
            onPress={handleBackToWelcome}
            activeOpacity={0.8}
          >
            <Icon name="arrow-left" size={16} color="#BE123C" />
            <Text style={styles.backToWelcomeText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.logoBadge}>
            <Icon name="footprints" color="#FFFFFF" size={30} />
          </View>
        </View>

        <View style={styles.brandCenter}>
          <View style={styles.brandChip}>
            <Text style={styles.brandChipText}>SHOECART</Text>
          </View>
          <Text style={styles.brandTitle}>Login</Text>
          <Text style={styles.brandSubtitle}>Sign in to continue</Text>
        </View>
      </View>

      {!!successMessage && (
        <View style={styles.successBox}>
          <Icon name="check-circle" color="#15803D" size={18} style={styles.inlineIcon} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Welcome back</Text>
        <Text style={styles.authSubtitle}>
          Customer styling stays bright and clean here. Choose your role and continue.
        </Text>

        <View style={styles.roleTabsRow}>
          <TouchableOpacity
            style={[styles.roleTabBtn, selectedRole === 'user' && styles.roleTabBtnActiveUser]}
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
              placeholder="••••••••"
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
          <Text style={styles.guestLinkText}>Continue to Storefront as Guest</Text>
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
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  brandHero: {
    backgroundColor: '#FFF1F2',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#FFE4E8',
    overflow: 'hidden',
    marginBottom: 22,
  },
  heroAccentCircleLarge: {
    position: 'absolute',
    top: -35,
    right: -25,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FDBAC8',
    opacity: 0.55,
  },
  heroAccentCircleSmall: {
    position: 'absolute',
    bottom: -24,
    left: -16,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FECACA',
    opacity: 0.65,
  },
  brandTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backToWelcomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  backToWelcomeText: {
    marginLeft: 6,
    color: '#BE123C',
    fontSize: 12,
    fontWeight: '800',
  },
  logoBadge: {
    width: 62,
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B5C',
    transform: [{ rotate: '-8deg' }],
  },
  brandChip: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  brandCenter: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  brandChipText: {
    color: '#E11D48',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTitle: {
    marginTop: 14,
    fontSize: 30,
    lineHeight: 34,
    color: '#111827',
    fontWeight: '900',
  },
  brandSubtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 18,
    color: '#6B7280',
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
    padding: 20,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  authTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  authSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
    marginBottom: 18,
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
    color: '#BE123C',
    fontSize: 12,
    fontWeight: '800',
  },
});
