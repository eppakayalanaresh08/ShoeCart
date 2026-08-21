import React, { useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ONBOARDING_SCREENS: Array<{
  image: ImageSourcePropType;
  title: string;
}> = [
  {
    image: require('../../../assets/onboarding1.png'),
    title: 'Step Into Style',
  },
  {
    image: require('../../../assets/onboarding2.png'),
    title: 'Find Your Perfect Pair',
  },
  {
    image: require('../../../assets/onboarding3.png'),
    title: 'Your Style Your Way',
  },
];

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, setRole, setActiveTab } = useApp();
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(nextIndex);
  };

  const handleNext = async () => {
    if (activeIndex < ONBOARDING_SCREENS.length - 1) {
      const nextPage = activeIndex + 1;
      scrollRef.current?.scrollTo({
        x: nextPage * SCREEN_WIDTH,
        animated: true,
      });
      setActiveIndex(nextPage);
      return;
    }

    await completeOnboarding();
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const handleContinueAsGuest = async () => {
    await completeOnboarding();
    setRole('user');
    setActiveTab('home');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {ONBOARDING_SCREENS.map((screen, index) => (
          <View key={screen.title} style={styles.page}>
            <ImageBackground source={screen.image} resizeMode="cover" style={styles.pageBackground}>
              <View style={styles.topSection}>
                <View style={styles.topRow}>
                  <View style={styles.titleBlock}>
                    <View style={styles.progressBadge}>
                      <Text style={styles.pageCount}>
                        {String(index + 1).padStart(2, '0')} / {String(ONBOARDING_SCREENS.length).padStart(2, '0')}
                      </Text>
                    </View>
                    <Text style={styles.pageTitle}>{screen.title}</Text>
                  </View>

                  <TouchableOpacity onPress={handleSkip} activeOpacity={0.8} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dotsRow}>
                  {ONBOARDING_SCREENS.map((item, dotIndex) => (
                    <View
                      key={item.title}
                      style={[styles.dot, dotIndex === activeIndex && styles.dotActive]}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.bottomOverlay}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleNext}
                  activeOpacity={0.88}
                >
                  <Text style={styles.primaryButtonText}>
                    {activeIndex === ONBOARDING_SCREENS.length - 1 ? 'Get Started' : 'Next'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryLink}
                  onPress={handleContinueAsGuest}
                  activeOpacity={0.82}
                >
                  <Text style={styles.secondaryLinkText}>Continue as Guest</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F6',
  },
  page: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  pageBackground: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: 25,
    paddingHorizontal: 32,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBlock: {
    flex: 1,
    paddingRight: 16,
  },
  progressBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
  },
  skipButton: {
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#475569',
  },
  bottomOverlay: {
    paddingHorizontal: 32,
    paddingBottom: 44,
  },
  pageCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 1,
  },
  pageTitle: {
    marginTop: 8,
    fontSize: 25,
    lineHeight: 36,
    fontWeight: '900',
    color: '#111827',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F9A8B8',
    opacity: 0.45,
  },
  dotActive: {
    width: 22,
    backgroundColor: '#FF3B5C',
    opacity: 1,
  },
  primaryButton: {
    backgroundColor: '#FF3B5C',
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryLink: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryLinkText: {
    color: '#BE123C',
    fontSize: 15,
    fontWeight: '800',
  },
});
