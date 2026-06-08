// ============================================================
// CART HOOK — localStorage-based cart state
// ============================================================

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, ml: number) => void;
  updateQty: (productId: string, ml: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "luxury_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    try { localStorage.setItem(CART_KEY, JSON.stringify(newItems)); } catch {}
  };

  const addItem = (item: CartItem) => {
    const exists = items.find(
      (i) => i.productId === item.productId && i.ml === item.ml
    );
    if (exists) {
      save(
        items.map((i) =>
          i.productId === item.productId && i.ml === item.ml
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      );
    } else {
      save([...items, item]);
    }
  };

  const removeItem = (productId: string, ml: number) =>
    save(items.filter((i) => !(i.productId === productId && i.ml === ml)));

  const updateQty = (productId: string, ml: number, quantity: number) => {
    if (quantity <= 0) return removeItem(productId, ml);
    save(
      items.map((i) =>
        i.productId === productId && i.ml === ml ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => save([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
