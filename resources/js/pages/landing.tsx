import ErrorBoundary from '@/components/error-boundary';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

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

type Props = {
    cameraProducts: Product[];
    lensProducts: Product[];
    cartItems: CartItem[];
};

const Landing = ({ cameraProducts, lensProducts }: Props) => {
    const [showCart, setShowCart] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState('');

    const handleAddToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.product_id === product.product_id);
            if (existingItem) {
                return prevCart.map((item) => (item.product.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                return [
                    ...prevCart,
                    {
                        product,
                        name: product.product_name,
                        price: product.twenty_four_hour_rent_price,
                        quantity: 1,
                    },
                ];
            }
        });

        setPopupMsg(`${product.product_name} berhasil ditambahkan ke keranjang!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <motion.div
            className="flex w-[180px] min-w-[180px] flex-col items-center rounded-xl bg-white p-4 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <img src={product.product_image} className="mb-3 h-32 w-full object-contain" />
            <div className="text-center text-sm leading-tight font-bold text-[#3a372f]">{product.product_name}</div>
            <div className="my-1 text-sm text-[#7b5e3b]">8 Jam: Rp {product.eight_hour_rent_price.toLocaleString('id-ID')}</div>
            <div className="my-1 text-sm text-[#7b5e3b]">24 Jam: Rp {product.twenty_four_hour_rent_price.toLocaleString('id-ID')}</div>
            <button
                onClick={() => handleAddToCart(product)}
                className="rounded bg-black px-4 py-1 text-sm font-bold text-white transition hover:bg-[#444]"
            >
                + Keranjang
            </button>
        </motion.div>
    );

    const cameraDisplay = cameraProducts;
    const lensDisplay = lensProducts;

    const randomHeroImages = [...cameraProducts, ...lensProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, 1)
        .map((product) => ({
            src: product.product_image,
            alt: product.product_name,
        }));

    const sliderSettings = {
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: randomHeroImages.length > 2,
        dots: true,
        arrows: true,
        slidesToShow: 1,
        responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
    };

    const sendToWhatsApp = () => {
        const phone = '+62895393014557';
        if (cart.length === 0) return;
        let message = 'Hello Admin, Saya ingin memesan:\n\n';
        let total = 0;

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `📸 ${item.name} - ${item.quantity} pcs - Rp ${itemTotal.toLocaleString()}\n`;
        });

        message += `\n💰 Total: Rp ${total.toLocaleString()}`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen flex-col bg-[#f6eee1]">
                {/* Navbar */}
                <div className="bg-black pb-16">
                    <Navbar cart={cart} setShowCart={setShowCart} />

                    {/* Hero Slider */}
                    <div className="mx-auto mt-6 w-full max-w-2xl px-4">
                        <Slider {...sliderSettings}>
                            {randomHeroImages.map((img, i) => (
                                <div key={i} className="px-2">
                                    {' '}
                                    {/* Add this wrapper div */}
                                    <motion.img
                                        src={img.src}
                                        alt={img.alt}
                                        className="h-auto w-full rounded-md shadow-xl"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                {/* Produk Kamera */}
                <section className="mt-10 px-6">
                    {/* <h3 className=" text-[#3a372f] font-bold text-xl mb-3">Kamera</h3> */}
                    <div className="scrollbar-hide flex justify-center gap-4 overflow-x-auto pb-4">
                        {cameraDisplay.map((item, i) => (
                            <ProductCard key={i} product={item} />
                        ))}
                    </div>
                </section>

                {/* Produk Lensa */}
                <section className="mt-6 mb-10 px-6">
                    {/* <h3 className="text-[#3a372f] font-bold text-xl mb-3">Lensa</h3> */}
                    <div className="scrollbar-hide flex justify-center gap-4 overflow-x-auto pb-4">
                        {lensDisplay.map((item, i) => (
                            <ProductCard key={i} product={item} />
                        ))}
                    </div>
                </section>

                {showCart && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                        <div className="w-96 rounded bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-bold">Keranjang</h2>
                            {cart.length === 0 ? (
                                <p>Keranjang kosong</p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.product.product_id} className="mb-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                {item.product.product_name} (x{item.quantity})
                                            </div>
                                            <button
                                                className="text-red-600"
                                                onClick={() => setCart(cart.filter((i) => i.product.product_id !== item.product.product_id))}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                            <button onClick={() => setShowCart(false)} className="mt-4 rounded bg-black px-4 py-2 text-white">
                                Tutup
                            </button>
                            <button onClick={sendToWhatsApp} className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                                Send to WhatsApp
                            </button>
                        </div>
                    </div>
                )}

                {/* Popup Keranjang */}
                <AnimatePresence>
                    {showPopup && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-10 left-1/2 z-50 -translate-x-1/2 transform rounded bg-green-600 px-6 py-3 text-white shadow-lg"
                        >
                            ✅ {popupMsg}
                        </motion.div>
                    )}
                </AnimatePresence>
                <Footer />
            </div>
        </ErrorBoundary>
    );
};
export default Landing;
