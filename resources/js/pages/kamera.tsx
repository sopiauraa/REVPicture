import ErrorBoundary from '@/components/error-boundary';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

// Tipe data produk
export type Product = {
    product_id: number;
    product_name: string;
    product_description: string;
    brand: string;
    product_image: string;
    eight_hour_rent_price: number;
    twenty_four_hour_rent_price: number;
};

export default function KameraPage() {
    // Ambil cameraProducts dari Inertia, default ke array kosong
    const page = usePage();
    const cameraProducts = (page.props as { cameraProducts?: Product[] }).cameraProducts ?? [];

    // State keranjang dan popup
    const [cart, setCart] = useState<Product[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState('');

    const handleAddToCart = (p: Product) => {
        setCart((prev) => [...prev, p]);
        setPopupMsg(`\"${p.product_name}\" berhasil ditambahkan ke keranjang!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f9f1e9]">


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
                    {/* Back + judul */}
                    <div className="mb-6 flex items-center text-[#413C36] hover:text-[#7B7875] transition-colors" onClick={() => window.history.back()}>
                        <i className="fas fa-chevron-left mr-2 text-lg" />
                        <h1 className="text-2xl font-extrabold leading-tight">Daftar Kamera</h1>
                    </div>

                    <ErrorBoundary>
                        {cameraProducts.length === 0 ? (
                            <p className="text-center text-gray-500">Belum ada kamera untuk ditampilkan.</p>
                        ) : (
                            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                                {cameraProducts.map((p) => (
                                    <motion.div
                                        key={p.product_id}
                                        className="flex flex-col rounded-xl bg-white p-4 shadow-md"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img src={p.product_image} alt={p.product_name} className="mb-3 h-32 w-full object-contain" />
                                        <h2 className="text-center text-base font-bold text-[#3a372f]">{p.product_name}</h2>
                                        <p className="my-1 text-sm text-[#7b5e3b]">8 Jam: Rp {p.eight_hour_rent_price.toLocaleString('id-ID')}</p>
                                        <p className="my-1 text-sm text-[#7b5e3b]">
                                            24 Jam: Rp {p.twenty_four_hour_rent_price.toLocaleString('id-ID')}
                                        </p>
                                        <button
                                            onClick={() => handleAddToCart(p)}
                                            className="mt-auto rounded bg-black px-4 py-1 text-sm font-bold text-white transition hover:bg-[#444]"
                                        >
                                            + Keranjang
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </ErrorBoundary>
                </div>
            </main>


        </div>
    );
}
