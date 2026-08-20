import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useApp } from '../../../context/AppContext';

export const UserCategoriesScreen: React.FC = () => {
  const { categories, setActiveTab } = useApp();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Categories</Text>

      {/* Grid of Categories */}
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.8}
          >
            <Image source={{ uri: cat.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.content}>
              <Text style={styles.catName}>{cat.name}</Text>
              <Text style={styles.itemCount}>({cat.itemCount})</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* SALE Promo Banner */}
      <View style={styles.saleBanner}>
        <View style={styles.saleContent}>
          <Text style={styles.saleTag}>SALE</Text>
          <Text style={styles.saleTitle}>Up to 40% Off</Text>
          <Text style={styles.saleSub}>On Selected Items</Text>
          <TouchableOpacity style={styles.saleBtn} onPress={() => setActiveTab('home')}>
            <Text style={styles.saleBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.saleImage}
        />
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
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    width: '47.5%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  content: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  catName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
    marginTop: 2,
  },
  saleBanner: {
    backgroundColor: '#FF3B5C',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  saleContent: {
    flex: 1,
    zIndex: 2,
  },
  saleTag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FEE2E2',
    letterSpacing: 1,
  },
  saleTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 2,
  },
  saleSub: {
    fontSize: 12,
    color: '#FFE4E6',
    marginBottom: 10,
  },
  saleBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  saleBtnText: {
    color: '#FF3B5C',
    fontSize: 12,
    fontWeight: '800',
  },
  saleImage: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 150,
    height: 120,
    resizeMode: 'contain',
  },
});
