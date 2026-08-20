import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Input } from '../../../components/common/Input';
import { Icon, IconName } from '../../../components/common/Icon';
import { ShoeCard } from '../../../components/shoe/ShoeCard';

const CATEGORY_ICON_MAP: Record<string, IconName> = {
  Zap: 'zap',
  Smile: 'smile',
  Activity: 'activity',
  Dumbbell: 'dumbbell',
  Coffee: 'coffee',
  Trophy: 'trophy',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const PROMO_CARD_WIDTH = SCREEN_WIDTH - 30;
const PROMO_CARD_GAP = 12;
const PROMO_SNAP_INTERVAL = PROMO_CARD_WIDTH + PROMO_CARD_GAP;

export const UserHomeScreen: React.FC = () => {
  const { shoes, setSelectedShoe, setActiveTab, categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const promoListRef = useRef<FlatList>(null);

  const brands = ['All', 'Nike', 'Adidas', 'Puma', 'Converse', 'New Balance'];
  const popularShoes = shoes.filter((shoe) => shoe.isPopular);
  const remainingShoes = shoes.filter((shoe) => !shoe.isPopular);
  const orderedPromoPool = [...popularShoes, ...remainingShoes];
  const featuredShoes = orderedPromoPool.slice(0, 4);

  while (featuredShoes.length < 4 && orderedPromoPool.length > 0) {
    featuredShoes.push(orderedPromoPool[featuredShoes.length % orderedPromoPool.length]);
  }

  useEffect(() => {
    if (featuredShoes.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActivePromoIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % featuredShoes.length;
        promoListRef.current?.scrollToOffset({
          offset: nextIndex * PROMO_SNAP_INTERVAL,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredShoes.length]);

  useEffect(() => {
    if (activePromoIndex >= featuredShoes.length && featuredShoes.length > 0) {
      setActivePromoIndex(0);
      promoListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [activePromoIndex, featuredShoes.length]);

  const filteredShoes = shoes.filter((shoe) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch =
      shoe.name.toLowerCase().includes(normalizedQuery) ||
      shoe.brand.toLowerCase().includes(normalizedQuery);
    const matchesBrand =
      selectedBrand === 'All' || shoe.brand.toLowerCase() === selectedBrand.toLowerCase();

    return matchesSearch && matchesBrand;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.greetingHeader}>
        <View>
          <Text style={styles.greetingTitle}>Hello, Sneakerhead</Text>
          <Text style={styles.greetingSub}>Fresh drops and clean fits picked for you.</Text>
        </View>
        <View style={styles.greetingBadge}>
          <Icon name="footprints" size={18} color="#FF3B5C" />
        </View>
      </View>

      <Input
        placeholder="Search shoes, brands..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        icon="search"
      />

      <FlatList
        ref={promoListRef}
        horizontal
        data={featuredShoes}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promoRow}
        snapToInterval={PROMO_SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        onScrollToIndexFailed={() => {
          promoListRef.current?.scrollToOffset({
            offset: activePromoIndex * PROMO_SNAP_INTERVAL,
            animated: true,
          });
        }}
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(
            event.nativeEvent.contentOffset.x / PROMO_SNAP_INTERVAL,
          );
          setActivePromoIndex(nextIndex);
        }}
        renderItem={({ item, index }) => {
          const isPrimaryCard = index % 2 === 0;

          return (
            <View
              style={[
                styles.promoCard,
                isPrimaryCard ? styles.promoCardPrimary : styles.promoCardSecondary,
              ]}
            >
              <Text
                style={[
                  styles.promoBrandWatermark,
                  isPrimaryCard
                    ? styles.promoBrandWatermarkPrimary
                    : styles.promoBrandWatermarkSecondary,
                ]}
              >
                {item.brand}
              </Text>
              <View
                style={[
                  styles.promoAccentOrb,
                  isPrimaryCard ? styles.promoAccentOrbPrimary : styles.promoAccentOrbSecondary,
                ]}
              />
              <View style={styles.promoCopy}>
                <View style={styles.promoTopRow}>
                  <View
                    style={[
                      styles.promoBadge,
                      isPrimaryCard ? styles.promoBadgePrimary : styles.promoBadgeSecondary,
                    ]}
                  >
                    <Text
                      style={[
                        styles.promoBadgeText,
                        isPrimaryCard ? styles.promoBadgeTextPrimary : styles.promoBadgeTextSecondary,
                      ]}
                    >
                      {item.category}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.promoPrice,
                      isPrimaryCard ? styles.promoTextOnPrimary : styles.promoTextOnSecondary,
                    ]}
                  >
                    ${item.price.toFixed(0)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.promoEyebrow,
                    isPrimaryCard ? styles.promoMutedTextPrimary : styles.promoMutedTextSecondary,
                  ]}
                >
                  {item.brand} Spotlight
                </Text>
                <Text
                  style={[
                    styles.promoTitle,
                    isPrimaryCard ? styles.promoTextOnPrimary : styles.promoTextOnSecondary,
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.promoDescription,
                    isPrimaryCard ? styles.promoMutedTextPrimary : styles.promoMutedTextSecondary,
                  ]}
                >
                  {item.stockStatus === 'In Stock'
                    ? 'Low-profile banner with clean sport energy and everyday comfort.'
                    : 'Sharp seasonal drop with fast-moving stock and strong brand appeal.'}
                </Text>

                <View style={styles.promoMetaRow}>
                  <View
                    style={[
                      styles.promoMetaChip,
                      isPrimaryCard ? styles.promoMetaChipPrimary : styles.promoMetaChipSecondary,
                    ]}
                  >
                    <Text
                      style={[
                        styles.promoMetaValue,
                        isPrimaryCard ? styles.promoTextOnPrimary : styles.promoTextOnSecondary,
                      ]}
                    >
                      {item.rating?.toFixed(1) || '4.8'}
                    </Text>
                    <Text
                      style={[
                        styles.promoMetaLabel,
                        isPrimaryCard ? styles.promoMutedTextPrimary : styles.promoMutedTextSecondary,
                      ]}
                    >
                      Rating
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.promoButton,
                      isPrimaryCard ? styles.promoButtonPrimary : styles.promoButtonSecondary,
                    ]}
                    onPress={() => {
                      setSelectedShoe(item);
                      setActiveTab('product_detail');
                    }}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.promoButtonText,
                        isPrimaryCard ? styles.promoButtonTextPrimary : styles.promoButtonTextSecondary,
                      ]}
                    >
                      Shop Now
                    </Text>
                    <Icon
                      name="chevron-right"
                      size={14}
                      color={isPrimaryCard ? '#FFFFFF' : '#FF3B5C'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.promoPagination}>
        <Text style={styles.promoCount}>
          {activePromoIndex + 1}/{featuredShoes.length}
        </Text>
        {featuredShoes.map((shoe, index) => (
          <View
            key={`${shoe.id}-${index}`}
            style={[
              styles.promoDot,
              index === activePromoIndex && styles.promoDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity onPress={() => setActiveTab('categories')}>
          <View style={styles.viewAllLink}>
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="chevron-right" size={14} color="#FF3B5C" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categoriesRow}>
          {categories.slice(0, 5).map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryChip}
              onPress={() => setActiveTab('categories')}
            >
              <View style={styles.categoryIconWrap}>
                <Icon
                  name={CATEGORY_ICON_MAP[category.iconName] || 'footprints'}
                  size={16}
                  color="#FF3B5C"
                />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsScroll}>
        <View style={styles.brandsRow}>
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand}
              style={[
                styles.brandPill,
                selectedBrand === brand && styles.selectedBrandPill,
              ]}
              onPress={() => setSelectedBrand(brand)}
            >
              <Text
                style={[
                  styles.brandText,
                  selectedBrand === brand && styles.selectedBrandText,
                ]}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Picks</Text>
      </View>

      <View style={styles.shoesGrid}>
        {filteredShoes.map((shoe) => (
          <ShoeCard
            key={shoe.id}
            shoe={shoe}
            isAdmin={false}
            onPress={() => {
              setSelectedShoe(shoe);
              setActiveTab('product_detail');
            }}
          />
        ))}
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
  greetingHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  greetingSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  greetingBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  promoRow: {
    paddingBottom: 10,
    paddingRight: PROMO_CARD_GAP,
  },
  promoCard: {
    width: PROMO_CARD_WIDTH,
    minHeight: 132,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'hidden',
    marginRight: PROMO_CARD_GAP,
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
  promoCardPrimary: {
    backgroundColor: '#FFF1F4',
    borderWidth: 1,
    borderColor: '#FFD8E1',
  },
  promoCardSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFE3E9',
  },
  promoBrandWatermark: {
    position: 'absolute',
    right: 14,
    top: 10,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
  },
  promoBrandWatermarkPrimary: {
    color: 'rgba(255,79,116,0.10)',
  },
  promoBrandWatermarkSecondary: {
    color: 'rgba(17,24,39,0.06)',
  },
  promoAccentOrb: {
    position: 'absolute',
    right: -18,
    bottom: -30,
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  promoAccentOrbPrimary: {
    backgroundColor: 'rgba(255,79,116,0.14)',
  },
  promoAccentOrbSecondary: {
    backgroundColor: 'rgba(251,113,133,0.10)',
  },
  promoCopy: {
    flex: 1,
    justifyContent: 'space-between',
  },
  promoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  promoBadgePrimary: {
    backgroundColor: '#FFFFFF',
  },
  promoBadgeSecondary: {
    backgroundColor: '#FFF1F4',
  },
  promoBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  promoBadgeTextPrimary: {
    color: '#FF3B5C',
  },
  promoBadgeTextSecondary: {
    color: '#E11D48',
  },
  promoPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  promoEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
    lineHeight: 22,
  },
  promoDescription: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    maxWidth: 220,
  },
  promoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  promoMetaChip: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 66,
  },
  promoMetaChipPrimary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFD8E1',
  },
  promoMetaChipSecondary: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1,
    borderColor: '#FFE3E9',
  },
  promoMetaValue: {
    fontSize: 12,
    fontWeight: '900',
  },
  promoMetaLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  promoButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promoButtonPrimary: {
    backgroundColor: '#FF4F74',
  },
  promoButtonSecondary: {
    backgroundColor: '#FF6B8B',
  },
  promoButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  promoButtonTextPrimary: {
    color: '#FFFFFF',
  },
  promoButtonTextSecondary: {
    color: '#FFFFFF',
  },
  promoPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  promoCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 4,
  },
  promoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D8DEE8',
  },
  promoDotActive: {
    width: 22,
    backgroundColor: '#FF4F74',
  },
  promoTextOnPrimary: {
    color: '#111827',
  },
  promoTextOnSecondary: {
    color: '#111827',
  },
  promoMutedTextPrimary: {
    color: '#6B7280',
  },
  promoMutedTextSecondary: {
    color: '#6B7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF3B5C',
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  brandsScroll: {
    marginBottom: 20,
  },
  brandsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  brandPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  selectedBrandPill: {
    backgroundColor: '#FF3B5C',
  },
  brandText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  selectedBrandText: {
    color: '#FFFFFF',
  },
  shoesGrid: {
    gap: 12,
    paddingBottom: 32,
  },
});
