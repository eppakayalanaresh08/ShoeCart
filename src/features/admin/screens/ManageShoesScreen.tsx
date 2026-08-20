import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { ShoeCard } from '../../../components/shoe/ShoeCard';
import { Shoe } from '../../../types';

export const ManageShoesScreen: React.FC = () => {
  const { shoes, deleteShoe, setEditingShoe, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const browserConfirm =
    typeof globalThis !== 'undefined' &&
    'window' in globalThis &&
    typeof globalThis.window?.confirm === 'function'
      ? globalThis.window.confirm.bind(globalThis.window)
      : null;

  const filteredShoes = shoes.filter(
    (shoe) =>
      shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shoe.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (shoe: Shoe) => {
    setEditingShoe(shoe);
    setActiveTab('add_shoe');
  };

  const handleDelete = (shoe: Shoe) => {
    if (browserConfirm) {
      if (browserConfirm(`Are you sure you want to delete ${shoe.name}?`)) {
        deleteShoe(shoe.id);
      }
    } else {
      Alert.alert('Delete Shoe', `Are you sure you want to delete ${shoe.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteShoe(shoe.id) },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Manage Shoes</Text>

      <Input
        placeholder="Search shoes by name or brand..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        icon="search"
      />

      <Button
        title="Add New Shoe"
        icon="plus-circle"
        onPress={() => {
          setEditingShoe(null);
          setActiveTab('add_shoe');
        }}
        style={styles.addButton}
      />

      <View style={styles.shoesGrid}>
        {filteredShoes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No shoes matching search.</Text>
          </View>
        ) : (
          filteredShoes.map((shoe) => (
            <ShoeCard
              key={shoe.id}
              shoe={shoe}
              isAdmin={true}
              onEdit={() => handleEdit(shoe)}
              onDelete={() => handleDelete(shoe)}
            />
          ))
        )}
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
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: '#5B2E8C',
  },
  shoesGrid: {
    gap: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
});
