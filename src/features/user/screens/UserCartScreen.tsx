import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useApp } from '../../../context/AppContext';
import { QuantityPicker } from '../../../components/shoe/QuantityPicker';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Icon } from '../../../components/common/Icon';

export const UserCartScreen: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    checkoutCart,
    setActiveTab,
    setSelectedOrder,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [shippingAddress, setShippingAddress] = useState('123 Main Street, New York, NY 10001');
  const [isProcessing, setIsProcessing] = useState(false);

  const openFeedbackModal = (title: string, message: string) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setShowFeedbackModal(true);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SNEAKER10') {
      setDiscount(cartSubtotal * 0.1);
      setPromoApplied(true);
      openFeedbackModal('Promo Applied!', 'You saved 10% on your cart total.');
    } else {
      openFeedbackModal('Invalid Code', 'Try code "SNEAKER10" for 10% off.');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discount);

  const handleConfirmCheckout = async () => {
    setIsProcessing(true);
    try {
      const newOrder = await checkoutCart(shippingAddress, discount);
      setShowCheckoutModal(false);
      setSelectedOrder(newOrder);
      setActiveTab('my_orders');
      openFeedbackModal('Order Placed!', `Thank you! Order #${newOrder.id} placed successfully.`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartIcon}>ðŸ›’</Text>
        <Text style={styles.emptyCartTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptyCartSub}>
          Looks like you haven't added any shoes to your cart yet.
        </Text>
        <Button
          title="Start Shopping"
          onPress={() => setActiveTab('home')}
          style={styles.startShopBtn}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* <Text style={styles.screenTitle}>My Cart</Text> */}

      {/* Cart Items List */}
      <View style={styles.itemsList}>
        {cart.map((item) => (
          <View key={item.id} style={styles.cartItemCard}>
            <Image source={{ uri: item.shoe.imageUrl }} style={styles.itemImage} />

            <View style={styles.itemInfo}>
              <Text style={styles.shoeBrand}>{item.shoe.brand}</Text>
              <Text style={styles.shoeName} numberOfLines={1}>
                {item.shoe.name}
              </Text>
              <Text style={styles.shoeSize}>Size: {item.selectedSize}</Text>
              <Text style={styles.shoePrice}>${(item.shoe.price * item.quantity).toFixed(2)}</Text>
            </View>

            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.trashBtn}
                onPress={() => removeFromCart(item.id)}
              >
                <Icon name="x" size={14} color="#6B7280" />
              </TouchableOpacity>

              <QuantityPicker
                quantity={item.quantity}
                onIncrement={() => updateCartQuantity(item.id, 1)}
                onDecrement={() => updateCartQuantity(item.id, -1)}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Promo Code Card */}
      <View style={styles.promoCard}>
        <View style={styles.promoHeader}>
          <View>
            <Text style={styles.promoLabel}>Have a promo code?</Text>
            <Text style={styles.promoHint}>Use `SNEAKER10` to save 10% on this order.</Text>
          </View>
          <View style={styles.promoIconWrap}>
            <Icon name="zap" size={16} color="#FF3B5C" />
          </View>
        </View>
        <View style={styles.promoInputRow}>
          <View style={styles.flexInput}>
            <Input
              placeholder="e.g. SNEAKER10"
              value={promoCode}
              onChangeText={setPromoCode}
              style={styles.promoInput}
            />
          </View>
          <Button
            title={promoApplied ? 'Applied' : 'Apply'}
            variant={promoApplied ? 'secondary' : 'primary'}
            onPress={handleApplyPromo}
            disabled={promoApplied}
            style={styles.applyBtn}
            textStyle={styles.applyBtnText}
          />
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${cartSubtotal.toFixed(2)}</Text>
        </View>

        {discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.discountLabel}>Discount (SNEAKER10)</Text>
            <Text style={styles.discountValue}>-${discount.toFixed(2)}</Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {cartSubtotal > 150 ? 'Free' : '$15.00'}
          </Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
        </View>

        <Button
          title="Checkout"
          onPress={() => setShowCheckoutModal(true)}
          style={styles.checkoutBtn}
        />
      </View>

      {/* Checkout Modal */}
      <Modal
        visible={showCheckoutModal}
        title="Complete Order"
        onClose={() => setShowCheckoutModal(false)}
      >
        <Text style={styles.modalSub}>Verify your shipping details to complete checkout:</Text>
        <Input
          label="Shipping Address"
          placeholder="Enter address"
          value={shippingAddress}
          onChangeText={setShippingAddress}
          multiline={true}
          numberOfLines={2}
        />

        <View style={styles.modalSummary}>
          <Text style={styles.modalTotalText}>Total Amount: ${finalTotal.toFixed(2)}</Text>
          <Text style={styles.modalPaymentNotice}>Payment Method: Cash on Delivery (Test Mode)</Text>
        </View>

        <Button
          title="Place Order Now"
          onPress={handleConfirmCheckout}
          isLoading={isProcessing}
          style={styles.confirmCheckoutBtn}
        />
      </Modal>

      <Modal
        visible={showFeedbackModal}
        title={feedbackTitle}
        onClose={() => setShowFeedbackModal(false)}
      >
        <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        <Button
          title="OK"
          onPress={() => setShowFeedbackModal(false)}
          style={styles.feedbackBtn}
        />
      </Modal>
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
  emptyCartContainer: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyCartIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  emptyCartSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  startShopBtn: {
    backgroundColor: '#FF3B5C',
    paddingHorizontal: 24,
  },
  itemsList: {
    gap: 12,
    marginBottom: 16,
  },
  cartItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemImage: {
    width: 65,
    height: 65,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  itemInfo: {
    flex: 1,
  },
  shoeBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  shoeName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  shoeSize: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  shoePrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FF3B5C',
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 65,
  },
  trashBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginTop: -15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  promoLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  promoHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  promoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF1F4',
    borderWidth: 1,
    borderColor: '#FFE4E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  flexInput: {
    flex: 1,
    marginBottom: 0,
  },
  promoInput: {
    marginBottom: 0,
  },
  applyBtn: {
    height: 46,
    minWidth: 96,
    paddingHorizontal: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  applyBtnText: {
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  discountLabel: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF3B5C',
  },
  checkoutBtn: {
    marginTop: 16,
    backgroundColor: '#FF3B5C',
  },
  modalSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  modalSummary: {
    backgroundColor: '#FFF1F2',
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  modalTotalText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF3B5C',
  },
  modalPaymentNotice: {
    fontSize: 12,
    color: '#9F1239',
    marginTop: 2,
  },
  confirmCheckoutBtn: {
    backgroundColor: '#FF3B5C',
  },
  feedbackText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  feedbackBtn: {
    backgroundColor: '#FF3B5C',
  },
});
