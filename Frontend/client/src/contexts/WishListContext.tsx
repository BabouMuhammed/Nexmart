import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/api';

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]); // array of populated product objects
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
    (productId) => wishlist.some((p) => p._id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product) => {
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

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, isInWishlist, toggleWishlist, refreshWishlist: loadWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
