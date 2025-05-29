import React, { createContext, useContext, useState, ReactNode } from 'react';

type Product = {
  product_id: number;
  product_name: string;
  product_description: string;
  brand: string;
  product_image: string;
  eight_hour_rent_price: number;
  twenty_four_hour_rent_price: number;
};

type CartItem = {
  product: Product;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQuantity: (product_id: number) => void;
  decreaseQuantity: (product_id: number) => void;
  removeFromCart: (product_id: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart harus dipakai di dalam CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === newItem.name);
      if (existingItem) {
        return prevCart.map(item =>
          item.name === newItem.name ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  const increaseQuantity = (product_id: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.product_id === product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (product_id: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.product_id === product_id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const removeFromCart = (product_id: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.product_id !== product_id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export type { Product, CartItem };
