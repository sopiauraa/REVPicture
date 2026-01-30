// public/js/pages/brand.tsx
import ErrorBoundary from '@/components/error-boundary';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export type Product = {
    product_id: number;
    product_name: string;
    product_description: string;
    brand: string;
    product_image: string;
    eight_hour_rent_price: number;
    twenty_four_hour_rent_price: number;
};

type Props = {
    cameraProducts: Product[];
    lensProducts: Product[];
};

// Kartu produk dengan tombol + Keranjang
const ProductCard: React.FC<{
    product: Product;
    onAddToCart: (p: Product) => void;
}> = ({ product, onAddToCart }) => (
    <motion.div
        className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <img src={product.product_image} alt={product.product_name} className="mb-2 h-32 w-full object-contain" />
        <h3 className="text-center text-sm font-bold text-[#3a372f]">{product.product_name}</h3>
        <p className="mt-1 text-xs text-[#7b5e3b]">8 Jam: Rp {product.eight_hour_rent_price.toLocaleString('id-ID')}</p>
        <p className="text-xs text-[#7b5e3b]">24 Jam: Rp {product.twenty_four_hour_rent_price.toLocaleString('id-ID')}</p>
        <button
            onClick={() => onAddToCart(product)}
            className="mt-4 rounded bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
            + Keranjang
        </button>
    </motion.div>
);

export default function BrandPage({ cameraProducts = [], lensProducts = [] }: Props) {
    // filter jenis produk
    const [filter, setFilter] = useState<'all' | 'camera' | 'lens'>('all');
    const [cart, setCart] = useState<Product[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    // dropdown jenis
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // tutup dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // data produk (mock kalau kosong)
    const combined = [...cameraProducts, ...lensProducts];
    const allProducts = combined.length > 0 ? combined : [];

    // pilih sesuai filter jenis
    const byType = filter === 'all' ? allProducts : filter === 'camera' ? cameraProducts : lensProducts;

    // fungsi tambah ke keranjang
    const handleAddToCart = (p: Product) => {
        // TODO: implementasi sebenarnya (API call / context / redux)
        console.log('Tambah ke keranjang:', p);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f9f1e9]">
            <ErrorBoundary>

                <Navbar />

            </ErrorBoundary>

            <main className="w-full flex-1 bg-[#f9f1e9] py-6">
                <div className="container mx-auto px-4 pb-20">
                    {/* Header + dropdown jenis */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="mb-6 flex items-center text-[#413C36] hover:text-[#7B7875] transition-colors" onClick={() => history.back()}>
                            <i className="fas fa-chevron-left mr-2 text-lg" />
                            <h2 className="text-2xl font-extrabold leading-tight">{filter === 'all' ? 'Semua Produk' : filter === 'camera' ? 'Kamera' : 'Lensa'}</h2>
                        </div>

                        <div className="relative inline-block text-center" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen((v) => !v)}
                                className="inline-flex items-center rounded-md bg-[#7f7a73] px-4 py-2 text-white hover:bg-[#3a372f]"
                            >
                                {filter === 'all' ? 'Semua' : filter === 'camera' ? 'Kamera' : 'Lensa'}
                                <svg className="ml-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-30 rounded-md bg-[#7f7a73] shadow-lg">
                                    {['all', 'camera', 'lens'].map((type) => (
                                        <div
                                            key={type}
                                            className="cursor-pointer px-4 py-2 text-white hover:bg-[#6b675f]"
                                            onClick={() => {
                                                setFilter(type as any);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            {type === 'all' ? 'Semua' : type === 'camera' ? 'Kamera' : 'Lensa'}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Daftar produk */}
                    <ErrorBoundary>
                        {byType.length > 0 ? (
                            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                                {byType.map((product) => (
                                    <ProductCard key={product.product_id} product={product} onAddToCart={handleAddToCart} />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-10 text-center text-gray-500">Belum ada produk untuk pilihan ini.</p>
                        )}
                    </ErrorBoundary>
                </div>
            </main>

            <ErrorBoundary>
                <Footer />
            </ErrorBoundary>
        </div>
    );
}