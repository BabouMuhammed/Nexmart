import { createContext, useContext, useEffect, useState } from 'react';
import { addToCart, getCart } from '../services/api';

interface CartItem {
  _id: string;
  quantity: number;
}

interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  isLoadingCart: boolean;
  refreshCart: () => Promise<void>;
  addItemToCart: (productId: string, quantity?: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  const updateCartState = (items: any[]) => {
    const normalizedItems = items || [];
    setCartItems(normalizedItems);
    setCartCount(normalizedItems.reduce((sum, item) => sum + (item.quantity || 0), 0));
  };

  const refreshCart = async () => {
    try {
      const cart = await getCart();
      updateCartState(cart.items || []);
    } catch (error) {
      console.error('refreshCart failed:', error);
      updateCartState([]);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const addItemToCart = async (productId: string, quantity = 1) => {
    try {
      const cart = await addToCart(productId, quantity);
      updateCartState(cart.items || []);
    } catch (error) {
      console.error('addItemToCart failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, isLoadingCart, refreshCart, addItemToCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
