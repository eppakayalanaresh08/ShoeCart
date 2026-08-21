import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shoe, Order, CartItem, Customer, Category, Role, OrderStatus, UserAccount } from '../types';
import { INITIAL_SHOES, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_CATEGORIES } from '../data/initialData';

const STORAGE_KEYS = {
  ROLE: '@shoecart_role',
  USER: '@shoecart_user',
  ONBOARDING_COMPLETE: '@shoecart_onboarding_complete',
  SHOES: '@shoecart_shoes',
  ORDERS: '@shoecart_orders',
  CUSTOMERS: '@shoecart_customers',
  CART: '@shoecart_cart',
  WISHLIST: '@shoecart_wishlist',
};

interface AppContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  role: Role;
  setRole: (role: Role) => void;
  login: (email: string, role: Role, name?: string) => Promise<void>;
  updateCurrentUser: (updates: Partial<UserAccount>) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasCompletedOnboarding: boolean;
  isLoaded: boolean;
  shoes: Shoe[];
  orders: Order[];
  customers: Customer[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  selectedShoe: Shoe | null;
  setSelectedShoe: (shoe: Shoe | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  editingShoe: Shoe | null;
  setEditingShoe: (shoe: Shoe | null) => void;
  
  // Actions
  addShoe: (shoe: Omit<Shoe, 'id'>) => Promise<void>;
  updateShoe: (shoe: Shoe) => Promise<void>;
  deleteShoe: (id: string) => Promise<void>;
  
  addToCart: (shoe: Shoe, selectedSize: number, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartQuantity: (cartItemId: string, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkoutCart: (shippingAddress: string, discount?: number) => Promise<Order>;
  
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  toggleWishlist: (shoeId: string) => Promise<void>;
  resetDataToDefaults: () => Promise<void>;
  
  // Computed properties
  cartSubtotal: number;
  cartTotal: number;
  cartItemCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [role, setRoleState] = useState<Role>('user');
  const [activeTab, setActiveTab] = useState<string>('loading');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [shoes, setShoes] = useState<Shoe[]>(INITIAL_SHOES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingShoe, setEditingShoe] = useState<Shoe | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load initial data from AsyncStorage
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        const storedRole = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
        const storedOnboardingState = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
        const storedShoes = await AsyncStorage.getItem(STORAGE_KEYS.SHOES);
        const storedOrders = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
        const storedCustomers = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMERS);
        const storedCart = await AsyncStorage.getItem(STORAGE_KEYS.CART);
        const storedWishlist = await AsyncStorage.getItem(STORAGE_KEYS.WISHLIST);

        const onboardingComplete = storedOnboardingState === 'true';
        setHasCompletedOnboarding(onboardingComplete);

        if (storedUser) setCurrentUser(JSON.parse(storedUser));
        if (storedRole) setRoleState(storedRole as Role);
        if (storedShoes) setShoes(JSON.parse(storedShoes));
        if (storedOrders) setOrders(JSON.parse(storedOrders));
        if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

        if (storedUser) {
          const resolvedRole = (storedRole as Role | null) ?? 'user';
          setActiveTab(resolvedRole === 'admin' ? 'dashboard' : 'home');
        } else {
          setActiveTab('onboarding');
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
        setActiveTab('onboarding');
      } finally {
        setIsLoaded(true);
      }
    };

    loadStoredData();
  }, []);

  const login = async (email: string, targetRole: Role, name?: string) => {
    const userObj: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name || (targetRole === 'admin' ? 'Store Administrator' : 'Sneakerhead Customer'),
      email: email,
      role: targetRole,
      avatarUrl: targetRole === 'admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };
    setCurrentUser(userObj);
    setRoleState(targetRole);
    if (targetRole === 'admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('home');
    }
    await saveState(STORAGE_KEYS.USER, userObj);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ROLE, targetRole);
    } catch (e) {
      console.error('Failed to save role', e);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    setActiveTab('login');
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error('Failed to remove user', e);
    }
  };

  const updateCurrentUser = async (updates: Partial<UserAccount>) => {
    if (!currentUser) {
      return;
    }

    const updatedUser: UserAccount = {
      ...currentUser,
      ...updates,
    };

    setCurrentUser(updatedUser);
    await saveState(STORAGE_KEYS.USER, updatedUser);
  };

  const completeOnboarding = async () => {
    setHasCompletedOnboarding(true);
    setActiveTab('login');
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    } catch (e) {
      console.error('Failed to save onboarding state', e);
    }
  };

  // Save Role
  const setRole = async (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('home');
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    } catch (e) {
      console.error('Failed to save role', e);
    }
  };

  // Helper to persist state
  const saveState = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save key ${key}:`, e);
    }
  };

  // Admin Actions
  const addShoe = async (shoeData: Omit<Shoe, 'id'>) => {
    const newShoe: Shoe = {
      ...shoeData,
      id: `shoe-${Date.now()}`,
    };
    const updatedShoes = [newShoe, ...shoes];
    setShoes(updatedShoes);
    await saveState(STORAGE_KEYS.SHOES, updatedShoes);
  };

  const updateShoe = async (updatedShoe: Shoe) => {
    const updatedShoes = shoes.map((s) => (s.id === updatedShoe.id ? updatedShoe : s));
    setShoes(updatedShoes);
    await saveState(STORAGE_KEYS.SHOES, updatedShoes);
  };

  const deleteShoe = async (id: string) => {
    const updatedShoes = shoes.filter((s) => s.id !== id);
    setShoes(updatedShoes);
    await saveState(STORAGE_KEYS.SHOES, updatedShoes);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
    setOrders(updatedOrders);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
    await saveState(STORAGE_KEYS.ORDERS, updatedOrders);
  };

  // User Actions
  const addToCart = async (shoe: Shoe, selectedSize: number, quantity: number = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.shoe.id === shoe.id && item.selectedSize === selectedSize
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        shoe,
        selectedSize,
        quantity,
      };
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    await saveState(STORAGE_KEYS.CART, updatedCart);
  };

  const removeFromCart = async (cartItemId: string) => {
    const updatedCart = cart.filter((item) => item.id !== cartItemId);
    setCart(updatedCart);
    await saveState(STORAGE_KEYS.CART, updatedCart);
  };

  const updateCartQuantity = async (cartItemId: string, delta: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    setCart(updatedCart);
    await saveState(STORAGE_KEYS.CART, updatedCart);
  };

  const clearCart = async () => {
    setCart([]);
    await saveState(STORAGE_KEYS.CART, []);
  };

  const checkoutCart = async (shippingAddress: string, discount: number = 0): Promise<Order> => {
    const subtotal = cart.reduce((sum, item) => sum + item.shoe.price * item.quantity, 0);
    const shippingFee = subtotal > 150 ? 0 : 15.00;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const orderItems = cart.map((item) => ({
      shoeId: item.shoe.id,
      shoeName: item.shoe.name,
      brand: item.shoe.brand,
      imageUrl: item.shoe.imageUrl,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      unitPrice: item.shoe.price,
    }));

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Sneakerhead User',
      customerEmail: 'sneaker.head@email.com',
      customerPhone: '+1 999 888 7777',
      shippingAddress: shippingAddress || '123 Main Street, New York, NY 10001',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ` at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      items: orderItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: discount > 0 ? parseFloat(discount.toFixed(2)) : undefined,
      shippingFee: parseFloat(shippingFee.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'Processing',
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    await saveState(STORAGE_KEYS.ORDERS, updatedOrders);
    await clearCart();
    return newOrder;
  };

  const toggleWishlist = async (shoeId: string) => {
    const isWishlisted = wishlist.includes(shoeId);
    const updatedWishlist = isWishlisted
      ? wishlist.filter((id) => id !== shoeId)
      : [...wishlist, shoeId];

    setWishlist(updatedWishlist);
    await saveState(STORAGE_KEYS.WISHLIST, updatedWishlist);
  };

  const resetDataToDefaults = async () => {
    setShoes(INITIAL_SHOES);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setCart([]);
    setWishlist([]);
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SHOES,
      STORAGE_KEYS.ORDERS,
      STORAGE_KEYS.CUSTOMERS,
      STORAGE_KEYS.CART,
      STORAGE_KEYS.WISHLIST,
    ]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.shoe.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartSubtotal + (cartSubtotal > 150 || cartItemCount === 0 ? 0 : 15.00);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role,
        setRole,
        login,
        updateCurrentUser,
        logout,
        completeOnboarding,
        activeTab,
        setActiveTab,
        hasCompletedOnboarding,
        isLoaded,
        shoes,
        orders,
        customers,
        categories,
        cart,
        wishlist,
        selectedShoe,
        setSelectedShoe,
        selectedOrder,
        setSelectedOrder,
        editingShoe,
        setEditingShoe,
        addShoe,
        updateShoe,
        deleteShoe,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkoutCart,
        updateOrderStatus,
        toggleWishlist,
        resetDataToDefaults,
        cartSubtotal,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
