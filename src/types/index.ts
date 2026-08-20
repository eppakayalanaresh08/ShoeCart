export type Role = 'admin' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Shoe {
  id: string;
  brand: string;
  name: string;
  price: number;
  description: string;
  availableSizes: number[];
  stockStatus: StockStatus;
  stockCount: number;
  imageUrl: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  isPopular?: boolean;
}

export interface CartItem {
  id: string;
  shoe: Shoe;
  selectedSize: number;
  quantity: number;
}

export interface OrderItem {
  shoeId: string;
  shoeName: string;
  brand: string;
  imageUrl: string;
  selectedSize: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
  imageUrl: string;
  iconName: string;
}
