import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the shape of a single item in the cart
export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

// Define the shape of the entire store's state and its actions
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Action to add an item to the cart
      addItem: (newItem, quantity = 1) => {
        const existingItem = get().items.find(item => item.variantId === newItem.variantId);
        if (existingItem) {
          // If item already exists, just update its quantity
          get().updateQuantity(newItem.variantId, existingItem.quantity + quantity);
        } else {
          // Otherwise, add the new item to the cart
          set(state => ({ items: [...state.items, { ...newItem, quantity }] }));
        }
      },

      // Action to remove an item completely
      removeItem: (variantId) => {
        set(state => ({ items: state.items.filter(item => item.variantId !== variantId) }));
      },

      // Action to update the quantity of an item
      updateQuantity: (variantId, quantity) => {
        set(state => ({
          items: state.items.map(item =>
            item.variantId === variantId ? { ...item, quantity: Math.max(0, quantity) } : item
          ).filter(item => item.quantity > 0) // Remove item if quantity becomes 0
        }));
      },
      
      // Action to clear the entire cart
      clearCart: () => set({ items: [] }),

      // A helper function to get the total number of items
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'shopping-cart-storage', // name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);