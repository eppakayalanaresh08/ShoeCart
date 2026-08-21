# ShoeCart

ShoeCart is a React Native shopping app with two role-based experiences:
## Customer Screens

<table>
  <tr>
    <td align="center">
      <img src="/screenimageassets/Splashscreen.jpeg" width="180"/><br/>
      <b>Splash Screen</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/onboarding1.jpeg" width="180"/><br/>
      <b>Onboarding 1</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/onboarding2.jpeg" width="180"/><br/>
      <b>Onboarding 2</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/onboarding3.jpeg" width="180"/><br/>
      <b>Onboarding 3</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/user/customerlogin.jpeg" width="180"/><br/>
      <b>User Login</b>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="/screenimageassets/user/Home.jpeg" width="180"/><br/>
      <b>Home</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/user/Category.jpeg" width="180"/><br/>
      <b>Categories</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/user/Cart.jpeg" width="180"/><br/>
      <b>Cart</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/user/productsDetails.jpeg" width="180"/><br/>
      <b>Product Details</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/user/address.jpeg" width="180"/><br/>
      <b>Address</b>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="/screenimageassets/user/Mycart.jpeg" width="180"/><br/>
      <b>My Cart</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/user/myorder.jpeg" width="180"/><br/>
      <b>Order</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/user/Myorders.jpeg" width="180"/><br/>
      <b>My Orders</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/user/userprofile.jpeg" width="180"/><br/>
      <b>User Profile</b>
    </td>
    <td></td>
  </tr>
</table>

## Admin Screens

<table>
  <tr>
    <td align="center">
      <img src="/screenimageassets/admin/adminlogin.jpeg" width="180"/><br/>
      <b>Admin Login</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/admin/homeadmin.jpeg" width="180"/><br/>
      <b>Admin Dashboard</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/admin/manageshoe.jpeg" width="180"/><br/>
      <b>Manage Shoes</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/admin/addproduct.jpeg" width="180"/><br/>
      <b>Add Product</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/admin/adminprofile.jpeg" width="180"/><br/>
      <b>Admin Profile</b>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="/screenimageassets/admin/allorders.jpeg" width="180"/><br/>
      <b>All Orders</b>
    </td>
    <td align="center">
      <img src="/screenimageassets/admin/customers.jpeg" width="180"/><br/>
      <b>Customers</b>
    </td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

- `Admin` mode for product and order management
- `User` mode for browsing, cart, checkout, and profile flows

The project uses local mock data plus `AsyncStorage` persistence, so it behaves like a small real app without requiring a backend.

## What This App Includes

### Admin features

- Dashboard with sales and order summary
- Shoe inventory management
- Add / edit shoe form
- Real image selection from camera or gallery in the admin shoe form
- Order list and order details
- Customer list
- Admin profile screen

### User features

- Onboarding flow
- Role-based login screen
- Home storefront
- Categories page
- Product details page
- Cart with quantity updates
- Promo code flow
- Orders page
- User profile page

## Default Behavior

This project is currently designed with a local-first approach.

- App data starts from mock data in `src/data/initialData.ts`
- App state is managed through `src/context/AppContext.tsx`
- User session, role, and onboarding state are stored with `AsyncStorage`
- If onboarding is not completed, the app opens onboarding first
- After login:
  - `Admin` goes to `dashboard`
  - `User` goes to `home`
- If no backend is connected, the app still works with local mock data

## Project Approach

The current implementation follows this approach:

- Build UI screens first for both admin and user flows
- Keep reusable UI inside shared components
- Use a simple context-based state layer instead of a heavier store
- Keep the project easy to run without API setup
- Use role-based theming:
  - `Admin` theme is purple-based
  - `User` theme is pink/red-based

## Folder Structure

```text
ShoeCart/
├── android/                        # Android native project
├── ios/                            # iOS native project
├── src/
│   ├── assets/                     # Local app assets
│   │   ├── appicon.png             # App icon source
│   │   ├── onboarding1.png         # Onboarding image 1
│   │   ├── onboarding2.png         # Onboarding image 2
│   │   └── onboarding3.png         # Onboarding image 3
│   ├── components/
│   │   ├── common/                 # Shared UI components
│   │   └── shoe/                   # Shoe-specific reusable UI
│   ├── context/
│   │   └── AppContext.tsx          # App state and persistence
│   ├── data/
│   │   └── initialData.ts          # Default mock shoes, orders, customers, categories
│   ├── features/
│   │   ├── admin/
│   │   │   └── screens/            # Admin screens
│   │   ├── auth/
│   │   │   └── screens/            # Onboarding and login screens
│   │   └── user/
│   │       └── screens/            # User screens
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Role-based screen rendering and tabs
│   ├── theme/
│   │   └── colors.ts               # Admin and user theme colors
│   └── types/
│       └── index.ts                # Shared TypeScript types
├── App.tsx                         # Main app entry
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```

## Image Paths Used In This Project

### Local image assets

- App icon source:
  - `src/assets/appicon.png`
- Onboarding images:
  - `src/assets/onboarding1.png`
  - `src/assets/onboarding2.png`
  - `src/assets/onboarding3.png`

### Admin image-related paths

- Admin add/edit shoe screen:
  - `src/features/admin/screens/AddEditShoeScreen.tsx`
- Admin customer avatars shown in customer list:
  - `src/features/admin/screens/AdminCustomersScreen.tsx`
- Admin order item images:
  - `src/features/admin/screens/AdminOrderDetailsScreen.tsx`
- Admin profile image source comes from current user data:
  - `src/features/admin/screens/AdminProfileScreen.tsx`

### User image-related paths

- User home/product cards:
  - `src/components/shoe/ShoeCard.tsx`
- User product details image:
  - `src/features/user/screens/ProductDetailsScreen.tsx`
- User cart item images:
  - `src/features/user/screens/UserCartScreen.tsx`
- User category images:
  - `src/features/user/screens/UserCategoriesScreen.tsx`
- User profile avatar choices:
  - `src/features/user/screens/UserProfileScreen.tsx`

### Default mock image source paths

Most default product and customer images currently come from `src/data/initialData.ts`.

- Product shoe images:
  - `INITIAL_SHOES`
- Order item images:
  - `INITIAL_ORDERS`
- Customer avatar images:
  - `INITIAL_CUSTOMERS`
- Category images:
  - `INITIAL_CATEGORIES`

### Current user avatar path

The logged-in user avatar is set in:

- `src/context/AppContext.tsx`

This file decides the default avatar URL for admin and user login sessions.

## Important Screens

### Auth

- `src/features/auth/screens/OnboardingScreen.tsx`
- `src/features/auth/screens/LoginScreen.tsx`

### Admin

- `src/features/admin/screens/AdminDashboardScreen.tsx`
- `src/features/admin/screens/ManageShoesScreen.tsx`
- `src/features/admin/screens/AddEditShoeScreen.tsx`
- `src/features/admin/screens/AdminOrdersScreen.tsx`
- `src/features/admin/screens/AdminOrderDetailsScreen.tsx`
- `src/features/admin/screens/AdminCustomersScreen.tsx`
- `src/features/admin/screens/AdminProfileScreen.tsx`

### User

- `src/features/user/screens/UserHomeScreen.tsx`
- `src/features/user/screens/UserCategoriesScreen.tsx`
- `src/features/user/screens/ProductDetailsScreen.tsx`
- `src/features/user/screens/UserCartScreen.tsx`
- `src/features/user/screens/UserOrdersScreen.tsx`
- `src/features/user/screens/UserProfileScreen.tsx`

## Theme and Role Styling

- Theme colors are defined in `src/theme/colors.ts`
- `Admin` uses purple/violet styling
- `User` uses pink/red styling
- Login screen switches top branding colors based on the selected role

## Running The Project

### Install

```bash
npm install
```

### Start Metro

```bash
npm run start
```

### Run Android

```bash
npm run android
```

### Run iOS

```bash
cd ios
pod install
cd ..
npm run ios
```

### Run tests

```bash
npm test
```

## Notes

- Admin shoe creation now supports camera and gallery image picking
- If you want permanent uploaded image storage across devices, a backend or file upload service will be needed later
- Right now the project is best for UI, flow, and local-state demonstration
