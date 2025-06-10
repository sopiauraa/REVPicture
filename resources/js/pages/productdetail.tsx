import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Clock, Tag, ShoppingCart } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { Link, usePage } from '@inertiajs/react';

// Type definition berdasarkan migration
type Product = {
    product_id: number;
    product_type: 'camera' | 'lens';
    product_name: string;
    product_description: string;
    product_image: string;
    brand: 'Canon' | 'Nikon' | 'Sony' | 'Fujifilm' | 'Lumix';
    eight_hour_rent_price: number;
    twenty_four_hour_rent_price: number;
    last_updated: string;
};

type Props = {
    product: Product;
};

const ProductDetail = ({ product }: Props) => {
    const { user } = usePage().props.auth as { user?: { name: string } };
    const [selectedDuration, setSelectedDuration] = useState<'8' | '24'>('8');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState('');
    const [showConflictPopup, setShowConflictPopup] = useState(false);
    const [conflictMsg, setConflictMsg] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // Gunakan useCart hook - hanya ambil yang diperlukan
    const { cart, addToCart } = useCart();

    // Fungsi untuk mendapatkan URL gambar yang benar
    const getImageUrl = (imagePath: string) => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        if (imagePath.startsWith('/')) {
            return imagePath;
        }
        if (imagePath.startsWith('products/')) {
            return `/${imagePath}`;
        }
        const category = product.product_type === 'camera' ? 'camera' : 'lens';
        return `/products/${category}/${imagePath}`;
    };

    // DIPERBAIKI: Fungsi add to cart - SAMA PERSIS dengan Landing
    const handleAddToCart = () => {
        // Check login first - SAMA dengan Landing
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        const selectedPrice = selectedDuration === '8' ? product.eight_hour_rent_price : product.twenty_four_hour_rent_price;
        const itemName = `${product.product_name} (${selectedDuration} Jam)`;

        // Check conflict - SAMA dengan Landing
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

        // Format yang SAMA PERSIS dengan Landing
        const cartItem = {
            product,
            name: itemName,
            price: selectedPrice,
            quantity: 1,
        };

        console.log("Adding to cart:", cartItem);
        addToCart(cartItem);
        
        setPopupMsg(`${itemName} berhasil ditambahkan ke keranjang!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
    };

    // Handle image error
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const currentSrc = img.src;
        
        const fallbackPaths = [
            `/${product.product_image}`,
            `/storage/${product.product_image}`,
            `/images/${product.product_image}`,
            '/images/placeholder.jpg',
            '/placeholder.jpg'
        ];
        
        const nextFallback = fallbackPaths.find(path => path !== currentSrc);
        
        if (nextFallback) {
            img.src = nextFallback;
        } else {
            setImageError(true);
            setImageLoaded(true);
        }
    };

    // Get brand color
    const getBrandColor = (brand: string) => {
        const colors = {
            'Canon': 'bg-red-100 text-red-800 border-red-200',
            'Nikon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Sony': 'bg-blue-100 text-blue-800 border-blue-200',
            'Fujifilm': 'bg-green-100 text-green-800 border-green-200',
            'Lumix': 'bg-purple-100 text-purple-800 border-purple-200'
        };
        return colors[brand as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // DIPERBAIKI: Hitung total items di cart - SAMA dengan Landing
    const cartItemCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Simple Header dengan Cart - DIPERBAIKI */}
            <div className="bg-slate-800 px-6 py-4 sticky top-0 z-40">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    {/* PERBAIKAN: Gunakan Link dari Inertia instead of window.location.href */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white hover:text-slate-300 transition-colors duration-200"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Kembali ke Beranda</span>
                    </Link>

                    {/* Cart Button - SAMA SEPERTI DI NAVBAR */}
                    <Link 
                        href="/keranjang" 
                        className="relative bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors duration-300 flex items-center space-x-2 font-medium"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Keranjang</span>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-6 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        {/* PERBAIKAN: Gunakan Link dari Inertia */}
                        <Link 
                            href="/"
                            className="hover:text-slate-800 transition-colors"
                        >
                            Beranda
                        </Link>
                        <span>/</span>
                        <span className="text-slate-800 font-medium">{product.product_name}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="sticky top-24">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shadow-lg relative">
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
                                    </div>
                                )}
                                
                                {!imageError ? (
                                    <img
                                        src={getImageUrl(product.product_image)}
                                        alt={product.product_name}
                                        className={`w-full h-full object-contain p-8 transition-opacity duration-300 ${
                                            imageLoaded ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        onLoad={() => {
                                            setImageLoaded(true);
                                            setImageError(false);
                                        }}
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-8">
                                        <Camera size={64} className="mb-4 opacity-50" />
                                        <p className="text-center font-medium">Gambar tidak tersedia</p>
                                        <p className="text-sm text-center mt-2 opacity-75">
                                            {product.product_name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Product Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getBrandColor(product.brand)}`}>
                                    {product.brand}
                                </span>
                                <span className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                                    {product.product_type === 'camera' ? <Camera size={14} /> : <Tag size={14} />}
                                    {product.product_type === 'camera' ? 'Kamera' : 'Lensa'}
                                </span>
                            </div>
                            
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
                                {product.product_name}
                            </h1>
                        </div>

                        {/* Product Description */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-slate-800">Deskripsi Produk</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {product.product_description}
                            </p>
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Clock size={20} />
                                Pilihan Durasi Sewa
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl bg-white border-2 border-slate-200 p-6 text-center shadow-sm">
                                    <div className="text-slate-600 font-medium mb-2">8 Jam</div>
                                    <div className="text-2xl font-bold text-slate-800">
                                        Rp {product.eight_hour_rent_price.toLocaleString('id-ID')}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1">per hari</div>
                                </div>
                                
                                <div className="rounded-xl bg-white border-2 border-slate-200 p-6 text-center shadow-sm">
                                    <div className="text-slate-600 font-medium mb-2">24 Jam</div>
                                    <div className="text-2xl font-bold text-slate-800">
                                        Rp {product.twenty_four_hour_rent_price.toLocaleString('id-ID')}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1">per hari</div>
                                </div>
                            </div>
                        </div>

                        {/* Duration Selection & Add to Cart */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800">Pilih Durasi</h3>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedDuration('8')}
                                    className={`flex-1 rounded-xl px-6 py-4 font-semibold transition-all duration-200 ${
                                        selectedDuration === '8' 
                                            ? 'bg-slate-800 text-white shadow-lg' 
                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                                >
                                    8 Jam - Rp {product.eight_hour_rent_price.toLocaleString('id-ID')}
                                </button>
                                <button
                                    onClick={() => setSelectedDuration('24')}
                                    className={`flex-1 rounded-xl px-6 py-4 font-semibold transition-all duration-200 ${
                                        selectedDuration === '24' 
                                            ? 'bg-slate-800 text-white shadow-lg' 
                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                                >
                                    24 Jam - Rp {product.twenty_four_hour_rent_price.toLocaleString('id-ID')}
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full rounded-xl bg-slate-800 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-slate-700 shadow-lg hover:shadow-xl"
                            >
                                Tambah ke Keranjang - {selectedDuration} Jam
                            </button>
                        </div>

                        {/* Quick Cart Access */}
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart size={20} className="text-slate-600" />
                                    <span className="font-medium text-slate-800">
                                        {cartItemCount > 0 ? `${cartItemCount} item dalam keranjang` : 'Keranjang kosong'}
                                    </span>
                                </div>
                                {cartItemCount > 0 && (
                                    <Link 
                                        href="/keranjang"
                                        className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 font-medium"
                                    >
                                        Lihat Keranjang
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Success Popup - SAMA dengan Landing */}
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

            {/* Conflict Popup - SAMA dengan Landing */}
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

            {/* Login Prompt Modal - SAMA dengan Landing */}
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
        </div>
    );
};

export default ProductDetail;