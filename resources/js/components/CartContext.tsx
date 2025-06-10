import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

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
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart harus dipakai di dalam CartProvider');
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart dari localStorage saat component mount
    useEffect(() => {
        const loadCartFromStorage = () => {
            try {
                const savedCart = localStorage.getItem('camera_rental_cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCart(parsedCart);
                }
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                localStorage.removeItem('camera_rental_cart'); // Remove corrupted data
            }
            setIsLoaded(true);
        };

        loadCartFromStorage();
    }, []);

    // Save cart ke localStorage setiap kali cart berubah
    useEffect(() => {
        if (isLoaded) { // Only save after initial load
            try {
                localStorage.setItem('camera_rental_cart', JSON.stringify(cart));
                
                // Dispatch custom event untuk sync antar tab/window
                window.dispatchEvent(new CustomEvent('cartUpdated', { 
                    detail: { cart } 
                }));
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
        }
    }, [cart, isLoaded]);

    // Listen untuk changes dari tab/window lain
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'camera_rental_cart' && e.newValue) {
                try {
                    const newCart = JSON.parse(e.newValue);
                    setCart(newCart);
                } catch (error) {
                    console.error('Error parsing cart from storage event:', error);
                }
            }
        };

        const handleCartUpdate = (e: CustomEvent) => {
            // Update cart dari custom event (same tab/window)
            if (e.detail && e.detail.cart) {
                setCart(e.detail.cart);
            }
        };

        // Listen storage changes (different tabs)
        window.addEventListener('storage', handleStorageChange);
        
        // Listen custom events (same tab)
        window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
        };
    }, []);

    const addToCart = (newItem: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.name === newItem.name);
            if (existingItem) {
                return prevCart.map((item) => 
                    item.name === newItem.name 
                        ? { ...item, quantity: item.quantity + newItem.quantity } 
                        : item
                );
            } else {
                return [...prevCart, newItem];
            }
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const increaseQuantity = (product_id: number) => {
        setCart((prevCart) => 
            prevCart.map((item) => 
                item.product.product_id === product_id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            )
        );
    };

    const decreaseQuantity = (product_id: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product.product_id === product_id 
                    ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } 
                    : item
            )
        );
    };

    const removeFromCart = (product_id: number) => {
        setCart((prevCart) => 
            prevCart.filter((item) => item.product.product_id !== product_id)
        );
    };

    // Jangan render children sampai cart selesai di-load dari localStorage
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            </div>
        );
    }

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            increaseQuantity, 
            decreaseQuantity, 
            removeFromCart, 
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export type { CartItem, Product };