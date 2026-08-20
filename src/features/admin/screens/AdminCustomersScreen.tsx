import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Input } from '../../../components/common/Input';

export const AdminCustomersScreen: React.FC = () => {
  const { customers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Customers</Text>

      <Input
        placeholder="Search customers..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        icon="search"
      />

      <View style={styles.customersList}>
        {filteredCustomers.map((customer) => (
          <View key={customer.id} style={styles.customerCard}>
            <Image source={{ uri: customer.avatarUrl }} style={styles.avatar} />

            <View style={styles.customerInfo}>
              <Text style={styles.name}>{customer.name}</Text>
              <Text style={styles.email}>{customer.email}</Text>
              <Text style={styles.phone}>{customer.phone}</Text>
              <Text style={styles.statsText}>
                Orders: <Text style={styles.highlight}>{customer.totalOrders}</Text> | Total Spent:{' '}
                <Text style={styles.highlight}>${customer.totalSpent.toFixed(2)}</Text>
              </Text>
            </View>
          </View>
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
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 16,
  },
  customersList: {
    gap: 12,
    paddingBottom: 24,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E2E8F0',
  },
  customerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  email: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  phone: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  statsText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    fontWeight: '600',
  },
  highlight: {
    color: '#7C3AED',
    fontWeight: '800',
  },
});
