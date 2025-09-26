# Bethany's Pie Shop - React + TypeScript

This is the React + TypeScript version of the Bethany's Pie Shop application, migrated from vanilla JavaScript.

## 🚀 Features

- **React 18** with TypeScript for type safety
- **React Router** for client-side navigation
- **Context API** for global state management
- **Custom Hooks** for data fetching and cart management
- **Responsive Design** with modern CSS
- **Component-based Architecture** for maintainability

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── PieCard/        # Individual pie display
│   ├── Cart/           # Cart functionality
│   ├── Header/         # Navigation header
│   ├── Hero/           # Hero carousel
│   ├── SearchBar/      # Search functionality
│   └── Footer/         # Application footer
├── contexts/           # React Context providers
│   └── CartContext.tsx # Global cart state
├── hooks/              # Custom React hooks
│   ├── useCart.ts      # Cart management hook
│   └── usePies.ts      # Pie data fetching hooks
├── pages/              # Page components
│   ├── HomePage.tsx    # Home page with hero and monthly pies
│   ├── CategoryPage.tsx # Category-specific pages
│   └── CartPage.tsx    # Full cart page
├── services/           # API service layer
│   └── pieService.ts   # Pie API calls
├── types/              # TypeScript type definitions
│   └── pie.ts          # Pie, Cart, and API types
└── utils/              # Utility functions
    └── cartStorage.ts  # Cart storage utilities
```

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔧 Development

1. **Start the backend server** (from the original project):

   ```bash
   cd ../AI-Workshop-VanillaJS
   npm start
   ```

2. **Start the React frontend**:

   ```bash
   npm start
   ```

3. **Open your browser** to `http://localhost:3000`

## 🎯 Migration Highlights

### From Vanilla JS to React:

1. **State Management**:

   - `cartStorage.js` → `useCart` hook + Context
   - DOM manipulation → React state

2. **Component Architecture**:

   - `createPieCard()` → `PieCard` component
   - HTML pages → React page components
   - Event listeners → React event handlers

3. **API Integration**:

   - `fetchPies()` → `usePies` hook
   - Manual error handling → React error boundaries

4. **Type Safety**:
   - JavaScript → TypeScript interfaces
   - Runtime errors → Compile-time type checking

## 🎨 Key Components

- **PieCard**: Displays individual pie information with add to cart
- **Cart**: Modal cart with item management
- **Hero**: Auto-advancing carousel
- **SearchBar**: Real-time search functionality
- **Header**: Navigation with cart preview

## 🔄 State Management

- **Cart Context**: Global cart state using React Context
- **Custom Hooks**: `useCart`, `usePies`, `useMonthlyPies`
- **Local Storage**: Persistent cart data
- **Cross-tab Sync**: Cart updates across browser tabs

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts for pie cards
- Responsive navigation
- Touch-friendly interactions

## 🚀 Next Steps

1. **Testing**: Add unit tests with React Testing Library
2. **Performance**: Implement code splitting and lazy loading
3. **Accessibility**: Add ARIA labels and keyboard navigation
4. **PWA**: Add service worker for offline functionality
5. **State Management**: Consider Redux Toolkit for complex state

## 🔗 API Integration

The React app connects to the same Express API as the vanilla version:

- `GET /api/pies` - Fetch all pies
- `GET /api/pies?category=fruit` - Fetch pies by category
- `GET /api/pies-of-the-month` - Fetch monthly featured pies

## 📝 Notes

- Maintains 100% feature parity with vanilla JS version
- Improved developer experience with TypeScript
- Better code organization and maintainability
- Modern React patterns and best practices
