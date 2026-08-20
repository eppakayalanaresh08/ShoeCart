import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface QuantityPickerProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export const QuantityPicker: React.FC<QuantityPickerProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, quantity <= min && styles.disabledBtn]}
        onPress={onDecrement}
        disabled={quantity <= min}
      >
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.qtyText}>{quantity}</Text>

      <TouchableOpacity
        style={[styles.btn, quantity >= max && styles.disabledBtn]}
        onPress={onIncrement}
        disabled={quantity >= max}
      >
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  qtyText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
});
