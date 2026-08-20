import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Icon, IconName } from '../../../components/common/Icon';

const HIGHLIGHTS: Array<{
  icon: IconName;
  title: string;
  description: string;
  accent: string;
  bg: string;
}> = [
  {
    icon: 'footprints',
    title: 'Curated sneaker drops',
    description: 'Browse standout pairs, trend-forward collections, and new arrivals in one clean storefront.',
    accent: '#FF3B5C',
    bg: '#FFF1F2',
  },
  {
    icon: 'shopping-bag',
    title: 'Faster checkout flow',
    description: 'Save time with a simpler cart, clear order tracking, and a smoother path from browse to buy.',
    accent: '#0F766E',
    bg: '#ECFEFF',
  },
  {
    icon: 'dashboard',
    title: 'Smart admin overview',
    description: 'Store owners get cleaner analytics, better sales visibility, and easier order management.',
    accent: '#7C3AED',
    bg: '#F5F3FF',
  },
];

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, setRole, setActiveTab } = useApp();

  const handleGetStarted = async () => {
    await completeOnboarding();
  };

  const handleContinueAsGuest = async () => {
    await completeOnboarding();
    setRole('user');
    setActiveTab('home');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroGlowLarge} />
        <View style={styles.heroGlowSmall} />

        <View style={styles.heroTopRow}>
          <View style={styles.betaPill}>
            <Text style={styles.betaPillText}>NEW EXPERIENCE</Text>
          </View>
          <View style={styles.logoBadge}>
            <Icon name="footprints" size={34} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.heroTitle}>Step Into the New ShoeCart</Text>
        <Text style={styles.heroSubtitle}>
          Discover premium sneakers, cleaner browsing, and a storefront that feels faster and easier from the first tap.
        </Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>200+</Text>
            <Text style={styles.heroStatLabel}>styles to explore</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>24/7</Text>
            <Text style={styles.heroStatLabel}>order tracking</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>WHY YOU'LL LIKE IT</Text>
        <Text style={styles.sectionTitle}>Built to feel sharper on day one</Text>
      </View>

      <View style={styles.featureList}>
        {HIGHLIGHTS.map((item) => (
          <View key={item.title} style={styles.featureCard}>
            <View style={[styles.featureIconWrap, { backgroundColor: item.bg }]}>
              <Icon name={item.icon} size={22} color={item.accent} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Choose how you want to enter</Text>
        <Text style={styles.ctaText}>
          Start with your account for the full experience, or jump into the storefront as a guest.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGetStarted}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryButtonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleContinueAsGuest}
          activeOpacity={0.82}
        >
          <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F4',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 30,
    padding: 24,
    overflow: 'hidden',
  },
  heroGlowLarge: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FF5F7E',
    opacity: 0.22,
  },
  heroGlowSmall: {
    position: 'absolute',
    bottom: -20,
    left: -10,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F59E0B',
    opacity: 0.18,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  betaPill: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  betaPillText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  logoBadge: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#FF3B5C',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    color: '#FFFFFF',
    fontWeight: '900',
    maxWidth: 270,
  },
  heroSubtitle: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 22,
    color: '#D1D5DB',
    maxWidth: 320,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 14,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  heroStatLabel: {
    marginTop: 4,
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 14,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 24,
    lineHeight: 30,
    color: '#111827',
    fontWeight: '900',
  },
  featureList: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: '#F3E8E2',
  },
  featureIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  featureDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
  },
  ctaCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3E8E2',
  },
  ctaTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#111827',
  },
  ctaText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: '#FF3B5C',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
  },
  secondaryButtonText: {
    color: '#BE123C',
    fontSize: 14,
    fontWeight: '800',
  },
});
