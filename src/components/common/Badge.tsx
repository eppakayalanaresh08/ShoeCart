import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StockStatus, OrderStatus } from '../../types';

interface BadgeProps {
  label: StockStatus | OrderStatus | string;
  variant?: 'stock' | 'order' | 'custom';
  color?: string;
  backgroundColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'custom', color, backgroundColor }) => {
  let bg = backgroundColor || '#F3F4F6';
  let txtColor = color || '#374151';

  if (variant === 'stock') {
    switch (label) {
      case 'In Stock':
        bg = '#D1FAE5';
        txtColor = '#065F46';
        break;
      case 'Low Stock':
        bg = '#FEF3C7';
        txtColor = '#92400E';
        break;
      case 'Out of Stock':
        bg = '#FEE2E2';
        txtColor = '#991B1B';
        break;
    }
  } else if (variant === 'order') {
    switch (label) {
      case 'Delivered':
        bg = '#D1FAE5';
        txtColor = '#047857';
        break;
      case 'Processing':
        bg = '#FEF3C7';
        txtColor = '#B45309';
        break;
      case 'Shipped':
        bg = '#DBEAFE';
        txtColor = '#1D4ED8';
        break;
      case 'Cancelled':
        bg = '#FEE2E2';
        txtColor = '#B91C1C';
        break;
    }
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: txtColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
