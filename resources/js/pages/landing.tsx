import ErrorBoundary from '@/components/error-boundary';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { useCart } from '../components/CartContext';  
import type { Product } from '../components/CartContext';


type Props = {
  cameraProducts: Product[];
  lensProducts: Product[];
};

const Landing = ({ cameraProducts, lensProducts }: Props) => {
    const { cart, addToCart } = useCart(); // ambil dari context
    const [showCart, setShowCart] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState('');

      const handleAddToCart = (product: Product) => {
        addToCart({
          product,
          name: product.product_name,
          price: product.eight_hour_rent_price,
          quantity: 1,
        });
        setPopupMsg(`${product.product_name} berhasil ditambahkan ke keranjang!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      };

  const ProductCard = ({ product }: { product: Product }) => {
  const [selectedDuration, setSelectedDuration] = useState<'8' | '24'>('8');

  const handleAddToCartWithDuration = () => {
    const selectedPrice =
      selectedDuration === '8'
        ? product.eight_hour_rent_price
        : product.twenty_four_hour_rent_price;

    const itemName = `${product.product_name} (${selectedDuration} Jam)`;

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

    return (
      <motion.div
        className="flex w-[180px] min-w-[180px] flex-col items-center rounded-xl bg-white p-4 shadow-md"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.01 }}
      >
        <img
          src={product.product_image}
          className="mb-3 h-32 w-full object-contain"
        />
        <div className="text-center text-sm leading-tight font-bold text-[#3a372f]">
          {product.product_name}
        </div>
        <div className="my-1 text-sm text-[#7b5e3b]">
          8 Jam: Rp {product.eight_hour_rent_price.toLocaleString("id-ID")}
        </div>
        <div className="my-1 text-sm text-[#7b5e3b]">
          24 Jam: Rp {product.twenty_four_hour_rent_price.toLocaleString("id-ID")}
        </div>

        <div className="mt-2 mb-2 flex gap-2">
          <button
            onClick={() => setSelectedDuration('8')}
            className={`px-2 py-1 text-xs rounded border ${
              selectedDuration === '8' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            8 Jam
          </button>
          <button
            onClick={() => setSelectedDuration('24')}
            className={`px-2 py-1 text-xs rounded border ${
              selectedDuration === '24' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            24 Jam
          </button>
        </div>

        <button
          onClick={handleAddToCartWithDuration}
          className="rounded bg-black px-4 py-1 text-sm font-bold text-white transition hover:bg-[#444]"
        >
          + Keranjang
        </button>
      </motion.div>
    );
  };


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
                    <div className="scrollbar-hide flex justify-center gap-4 overflow-x-auto pb-4">
                        {cameraDisplay.map((item, i) => (
                            <ProductCard key={i} product={item} />
                        ))}
                    </div>
                </section>

                {/* Produk Lensa */}
                <section className="mt-6 mb-10 px-6">
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
            </div>
        </ErrorBoundary>
    );
};

export default Landing;
