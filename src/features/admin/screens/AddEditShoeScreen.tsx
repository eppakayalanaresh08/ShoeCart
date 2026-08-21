import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { SizeSelector } from '../../../components/shoe/SizeSelector';
import { useApp } from '../../../context/AppContext';
import { themeColors } from '../../../theme/colors';
import { StockStatus } from '../../../types';

const IMAGE_PRESETS = [
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
];

const sharedMediaOptions = {
  mediaType: 'photo' as const,
  selectionLimit: 1 as const,
  quality: 0.9,
  maxWidth: 1600,
  maxHeight: 1600,
};

const cameraOptions: CameraOptions = {
  ...sharedMediaOptions,
  cameraType: 'back',
  saveToPhotos: false,
};

const galleryOptions: ImageLibraryOptions = {
  ...sharedMediaOptions,
};

export const AddEditShoeScreen: React.FC = () => {
  const { editingShoe, addShoe, updateShoe, setActiveTab, setEditingShoe } = useApp();
  const theme = themeColors.admin;

  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Running');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([7, 8, 9, 10, 11, 12]);
  const [stockStatus, setStockStatus] = useState<StockStatus>('In Stock');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePicker, setActivePicker] = useState<'camera' | 'gallery' | null>(null);

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
      setImageUrl(IMAGE_PRESETS[0]);
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

  const setSelectedAsset = (uri?: string) => {
    if (!uri) {
      Alert.alert('Image Missing', 'No image was returned. Please try again.');
      return;
    }

    setImageUrl(uri);
  };

  const handlePickFromCamera = async () => {
    setActivePicker('camera');
    try {
      const result = await launchCamera(cameraOptions);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode || result.errorMessage) {
        Alert.alert('Camera Error', result.errorMessage || 'Unable to open the camera right now.');
        return;
      }

      setSelectedAsset(result.assets?.[0]?.uri);
    } catch (error) {
      console.error(error);
      Alert.alert('Camera Error', 'Something went wrong while opening the camera.');
    } finally {
      setActivePicker(null);
    }
  };

  const handlePickFromGallery = async () => {
    setActivePicker('gallery');
    try {
      const result = await launchImageLibrary(galleryOptions);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode || result.errorMessage) {
        Alert.alert('Gallery Error', result.errorMessage || 'Unable to open the gallery right now.');
        return;
      }

      setSelectedAsset(result.assets?.[0]?.uri);
    } catch (error) {
      console.error(error);
      Alert.alert('Gallery Error', 'Something went wrong while opening the gallery.');
    } finally {
      setActivePicker(null);
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
          imageUrl: imageUrl || IMAGE_PRESETS[0],
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
          imageUrl: imageUrl || IMAGE_PRESETS[0],
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>{editingShoe ? 'Edit Shoe' : 'Add / Edit Shoe'}</Text>

      <View style={styles.imageUploadCard}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.uploadText}>Upload Shoe Image</Text>
            <Text style={styles.uploadSub}>
              Use your real camera or gallery to add a product photo.
            </Text>
          </View>
        )}

        <View style={styles.mediaActionRow}>
          <Button
            title="Open Camera"
            onPress={handlePickFromCamera}
            variant="outline"
            isLoading={activePicker === 'camera'}
            disabled={activePicker !== null}
            style={styles.mediaActionButton}
          />
          <Button
            title="Open Gallery"
            onPress={handlePickFromGallery}
            variant="secondary"
            isLoading={activePicker === 'gallery'}
            disabled={activePicker !== null}
            style={styles.mediaActionButton}
          />
        </View>

        {!!imageUrl && (
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => setImageUrl('')}
            activeOpacity={0.8}
          >
            <Text style={styles.removeImageText}>Remove selected image</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.presetLabel}>Quick preset images:</Text>
        <View style={styles.presetRow}>
          {IMAGE_PRESETS.map((url, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.presetThumb,
                imageUrl === url && { borderColor: theme.primaryLight },
              ]}
              onPress={() => setImageUrl(url)}
            >
              <Image source={{ uri: url }} style={styles.presetImg} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="Image URL (optional backup)"
        placeholder="https://example.com/shoe.jpg"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <Input
        label="Brand"
        placeholder="e.g. Nike, Adidas, Puma"
        value={brand}
        onChangeText={setBrand}
      />

      <Input
        label="Shoe Name"
        placeholder="e.g. Air Jordan 1"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="Price ($)"
        placeholder="e.g. 159.99"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Input
        label="Description"
        placeholder="e.g. The Air Jordan 1 combines iconic style with premium comfort..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={3}
      />

      <SizeSelector
        availableSizes={[7, 8, 9, 10, 11, 12]}
        selectedSize={null}
        onSelectSize={() => {}}
        isMultiSelect={true}
        selectedSizesMulti={selectedSizes}
        onToggleSizeMulti={handleToggleSize}
      />

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
    width: '100%',
    minHeight: 180,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
    textAlign: 'center',
  },
  uploadSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  mediaActionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 12,
  },
  mediaActionButton: {
    flex: 1,
  },
  removeImageButton: {
    marginBottom: 14,
  },
  removeImageText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
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
    width: '100%',
    justifyContent: 'space-between',
  },
  presetThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
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
