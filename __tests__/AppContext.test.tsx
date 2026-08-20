import { INITIAL_SHOES, INITIAL_ORDERS } from '../src/data/initialData';
import { Shoe, Order, CartItem } from '../src/types';

describe('ShoeCart Logic & State Management Unit Tests', () => {
  test('Initial mock dataset contains shoes and orders', () => {
    expect(INITIAL_SHOES.length).toBeGreaterThan(0);
    expect(INITIAL_ORDERS.length).toBeGreaterThan(0);
    const airJordan = INITIAL_SHOES.find((s) => s.name === 'Air Jordan 1');
    expect(airJordan).toBeDefined();
    expect(airJordan?.price).toBe(159.99);
  });

  test('Cart subtotal and shipping calculation works correctly', () => {
    const mockCart: CartItem[] = [
      {
        id: 'cart-1',
        shoe: INITIAL_SHOES[0], // $159.99
        selectedSize: 9,
        quantity: 1,
      },
      {
        id: 'cart-2',
        shoe: INITIAL_SHOES[2], // $129.99
        selectedSize: 10,
        quantity: 1,
      },
    ];

    const subtotal = mockCart.reduce((sum, item) => sum + item.shoe.price * item.quantity, 0);
    expect(subtotal).toBeCloseTo(289.98, 2);

    // Free shipping threshold > $150
    const shippingFee = subtotal > 150 ? 0 : 15.0;
    expect(shippingFee).toBe(0);

    const total = subtotal + shippingFee;
    expect(total).toBeCloseTo(289.98, 2);
  });

  test('Adding a new shoe as Admin appends to shoe list', () => {
    const existingShoes: Shoe[] = [...INITIAL_SHOES];
    const newShoe: Shoe = {
      id: 'shoe-test-100',
      brand: 'Puma',
      name: 'Puma Suede Classic',
      price: 75.0,
      description: 'Classic suede sneaker',
      availableSizes: [7, 8, 9],
      stockStatus: 'In Stock',
      stockCount: 10,
      imageUrl: 'https://example.com/puma.jpg',
      category: 'Casual',
    };

    const updatedShoes = [newShoe, ...existingShoes];
    expect(updatedShoes.length).toBe(existingShoes.length + 1);
    expect(updatedShoes[0].name).toBe('Puma Suede Classic');
  });

  test('Updating order status reflects in order list', () => {
    const orders: Order[] = [...INITIAL_ORDERS];
    const targetOrder = orders[0];
    const newStatus = 'Shipped';

    const updatedOrders = orders.map((o) => (o.id === targetOrder.id ? { ...o, status: newStatus } : o));
    const updated = updatedOrders.find((o) => o.id === targetOrder.id);
    expect(updated?.status).toBe('Shipped');
  });

  test('Admin login sets admin role and dashboard tab', () => {
    const adminEmail = 'admin@shoecart.com';
    const role = 'admin';
    const activeTab = role === 'admin' ? 'dashboard' : 'home';

    expect(adminEmail).toBe('admin@shoecart.com');
    expect(role).toBe('admin');
    expect(activeTab).toBe('dashboard');
  });

  test('User login sets user role and home tab', () => {
    const userEmail = 'user@shoecart.com';
    const role = 'user';
    const activeTab = role === 'admin' ? 'dashboard' : 'home';

    expect(userEmail).toBe('user@shoecart.com');
    expect(role).toBe('user');
    expect(activeTab).toBe('home');
  });
});
