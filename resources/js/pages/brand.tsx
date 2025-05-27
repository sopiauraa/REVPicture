import ErrorBoundary from '@/components/error-boundary';
import { motion } from 'framer-motion';
import { useState } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Footer from '../components/footer';

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

// Nav item with color toggle
function NavItem({ label, href }: { label: string; href: string }) {
    const [active, setActive] = useState(false);
    const activeColor = '#9a9996';
    const idleColor = '#7f7a73';

    return (
        <motion.a
            href={href}
            onClick={() => setActive(!active)}
            animate={{ backgroundColor: active ? activeColor : idleColor }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="rounded-md px-4 py-2 text-center text-sm font-bold whitespace-nowrap text-white"
        >
            {label}
        </motion.a>
    );
}

export default function SonyProductsPage({ cameraProducts = [], lensProducts = [] }: Props) {
    // Combine and fallback to mock
    const combined = [...cameraProducts, ...lensProducts];
    const products = combined.length > 0 ? combined : mockProducts;

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
            {/* Header */}
            <header className="w-full bg-[#3f3a35] text-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-2 md:flex-row md:py-4">
                    <img
                        src="/images/revv.png" /* Ganti path dengan lokasi file logomu */
                        alt="REV Picture Logo"
                        className="mb-2 h-8 w-auto md:mb-0 md:h-10 lg:h-12" /* Atur tinggi sesuai kebutuhan */
                    />
                    <form className="relative mb-2 flex w-full items-center md:mb-0 md:w-auto">
                        <input
                            type="text"
                            placeholder="Cari"
                            className="w-full rounded-full border border-gray-200 bg-white px-4 py-1 pr-10 text-sm text-[#3f3a35] placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none md:w-80 lg:w-96"
                        />
                        <button type="submit" className="absolute top-1/2 right-4 -translate-y-1/2 transform text-[#3f3a35] hover:text-[#1f1d1a]">
                            <i className="fas fa-search" />
                        </button>
                    </form>
                    <nav className="flex space-x-4 text-xs md:space-x-6 md:text-sm">
                        <a href="#" className="flex items-center space-x-1 hover:underline">
                            <i className="fas fa-home" /> <span>BERANDA</span>
                        </a>
                        <a href="#" className="flex items-center space-x-1 hover:underline">
                            <i className="fas fa-user" /> <span>AKUN</span>
                        </a>
                        <a href="#" className="flex items-center space-x-1 hover:underline">
                            <i className="fas fa-shopping-cart" /> <span>KERANJANG</span>
                        </a>
                    </nav>
                </div>
                {/* NAV BAWAH */}
                <div className="w-full bg-[#7f7a73]">
                    <div className="mx-auto max-w-7xl px-4 py-3">
                        <nav className="flex flex-wrap items-center justify-evenly gap-4 md:gap-8 lg:gap-12">
                            <NavItem label="Brand" href="/" />
                            <NavItem label="Kamera" href="/kamera" />
                            <NavItem label="Lensa" href="/lensa" />
                            <NavItem label="Paket Rev Picture" href="/paket" />
                            <NavItem label="Penting Dibaca" href="/penting" />
                        </nav>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-12">
                <ErrorBoundary>
                    <div className="mb-6 flex cursor-pointer items-center space-x-2 text-sm text-[#3f3a35] select-none">
                        <i className="fas fa-arrow-left" />
                        <h2 className="text-base font-bold">Sony</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.product_id} product={product} />
                        ))}
                    </div>
                </ErrorBoundary>
            </main>

            {/* FOOTER */}
            <ErrorBoundary>
                <Footer />
            </ErrorBoundary>
        </div>
    );
}
