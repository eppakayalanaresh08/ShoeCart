import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Input } from '../../../components/common/Input';
import { OrderTable } from '../../../components/common/OrderTable';

export const AdminOrdersScreen: React.FC = () => {
  const { orders, updateOrderStatus, setSelectedOrder, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>All Orders</Text>

      <Input
        placeholder="Search orders by ID or customer..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        icon="search"
      />

      <OrderTable
        orders={filteredOrders}
        isAdmin={true}
        onUpdateStatus={updateOrderStatus}
        onSelectOrder={(order) => {
          setSelectedOrder(order);
          setActiveTab('order_details');
        }}
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
});
