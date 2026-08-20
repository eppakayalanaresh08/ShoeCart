import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { SizeSelector } from '../../../components/shoe/SizeSelector';
import { StockStatus } from '../../../types';

export const AddEditShoeScreen: React.FC = () => {
  const { editingShoe, addShoe, updateShoe, setActiveTab, setEditingShoe } = useApp();

  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Running');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([7, 8, 9, 10, 11, 12]);
  const [stockStatus, setStockStatus] = useState<StockStatus>('In Stock');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset sample shoe images for quick selection
  const imagePresets = [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
  ];

  useEffect(() => {
    if (editingShoe) {
      setBrand(editingShoe.brand);
      setName(editingShoe.name);
      setPrice(editingShoe.price.toString());
      setDescription(editingShoe.description);
      setImageUrl(editingShoe.imageUrl);
      setCategory(editingShoe.category || 'Lifestyle');
      setSelectedSizes(editingShoe.availableSizes || [7, 8, 9, 10, 11, 12]);
      setStockStatus(editingShoe.stockStatus);
    } else {
      setBrand('');
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl(imagePresets[0]);
      setCategory('Running');
      setSelectedSizes([7, 8, 9, 10, 11, 12]);
      setStockStatus('In Stock');
    }
  }, [editingShoe]);

  const handleToggleSize = (size: number) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size].sort((a, b) => a - b));
    }
  };

  const handleSave = async () => {
    if (!brand.trim() || !name.trim() || !price.trim()) {
      Alert.alert('Missing Fields', 'Please fill in Brand, Shoe Name, and Price.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid numeric price.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingShoe) {
        await updateShoe({
          ...editingShoe,
          brand,
          name,
          price: numPrice,
          description: description || 'Premium athletic performance and casual shoe.',
          imageUrl: imageUrl || imagePresets[0],
          category,
          availableSizes: selectedSizes,
          stockStatus,
        });
      } else {
        await addShoe({
          brand,
          name,
          price: numPrice,
          description: description || 'Premium athletic performance and casual shoe.',
          imageUrl: imageUrl || imagePresets[0],
          category,
          availableSizes: selectedSizes,
          stockStatus,
          stockCount: stockStatus === 'In Stock' ? 20 : stockStatus === 'Low Stock' ? 3 : 0,
          rating: 4.8,
          reviewCount: 1,
        });
      }
      setEditingShoe(null);
      setActiveTab('shoes');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>
        {editingShoe ? 'Edit Shoe' : 'Add / Edit Shoe'}
      </Text>

      {/* Image Preview & Preset Selection */}
      <View style={styles.imageUploadCard}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.cloudIcon}>☁️</Text>
            <Text style={styles.uploadText}>Upload Shoe Image</Text>
            <Text style={styles.uploadSub}>PNG, JPG up to 5MB</Text>
          </View>
        )}

        {/* Preset Selectors */}
        <Text style={styles.presetLabel}>Select Preset Image or enter Image URL below:</Text>
        <View style={styles.presetRow}>
          {imagePresets.map((url, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.presetThumb, imageUrl === url && styles.selectedPresetThumb]}
              onPress={() => setImageUrl(url)}
            >
              <Image source={{ uri: url }} style={styles.presetImg} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Image URL Direct Input */}
      <Input
        label="Image URL"
        placeholder="https://example.com/shoe.jpg"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      {/* Brand */}
      <Input
        label="Brand"
        placeholder="e.g. Nike, Adidas, Puma"
        value={brand}
        onChangeText={setBrand}
      />

      {/* Shoe Name */}
      <Input
        label="Shoe Name"
        placeholder="e.g. Air Jordan 1"
        value={name}
        onChangeText={setName}
      />

      {/* Price */}
      <Input
        label="Price ($)"
        placeholder="e.g. 159.99"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Description */}
      <Input
        label="Description"
        placeholder="e.g. The Air Jordan 1 combines iconic style with premium comfort..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={3}
      />

      {/* Available Sizes Multi-Select */}
      <SizeSelector
        availableSizes={[7, 8, 9, 10, 11, 12]}
        selectedSize={null}
        onSelectSize={() => {}}
        isMultiSelect={true}
        selectedSizesMulti={selectedSizes}
        onToggleSizeMulti={handleToggleSize}
      />

      {/* Stock Status Picker */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Stock Status</Text>
        <View style={styles.statusOptionsRow}>
          {(['In Stock', 'Low Stock', 'Out of Stock'] as StockStatus[]).map((st) => (
            <TouchableOpacity
              key={st}
              style={[
                styles.statusOptionPill,
                stockStatus === st && styles.selectedStatusPill,
              ]}
              onPress={() => setStockStatus(st)}
            >
              <Text
                style={[
                  styles.statusOptionText,
                  stockStatus === st && styles.selectedStatusText,
                ]}
              >
                {st}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Save Shoe Button */}
      <Button
        title={editingShoe ? 'Update Shoe' : 'Save Shoe'}
        onPress={handleSave}
        isLoading={isSubmitting}
        style={styles.saveButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 16,
  },
  imageUploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  cloudIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  uploadSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPresetThumb: {
    borderColor: '#7C3AED',
  },
  presetImg: {
    width: '100%',
    height: '100%',
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 8,
  },
  statusOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOptionPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  selectedStatusPill: {
    backgroundColor: '#5B2E8C',
    borderColor: '#5B2E8C',
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  selectedStatusText: {
    color: '#FFFFFF',
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 32,
    backgroundColor: '#5B2E8C',
  },
});
