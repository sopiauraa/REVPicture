import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import ErrorBoundary from '@/components/error-boundary';

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

const Landing = ({ cameraProducts, lensProducts }: Props) => {
    const [cart, setCart] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState('');

    const handleAddToCart = (name: string) => {
        setCart([...cart, name]);
        setPopupMsg(`${name} berhasil ditambahkan ke keranjang!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <motion.div
            className="flex w-[180px] min-w-[180px] flex-col items-center rounded-xl bg-white p-4 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <img
                src={product.product_image}
                className="mb-3 h-32 w-full object-contain"
            />
            <div className="text-center text-sm leading-tight font-bold text-[#3a372f]">{product.product_name}</div>
            <div className="my-1 text-sm text-[#7b5e3b]">8 Jam: Rp {product.eight_hour_rent_price.toLocaleString('id-ID')}</div>
            <div className="my-1 text-sm text-[#7b5e3b]">24 Jam: Rp {product.twenty_four_hour_rent_price.toLocaleString('id-ID')}</div>
            <button
                onClick={() => handleAddToCart(product.product_name)}
                className="rounded bg-black px-4 py-1 text-sm font-bold text-white transition hover:bg-[#444]"
            >
                + Keranjang
            </button>
        </motion.div>
    );

    const cameraDisplay = cameraProducts;
    const lensDisplay = lensProducts;

    const heroImages = [
        'https://storage.googleapis.com/a1aa/image/c829af28-b5f7-41c5-c6e2-33d18dfc9255.jpg',
        'https://storage.googleapis.com/a1aa/image/12d0fd21-cc11-49f1-a1cf-71220c4ea183.jpg',
        'https://storage.googleapis.com/a1aa/image/a1680f8f-99e7-402e-bc8e-62cfe2ecb79f.jpg',
    ];

    const sliderSettings = {
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,
        dots: true,
        arrows: true,
        slidesToShow: 1,
        responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
    };

    return (<ErrorBoundary>
        <div className="flex min-h-screen flex-col bg-[#f6eee1]">
            {/* Navbar */}
            <div className="bg-black pb-16">
                <Navbar />

                {/* Hero Slider */}
                <div className="mx-auto mt-6 w-full max-w-2xl px-4">
                    <Slider {...sliderSettings}>
                        {heroImages.map((src, i) => (
                            <motion.img
                                key={i}
                                src={src}
                                alt={`kamera ${i}`}
                                className="h-auto w-full rounded-md shadow-xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            />
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
        </div></ErrorBoundary>
    );
};
export default Landing;
