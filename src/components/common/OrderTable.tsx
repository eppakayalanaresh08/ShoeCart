import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Order, OrderStatus } from '../../types';
import { Badge } from './Badge';

interface OrderTableProps {
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  isAdmin?: boolean;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
  isAdmin = false,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const filters = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'All') return true;
    return order.status === selectedFilter;
  });

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterRow}>
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  isActive && (isAdmin ? styles.adminActivePill : styles.userActivePill),
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptySub}>No orders match the selected filter category.</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          {filteredOrders.map((order) => {
            const firstItem = order.items[0];
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => onSelectOrder && onSelectOrder(order)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.shoeThumbContainer}>
                    {firstItem?.imageUrl ? (
                      <Image source={{ uri: firstItem.imageUrl }} style={styles.shoeThumb} />
                    ) : (
                      <View style={styles.placeholderThumb}>
                        <Text>👟</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.orderInfoMain}>
                    <View style={styles.idRow}>
                      <Text style={styles.orderId}>{order.id}</Text>
                      <Badge label={order.status} variant="order" />
                    </View>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                    <Text style={styles.itemCountText}>
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </Text>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.totalPrice}>${order.total.toFixed(2)}</Text>
                    <Text style={styles.viewDetailLink}>Details ›</Text>
                  </View>
                </View>

                {isAdmin && onUpdateStatus && (
                  <View style={styles.adminActionRow}>
                    <Text style={styles.updateStatusLabel}>Update Status:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.statusButtonsRow}>
                        {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                          (st) => (
                            <TouchableOpacity
                              key={st}
                              style={[
                                styles.statusChangeBtn,
                                order.status === st && styles.statusChangeBtnCurrent,
                              ]}
                              onPress={() => onUpdateStatus(order.id, st)}
                            >
                              <Text
                                style={[
                                  styles.statusChangeText,
                                  order.status === st && styles.statusChangeTextCurrent,
                                ]}
                              >
                                {st}
                              </Text>
                            </TouchableOpacity>
                          )
                        )}
                      </View>
                    </ScrollView>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  filterScroll: {
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  adminActivePill: {
    backgroundColor: '#5B2E8C',
  },
  userActivePill: {
    backgroundColor: '#FF3B5C',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  tableContainer: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shoeThumbContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  shoeThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderThumb: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfoMain: {
    flex: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  customerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  orderDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  itemCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewDetailLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
    marginTop: 4,
  },
  adminActionRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  updateStatusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statusChangeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  statusChangeBtnCurrent: {
    backgroundColor: '#7C3AED',
  },
  statusChangeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  statusChangeTextCurrent: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
