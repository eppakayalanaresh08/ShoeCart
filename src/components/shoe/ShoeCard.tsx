import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Shoe } from '../../types';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';

interface ShoeCardProps {
  shoe: Shoe;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export const ShoeCard: React.FC<ShoeCardProps> = ({
  shoe,
  onPress,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const { wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(shoe.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: shoe.imageUrl }} style={styles.image} resizeMode="cover" />

        <View style={styles.topOverlay}>
          <Badge label={shoe.stockStatus} variant="stock" />

          {!isAdmin && (
            <TouchableOpacity
              style={styles.heartButton}
              onPress={(e) => {
                e.stopPropagation();
                toggleWishlist(shoe.id);
              }}
              activeOpacity={0.8}
            >
              <Icon
                name="heart"
                size={16}
                color={isWishlisted ? '#FF3B5C' : '#94A3B8'}
              />
            </TouchableOpacity>
          )}
        </View>

        {isAdmin && (
          <View style={styles.adminOverlay}>
            {onEdit && (
              <TouchableOpacity
                style={[styles.actionButton, styles.editAction]}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteAction]}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.brand}>{shoe.brand}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {shoe.name}
            </Text>
          </View>

          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{shoe.category}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {shoe.description}
        </Text>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.price}>${shoe.price.toFixed(2)}</Text>
            <Text style={styles.subPrice}>Free delivery available</Text>
          </View>

          <View style={styles.metaStack}>
            {shoe.rating ? (
              <View style={styles.ratingBadge}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.ratingText}>{shoe.rating.toFixed(1)}</Text>
              </View>
            ) : null}

            {shoe.reviewCount ? (
              <Text style={styles.reviewText}>{shoe.reviewCount} reviews</Text>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FCE7EF',
    marginBottom: 14,
    width: '100%',
    shadowColor: '#FB7185',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  imageContainer: {
    height: 176,
    width: '100%',
    backgroundColor: '#FFF5F7',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  adminOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAction: {
    backgroundColor: '#7C3AED',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleCopy: {
    flex: 1,
  },
  brand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  categoryPill: {
    backgroundColor: '#FFF1F4',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF3B5C',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF3B5C',
  },
  subPrice: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  metaStack: {
    alignItems: 'flex-end',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  star: {
    fontSize: 11,
    color: '#D97706',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  reviewText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 5,
  },
});
