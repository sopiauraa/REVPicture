import ErrorBoundary from '@/components/error-boundary';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { useCart } from '../components/CartContext';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

// Tipe data paket
export type Product = {
    product_id: number;
    package_name: string;
    package_description: string;
    package_items: string;
    package_image: string;
    package_price: number;
};


export default function PaketPage() {
    // Ambil packageProducts dari Inertia, default ke array kosong
    const page = usePage();
    const packageProducts = (page.props as { packageProducts?: Product[] }).packageProducts ?? [];

    const [cart, setCart] = useState<Product[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState('');

    const handleAddToCart = (p: Product) => {
        setCart((prev) => [...prev, p]);
        setPopupMsg(`"${p.package_name}" berhasil ditambahkan ke keranjang!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f9f1e9]">
            <ErrorBoundary>
                <Navbar cart={cart} setShowCart={() => {}} />
            </ErrorBoundary>

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

            <main className="flex-1 bg-[#f9f1e9] py-6">
                <div className="container mx-auto px-4 pb-20">
                    {/* ← Back arrow + judul */}
                    <div className="mb-6 flex items-center text-[#413C36] transition-colors hover:text-[#7B7875]" onClick={() => history.back()}>
                        <i className="fas fa-chevron-left mr-2 text-lg" />
                        <h1 className="text-2xl leading-tight font-extrabold">Paket REV Picture</h1>
                    </div>

                    <ErrorBoundary>
                        {packageProducts.length === 0 ? (
                            <p className="text-center text-gray-500">Belum ada paket untuk ditampilkan.</p>
                        ) : (
                            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                                {packageProducts.map((p) => (
                                    <motion.div
                                        key={p.product_id}
                                        className="flex flex-col rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-xl"
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <img src={p.package_image} alt={p.package_name} className="mb-3 h-40 w-full rounded-lg object-cover" />
                                        <div className="mb-1 flex items-center gap-2 text-[#3a372f]">
                                            <i className="fas fa-box text-lg" />
                                            <span className="text-lg font-bold">{p.package_name}</span>
                                        </div>
                                        <div className="mb-2 text-sm text-[#4e473b]">{p.package_description}</div>
                                        <div className="mb-4 text-xs text-[#7a7267]">
                                            <strong>Isi Paket:</strong> {p.package_items}
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-base font-bold text-[#6d5d46]">Rp{p.package_price.toLocaleString('id-ID')}</span>
                                            <button className="rounded-lg bg-[#7f7a73] px-3 py-1 text-white hover:bg-[#3a372f]">Lihat Detail</button>
                                            <button
                                                onClick={() => handleAddToCart(p)}
                                                className="rounded-lg bg-[#7f7a73] px-3 py-1 text-white hover:bg-[#3a372f]"
                                            >
                                                + Keranjang
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
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
