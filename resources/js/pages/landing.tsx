import ErrorBoundary from '@/components/error-boundary';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Product } from '../components/CartContext';
import { useCart } from '../components/CartContext';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

type Props = {
    cameraProducts: Product[];
    lensProducts: Product[];
};

const Landing = ({ cameraProducts, lensProducts }: Props) => {
    const { user } = usePage().props.auth as { user?: { name: string } };
    const { cart, addToCart } = useCart();
    const [showCart, setShowCart] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConflictPopup, setShowConflictPopup] = useState(false);
    const [conflictMsg, setConflictMsg] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState<'camera' | 'lens' | ''>('');
    // const [currentTypeFilter, setCurrentTypeFilter] = useState<'camera' | 'lens' | ''>('');
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

const ProductCard = ({ product }: { product: Product }) => {
    const [selectedDuration, setSelectedDuration] = useState<'8' | '24'>('8');

    const handleAddToCartWithDuration = (e: React.MouseEvent) => {
        // Prevent card click when clicking add to cart button
        e.stopPropagation();
        
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        const selectedPrice = selectedDuration === '8' ? product.eight_hour_rent_price : product.twenty_four_hour_rent_price;
        const itemName = `${product.product_name} (${selectedDuration} Jam)`;

        const hasConflict = cart.some((item) => {
            const is8Jam = item.name.includes('(8 Jam)');
            const is24Jam = item.name.includes('(24 Jam)');
            return (selectedDuration === '8' && is24Jam) || (selectedDuration === '24' && is8Jam);
        });

        if (hasConflict) {
            setConflictMsg(`Anda hanya bisa menyewa produk dengan durasi yang sama.`);
            setShowConflictPopup(true);
            setTimeout(() => setShowConflictPopup(false), 2500);
            return;
        }

        addToCart({
            product,
            name: itemName,
            price: selectedPrice,
            quantity: 1,
        });

        setPopupMsg(`${itemName} berhasil ditambahkan ke keranjang!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
    };

    const handleCardClick = () => {
        // Navigate to product detail page
        // Option 1: Using Inertia.js router (recommended for Laravel Inertia apps)
        window.location.href = `/product/${product.product_id}`;
        
        // Option 2: If using Inertia router, uncomment this:
        // import { router } from '@inertiajs/react';
        // router.visit(`/product/${product.id}`);
    };

    const handleDurationClick = (e: React.MouseEvent, duration: '8' | '24') => {
        // Prevent card click when clicking duration buttons
        e.stopPropagation();
        setSelectedDuration(duration);
    };

    return (
        <motion.div
            className="group relative flex w-[240px] min-w-[240px] flex-col overflow-hidden rounded-xl bg-slate-50 shadow-lg transition-all duration-300 hover:shadow-xl border border-slate-200 cursor-pointer"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={handleCardClick}
        >
            {/* Compact Image Container */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                <img 
                    src={product.product_image} 
                    className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105" 
                    alt={product.product_name}
                />
                {/* Optional: Add "View Details" overlay on hover */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-300 flex items-center justify-center">
                    <span className="text-slate-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 px-3 py-1 rounded-full text-sm">
                        Lihat Detail
                    </span>
                </div>
            </div>

            {/* Compact Content Container */}
            <div className="flex flex-col p-4 space-y-3">
                <h3 className="text-center font-semibold text-slate-800 text-sm leading-tight min-h-[2rem] flex items-center justify-center">
                    {product.product_name}
                </h3>

                {/* Compact Pricing */}
                <div className="flex gap-2 text-xs">
                    <div className="flex-1 rounded-lg bg-slate-100 p-2 text-center border border-slate-200">
                        <div className="text-slate-600 font-medium">8 Jam</div>
                        <div className="font-bold text-slate-700">Rp {product.eight_hour_rent_price.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="flex-1 rounded-lg bg-slate-100 p-2 text-center border border-slate-200">
                        <div className="text-slate-600 font-medium">24 Jam</div>
                        <div className="font-bold text-slate-700">Rp {product.twenty_four_hour_rent_price.toLocaleString('id-ID')}</div>
                    </div>
                </div>

                {/* Compact Duration Selection */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => handleDurationClick(e, '8')}
                        className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                            selectedDuration === '8' 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                    >
                        8 Jam
                    </button>
                    <button
                        onClick={(e) => handleDurationClick(e, '24')}
                        className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                            selectedDuration === '24' 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                    >
                        24 Jam
                    </button>
                </div>

                {/* Compact Add to Cart Button */}
                <button
                    onClick={handleAddToCartWithDuration}
                    className="rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-slate-700 shadow-md hover:shadow-lg"
                >
                    + Tambah ke Keranjang
                </button>
            </div>
        </motion.div>
    );
};

    // Ambil 3 gambar random untuk hero
    const randomHeroImages = [...cameraProducts, ...lensProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((product) => ({
            src: product.product_image,
            alt: product.product_name,
        }));

    // Function untuk mendapatkan index gambar berdasarkan posisi
    const getImageIndex = (position: 'left' | 'center' | 'right') => {
        const total = randomHeroImages.length;
        switch (position) {
            case 'left':
                return (currentHeroIndex - 1 + total) % total;
            case 'center':
                return currentHeroIndex;
            case 'right':
                return (currentHeroIndex + 1) % total;
            default:
                return currentHeroIndex;
        }
    };

    // Auto-rotate setiap 4 detik
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % randomHeroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [randomHeroImages.length]);

    const filteredCamera = cameraProducts.filter(
        (p) =>
            p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!brandFilter || p.brand === brandFilter) &&
            (typeFilter === '' || typeFilter === 'camera'),
    );

    const filteredLens = lensProducts.filter(
        (p) =>
            p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!brandFilter || p.brand === brandFilter) &&
            (typeFilter === '' || typeFilter === 'lens'),
    );

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-slate-50">
                {/* Custom Scrollbar Styles */}
                <style jsx global>{`
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    
                    /* Gradient radial untuk spotlight effect */
                    .bg-gradient-radial {
                        background: radial-gradient(circle, transparent 0%, rgba(15, 23, 42, 0.1) 70%);
                    }
                `}</style>

                {/* Extended Navy Background for Seamless Hero */}
                <div className="bg-slate-900 pb-16">
                    <Navbar 
                        cart={cart}
                        setShowCart={setShowCart}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        setBrandFilter={setBrandFilter}
                        setTypeFilter={setTypeFilter}
                        currentBrandFilter={brandFilter}
                        currentTypeFilter={typeFilter}
                    />

                    {/* Clean Hero Section - 3 Camera Display */}
                    <div className="mx-auto mt-8 w-full max-w-6xl px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative overflow-hidden rounded-3xl h-96 bg-gradient-to-br from-slate-800 to-slate-900"
                        >
                            <div className="flex items-center justify-center h-full relative">
                                {/* Left Camera */}
                                <motion.div
                                    className="absolute left-20 z-10"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 0.6, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <img
                                        src={randomHeroImages[getImageIndex('left')]?.src}
                                        alt={randomHeroImages[getImageIndex('left')]?.alt}
                                        className="h-48 w-48 object-contain filter drop-shadow-lg"
                                    />
                                </motion.div>

                                {/* Center Camera (Main Focus) */}
                                <motion.div
                                    className="z-20 relative"
                                    key={currentHeroIndex}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                                >
                                    <img
                                        src={randomHeroImages[getImageIndex('center')]?.src}
                                        alt={randomHeroImages[getImageIndex('center')]?.alt}
                                        className="h-64 w-64 object-contain filter drop-shadow-2xl"
                                    />
                                    {/* Spotlight effect */}
                                    <div className="absolute inset-0 bg-gradient-radial pointer-events-none rounded-full" />
                                </motion.div>

                                {/* Right Camera */}
                                <motion.div
                                    className="absolute right-20 z-10"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 0.6, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <img
                                        src={randomHeroImages[getImageIndex('right')]?.src}
                                        alt={randomHeroImages[getImageIndex('right')]?.alt}
                                        className="h-48 w-48 object-contain filter drop-shadow-lg"
                                    />
                                </motion.div>

                                {/* Navigation Dots */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {randomHeroImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentHeroIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                index === currentHeroIndex
                                                    ? 'bg-white shadow-lg scale-110'
                                                    : 'bg-white/40 hover:bg-white/60'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Camera Section */}
                {filteredCamera.length > 0 && (
                    <section className="py-12">
                        <div className="mx-auto max-w-7xl px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8 text-center"
                            >
                                <h2 className="text-3xl font-bold text-slate-800 mb-3">Kamera Profesional</h2>
                                <div className="h-1 w-24 bg-slate-600 mx-auto rounded-full"></div>
                            </motion.div>
                            
                            {/* Grid Layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center">
                                {filteredCamera.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: i * 0.1 }}
                                    >
                                        <ProductCard product={item} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Lens Section */}
                {filteredLens.length > 0 && (
                    <section className="pb-12">
                        <div className="mx-auto max-w-7xl px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8 text-center"
                            >
                                <h2 className="text-3xl font-bold text-slate-800 mb-3">Lensa Premium</h2>
                                <div className="h-1 w-24 bg-slate-600 mx-auto rounded-full"></div>
                            </motion.div>
                            
                            {/* Grid Layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center">
                                {filteredLens.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: i * 0.1 }}
                                    >
                                        <ProductCard product={item} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Success Popup */}
                <AnimatePresence>
                    {showPopup && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            className="fixed top-20 left-1/2 z-50 -translate-x-1/2 transform rounded-xl bg-green-600 px-6 py-4 text-white shadow-xl border border-green-500"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-600 text-sm font-bold">
                                    ✓
                                </div>
                                <span className="font-semibold">{popupMsg}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Conflict Popup */}
                <AnimatePresence>
                    {showConflictPopup && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            className="fixed top-20 left-1/2 z-50 -translate-x-1/2 transform rounded-xl bg-red-600 px-6 py-4 text-white shadow-xl border border-red-500"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 text-sm font-bold">
                                    !
                                </div>
                                <span className="font-semibold">{conflictMsg}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Login Prompt Modal */}
                {showLoginPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm"
                        onClick={() => setShowLoginPrompt(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="w-full max-w-md rounded-2xl bg-slate-50 p-8 shadow-2xl border border-slate-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                                    <svg className="h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 className="mb-2 text-2xl font-bold text-slate-800">Login Diperlukan</h2>
                                <p className="mb-6 text-slate-600">Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.</p>
                                <div className="flex gap-3">
                                    <button 
                                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100 transition-colors duration-200" 
                                        onClick={() => setShowLoginPrompt(false)}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        className="flex-1 rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white hover:bg-slate-700 transition-colors duration-200"
                                        onClick={() => {
                                            setShowLoginPrompt(false);
                                            window.location.href = '/login';
                                        }}
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                <Footer />
            </div>
        </ErrorBoundary>
    );
};

export default Landing;