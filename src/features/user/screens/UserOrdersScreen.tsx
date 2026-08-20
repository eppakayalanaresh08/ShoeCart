import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { OrderTable } from '../../../components/common/OrderTable';

export const UserOrdersScreen: React.FC = () => {
  const { orders, setSelectedOrder, setActiveTab } = useApp();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>My Orders</Text>

      <OrderTable
        orders={orders}
        isAdmin={false}
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
    backgroundColor: '#FAFAFA',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 16,
  },
});
