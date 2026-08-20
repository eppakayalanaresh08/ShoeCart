# ShoeCart - Production-Level React Native Application

![ShoeCart Banner](https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80)

**ShoeCart** is a modern, full-featured React Native application built for both **Admin** and **End-User** e-commerce workflows. Designed with responsive aesthetics, local data persistence via `AsyncStorage`, functional components, unit tests, and cross-platform web support.

---

## 🌟 Key Features

### 👑 Admin App Mode
- **Dashboard Overview**: Metrics cards (Total Sales, Total Orders, Customers, Products) + Visual SVG Sales Trend Chart + Recent Orders summary.
- **Manage Shoes**: Searchable inventory list with brand filters, stock status badges (In Stock, Low Stock, Out of Stock), and quick edit/delete controls.
- **Add / Edit Shoe**: Form with image URL selection & presets, brand, name, price, description, multi-select shoe sizes (7–12), and stock status selector.
- **All Orders Table**: View all store orders with status filter pills (All, Processing, Shipped, Delivered, Cancelled) and inline status drop-down updater.
- **Order Details View**: Comprehensive breakdown of order items, customer info, shipping address, size/quantity specifications, and total summary.
- **Customers**: Directory of store customers with avatars, contact information, total order count, and total spend metrics.

### 👤 User App Mode
- **Home / Shop Screen**: Greeting banner, search bar, hero promo banner ("AIR JORDAN 1"), category pills, brand filter logos, and Top Picks product grid.
- **Categories Screen**: Visual category cards (Running, Lifestyle, Basketball, Training, Casual, Sports) and promotional discount banner ("SALE Up to 40% Off").
- **Product Details Screen**: Product image gallery, rating scores, price, description, interactive size chips (US 7–12), Add to Cart, Buy Now, and Wishlist toggle.
- **Cart Management**: Cart items list with image thumbnails, selected size, `+` / `-` quantity controls, item removal, promo code engine (`SNEAKER10` for 10% off), subtotal, shipping calculation, and Checkout modal.
- **My Orders**: View user's placed order history in card/table layout with status filtering.
- **Profile Screen**: User avatar, saved wishlist count, order count summary, data reset button, and quick Role Switcher toggle button.

---

## 🏗️ Architecture & Best Practices

```
ShoeCart/
├── __tests__/                  # Jest unit tests (AppContext & App render)
├── __mocks__/                  # Mocks for AsyncStorage & Native Modules
├── src/
│   ├── types/                  # TypeScript interface definitions (Shoe, Order, CartItem, Customer)
│   ├── data/                   # Realistic initial mock datasets
│   ├── context/                # AppContext (Redux/AsyncStorage persistence layer)
│   ├── theme/                  # Design tokens & color palettes for Admin (Purple) & User (Red)
│   ├── components/
│   │   ├── common/             # Reusable UI (Header, Button, Badge, Input, Modal, SalesChart, OrderTable)
│   │   └── shoe/               # ShoeCard, SizeSelector, QuantityPicker
│   ├── features/
│   │   ├── admin/              # Admin feature screens (Dashboard, ManageShoes, AddEditShoe, AllOrders, Customers)
│   │   └── user/               # User feature screens (Home, Categories, ProductDetails, Cart, MyOrders, Profile)
│   ├── navigation/             # AppNavigator & Role Switcher
│   └── index.web.tsx           # React Native Web entry point
├── App.tsx                     # Main App component
├── vite.config.ts              # Vite web bundler config with react-native-web alias
├── README.md                   # Application setup & documentation
└── FUTURE_IMPROVEMENTS.md      # Detailed future production roadmap
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd ShoeCart
npm install
```

### 2. Running Web Preview (Instant Browser Demo)
To start the Vite web dev server:
```bash
npm run dev
```
Open `http://localhost:3000/` or `http://localhost:3001/` in your browser.

### 3. Running Mobile (React Native Android / iOS)

#### Android:
Ensure Android Studio and an Android Virtual Device (AVD) are running:
```bash
npm run start
# In a separate terminal tab:
npm run android
```

#### iOS (macOS only):
```bash
cd ios && pod install && cd ..
npm run ios
```

---

## 🧪 Running Unit Tests

Run the test suite using Jest:
```bash
npm test
```
All unit tests cover state management, cart total calculations, promo code discounts, order placement, and component rendering.

---

## 📑 Additional Documentation

For details on proposed future enhancements (Backend integration, Stripe payment gateway, push notifications, and CI/CD), please see [`FUTURE_IMPROVEMENTS.md`](./FUTURE_IMPROVEMENTS.md).
