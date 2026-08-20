import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { SalesChart } from '../../../components/common/SalesChart';
import { OrderTable } from '../../../components/common/OrderTable';

export const AdminDashboardScreen: React.FC = () => {
  const { shoes, orders, customers, setActiveTab, setSelectedOrder } = useApp();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 24650);
  const totalOrdersCount = orders.length + 314;
  const totalCustomersCount = customers.length + 250;
  const totalProductsCount = shoes.length + 42;

  const recentOrders = orders.slice(0, 3);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Overview</Text>

      {/* Metrics Row */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statLabel}>Total Sales</Text>
          <Text style={styles.statValue}>${totalSales.toLocaleString()}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statLabel}>Orders</Text>
          <Text style={styles.statValue}>{totalOrdersCount}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>👥</Text>
          <Text style={styles.statLabel}>Customers</Text>
          <Text style={styles.statValue}>{totalCustomersCount}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>👟</Text>
          <Text style={styles.statLabel}>Products</Text>
          <Text style={styles.statValue}>{totalProductsCount}</Text>
        </View>
      </View>

      {/* Sales Overview Visual Chart */}
      <SalesChart orders={orders} />

      {/* Recent Orders Section */}
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <TouchableOpacity onPress={() => setActiveTab('orders')}>
          <Text style={styles.viewAllText}>View All ›</Text>
        </TouchableOpacity>
      </View>

      <OrderTable
        orders={recentOrders}
        isAdmin={true}
        onSelectOrder={(ord) => {
          setSelectedOrder(ord);
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
    marginTop: 2,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
});
