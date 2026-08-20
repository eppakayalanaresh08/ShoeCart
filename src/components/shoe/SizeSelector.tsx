import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../theme/colors';

interface SizeSelectorProps {
  availableSizes: number[];
  selectedSize: number | null;
  onSelectSize: (size: number) => void;
  isMultiSelect?: boolean;
  selectedSizesMulti?: number[];
  onToggleSizeMulti?: (size: number) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  availableSizes,
  selectedSize,
  onSelectSize,
  isMultiSelect = false,
  selectedSizesMulti = [],
  onToggleSizeMulti,
}) => {
  const { role } = useApp();
  const theme = themeColors[role];
  const allPossibleSizes = [7, 8, 9, 10, 11, 12];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textDark }]}>Select Size (US):</Text>
      <View style={styles.chipsRow}>
        {allPossibleSizes.map((size) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = isMultiSelect
            ? selectedSizesMulti.includes(size)
            : selectedSize === size;

          return (
            <TouchableOpacity
              key={size}
              style={[
                styles.chip,
                isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                !isAvailable && !isMultiSelect && styles.disabledChip,
              ]}
              disabled={!isAvailable && !isMultiSelect}
              onPress={() => {
                if (isMultiSelect && onToggleSizeMulti) {
                  onToggleSizeMulti(size);
                } else if (isAvailable) {
                  onSelectSize(size);
                }
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#FFFFFF' : theme.textDark },
                  !isAvailable && !isMultiSelect && styles.disabledText,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  disabledChip: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.5,
  },
  disabledText: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
});
