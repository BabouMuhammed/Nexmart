import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './authContext.tsx';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/api';

export interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  [key: string]: any;
}

interface WishlistContextType {
  wishlist: WishlistProduct[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistProduct) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const items = await getWishlist();
      setWishlist(items || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p._id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product: WishlistProduct): Promise<boolean> => {
      if (!user) {
        // Caller should redirect to /login when this returns false
        return false;
      }

      const productId = product._id;
      const currentlyIn = wishlist.some((p) => p._id === productId);

      try {
        if (currentlyIn) {
          const updated = await removeFromWishlist(productId);
          setWishlist(updated || []);
        } else {
          const updated = await addToWishlist(productId);
          setWishlist(updated || []);
        }
        return true;
      } catch (err) {
        console.error('Failed to update wishlist:', err);
        return false;
      }
    },
    [user, wishlist]
  );

  const value: WishlistContextType = {
    wishlist,
    loading,
    isInWishlist,
    toggleWishlist,
    refreshWishlist: loadWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
