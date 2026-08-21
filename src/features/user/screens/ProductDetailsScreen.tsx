import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { SizeSelector } from '../../../components/shoe/SizeSelector';
import { Button } from '../../../components/common/Button';
import { Icon } from '../../../components/common/Icon';
import { Modal } from '../../../components/common/Modal';

export const ProductDetailsScreen: React.FC = () => {
  const { selectedShoe, addToCart, wishlist, toggleWishlist, setActiveTab } = useApp();
  const [selectedSize, setSelectedSize] = useState<number | null>(9);
  const [isAdding, setIsAdding] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  if (!selectedShoe) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No product selected.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => setActiveTab('home')}>
          <Text style={styles.backBtnText}>Browse Shoes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isWishlisted = wishlist.includes(selectedShoe.id);

  const openFeedbackModal = (title: string, message: string) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setShowFeedbackModal(true);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      openFeedbackModal('Select Size', 'Please select a shoe size before adding to cart.');
      return;
    }
    setIsAdding(true);
    await addToCart(selectedShoe, selectedSize, 1);
    setIsAdding(false);
    openFeedbackModal('Added to Cart', `${selectedShoe.name} (Size ${selectedSize}) added to cart.`);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      openFeedbackModal('Select Size', 'Please select a shoe size.');
      return;
    }
    await addToCart(selectedShoe, selectedSize, 1);
    setActiveTab('cart');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topActionRow}>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleWishlist(selectedShoe.id)}
          activeOpacity={0.8}
        >
          <Icon
            name="heart"
            size={18}
            color={isWishlisted ? '#FF3B5C' : '#94A3B8'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imageCard}>
        <Image
          source={{ uri: selectedShoe.imageUrl }}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.brand}>{selectedShoe.brand}</Text>
        <Text style={styles.name}>{selectedShoe.name}</Text>
        <Text style={styles.price}>${selectedShoe.price.toFixed(2)}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.ratingScore}>{selectedShoe.rating || 4.8}</Text>
          <Text style={styles.reviewCount}>({selectedShoe.reviewCount || 138} reviews)</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{selectedShoe.description}</Text>

        <SizeSelector
          availableSizes={selectedShoe.availableSizes || [7, 8, 9, 10, 11, 12]}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
        />

        <View style={styles.actionButtonsRow}>
          <View style={styles.flexBtn}>
            <Button
              title="Add to Cart"
              variant="outline"
              onPress={handleAddToCart}
              isLoading={isAdding}
            />
          </View>
          <View style={styles.flexBtn}>
            <Button
              title="Buy Now"
              variant="primary"
              onPress={handleBuyNow}
              style={styles.buyNowBtn}
            />
          </View>
        </View>
      </View>

      <Modal
        visible={showFeedbackModal}
        title={feedbackTitle}
        onClose={() => setShowFeedbackModal(false)}
      >
        <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        <Button
          title="OK"
          onPress={() => setShowFeedbackModal(false)}
          style={styles.feedbackBtn}
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  emptyContainer: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FF3B5C',
    borderRadius: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 10,
  },
  heartButton: {
    // paddingTop: -1000,
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  imageCard: {
    height: 240,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
  },
  heroImage: {
    width: '90%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    marginTop: 10,
  },
  brand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF3B5C',
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  starIcon: {
    fontSize: 14,
    color: '#F59E0B',
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 13,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  flexBtn: {
    flex: 1,
  },
  buyNowBtn: {
    backgroundColor: '#FF3B5C',
  },
  feedbackText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  feedbackBtn: {
    backgroundColor: '#FF3B5C',
  },
});
