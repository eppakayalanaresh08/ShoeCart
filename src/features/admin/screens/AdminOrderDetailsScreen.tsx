import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../../components/common/Badge';

export const AdminOrderDetailsScreen: React.FC = () => {
  const { selectedOrder, setActiveTab, role } = useApp();

  if (!selectedOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No order selected.</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setActiveTab(role === 'admin' ? 'orders' : 'my_orders')}
        >
          <Text style={styles.backBtnText}>Back to Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.orderId}>#{selectedOrder.id}</Text>
            <Text style={styles.orderDate}>{selectedOrder.date}</Text>
          </View>
          <Badge label={selectedOrder.status} variant="order" />
        </View>

        <View style={styles.divider} />

        {/* Customer Info */}
        <Text style={styles.sectionHeading}>Customer</Text>
        <Text style={styles.customerName}>{selectedOrder.customerName}</Text>
        <Text style={styles.contactText}>{selectedOrder.customerEmail}</Text>
        {selectedOrder.customerPhone && (
          <Text style={styles.contactText}>{selectedOrder.customerPhone}</Text>
        )}

        <View style={styles.divider} />

        {/* Shipping Address */}
        <Text style={styles.sectionHeading}>Shipping Address</Text>
        <Text style={styles.addressText}>{selectedOrder.shippingAddress}</Text>

        <View style={styles.divider} />

        {/* Items List */}
        <Text style={styles.sectionHeading}>Items</Text>
        <View style={styles.itemsList}>
          {selectedOrder.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemThumb} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.shoeName}</Text>
                <Text style={styles.itemMeta}>
                  Size: {item.selectedSize}  |  Qty: {item.quantity}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Pricing Breakdown */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryVal}>${selectedOrder.subtotal.toFixed(2)}</Text>
        </View>

        {selectedOrder.discount ? (
          <View style={styles.summaryRow}>
            <Text style={{ fontSize: 13, color: '#10B981', fontWeight: '600' }}>Discount</Text>
            <Text style={{ fontSize: 13, color: '#10B981', fontWeight: '700' }}>
              -${selectedOrder.discount.toFixed(2)}
            </Text>
          </View>
        ) : null}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryVal}>
            {selectedOrder.shippingFee === 0 ? 'Free' : `$${selectedOrder.shippingFee.toFixed(2)}`}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalVal}>${selectedOrder.total.toFixed(2)}</Text>
        </View>
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
  emptyContainer: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#5B2E8C',
    borderRadius: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  orderDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  contactText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  addressText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#5B2E8C',
  },
});
