/**
 * TypeScript interfaces for the Pie Shop application
 * Generated from the existing vanilla JS data structures
 */

export interface Pie {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'fruit' | 'cheesecake' | 'seasonal';
  image: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PiesApiResponse extends ApiResponse<Pie[]> {}

export interface MonthlyPiesApiResponse extends ApiResponse<Pie[]> {}

// Cart context type
export interface CartContextType {
  cart: Cart;
  addToCart: (pie: Pie) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

// Component props types
export interface PieCardProps {
  pie: Pie;
  onAddToCart: (pie: Pie) => void;
}

export interface CartItemProps {
  item: CartItem;
  onRemove?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

export interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

// Page props types
export interface HomePageProps {}

export interface CategoryPageProps {
  category: 'fruit' | 'cheesecake' | 'seasonal';
}

// Search and filter types
export interface SearchFilters {
  query: string;
  category: string;
}

export interface UsePiesReturn {
  pies: Pie[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseCartReturn {
  cart: Cart;
  addToCart: (pie: Pie) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  isInCart: (id: string) => boolean;
}
