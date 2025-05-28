import ErrorBoundary from '@/components/error-boundary';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
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

type Props = {
    cameraProducts: Product[];
    lensProducts: Product[];
};

// Mock data while real data is not available
const mockProducts: Product[] = Array(12)
    .fill(null)
    .map((_, i) => ({
        product_id: i,
        product_name: `Contoh Produk ${i + 1}`,
        product_description: 'Deskripsi produk contoh',
        brand: 'Sony',
        product_image: '/images/placeholder.png',
        eight_hour_rent_price: 100000 + i * 5000,
        twenty_four_hour_rent_price: 200000 + i * 10000,
    }));

// Card for each product
const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
        className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <img src={product.product_image} alt={product.product_name} className="mb-2 h-32 w-full object-contain" />
        <h3 className="text-center text-sm font-bold text-[#3a372f]">{product.product_name}</h3>
        <p className="mt-1 text-xs text-[#7b5e3b]">8 Jam: Rp {product.eight_hour_rent_price.toLocaleString('id-ID')}</p>
        <p className="text-xs text-[#7b5e3b]">24 Jam: Rp {product.twenty_four_hour_rent_price.toLocaleString('id-ID')}</p>
    </motion.div>
);

export default function SonyProductsPage({ cameraProducts = [], lensProducts = [] }: Props) {
    // State filter: 'all', 'camera', atau 'lens'
    const [filter, setFilter] = useState<'all' | 'camera' | 'lens'>('all');

    // State untuk kontrol dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // close dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Combine and fallback to mock
    const combined = [...cameraProducts, ...lensProducts];
    const allProducts = combined.length > 0 ? combined : mockProducts;

    // Pilih produk berdasarkan filter
    const products =
        filter === 'camera'
            ? cameraProducts.length > 0
                ? cameraProducts
                : []
            : filter === 'lens'
              ? lensProducts.length > 0
                  ? lensProducts
                  : []
              : allProducts;

    // Slider settings for horizontal scrolling
    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };
    return (
        <div className="flex min-h-screen flex-col bg-[#f9f1e9]">
            {/* MAIN CONTENT */}
            <ErrorBoundary>
                <Navbar cart={[]} setShowCart={() => {}} />
            </ErrorBoundary>
            <main className="w-full flex-1 bg-[#f9f1e9] py-6">
                <div className="container mx-auto px-4 pb-20">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex cursor-pointer items-center space-x-2 text-sm text-[#3f3a35] select-none" onClick={() => history.back()}>
                            <i className="fas fa-arrow-left" />
                            <h2 className="text-base font-bold">Sony</h2>
                        </div>

                        {/* Filter dropdown*/}
                        <div className="relative inline-block text-right" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen((v) => !v)}
                                className="inline-flex items-center rounded-md bg-[#7f7a73] px-4 py-2 text-white hover:bg-[#3a372f] focus:outline-none"
                            >
                                {filter === 'all' ? 'Semua' : filter === 'camera' ? 'Kamera' : 'Lensa'}
                                <svg
                                    className="ml-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="ring-opacity-5 absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-[#7f7a73] shadow-lg ring-1 ring-black">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setFilter('all');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3a372f]"
                                        >
                                            Semua
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilter('camera');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3a372f]"
                                        >
                                            Kamera
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilter('lens');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3a372f]"
                                        >
                                            Lensa
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <ErrorBoundary>
                        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                            {products.map((product) => (
                                <ProductCard key={product.product_id} product={product} />
                            ))}
                        </div>
                    </ErrorBoundary>
                </div>
            </main>

            {/* FOOTER */}
            <ErrorBoundary>
                <Footer />
            </ErrorBoundary>
        </div>
    );
}
