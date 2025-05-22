import { useState } from 'react';
import Slider from 'react-slick';
import { motion, AnimatePresence } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Landing = () => {
  const [cart, setCart] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');

  const handleAddToCart = (name: string) => {
    setCart([...cart, name]);
    setPopupMsg(`${name} berhasil ditambahkan ke keranjang!`);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const ProductCard = ({
    imgSrc,
    alt,
    name,
    price,
  }: {
    imgSrc: string;
    alt: string;
    name: string;
    price: number;
  }) => (
    <motion.div
      className="bg-white rounded-xl shadow-md w-[180px] min-w-[180px] p-4 flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={imgSrc || 'https://via.placeholder.com/150'}
        alt={alt}
        className="w-full h-32 object-contain mb-3"
      />
      <div className="text-[#3a372f] text-sm font-bold text-center leading-tight">
        {name}
      </div>
      <div className="text-[#7b5e3b] text-sm my-1">
        Rp {price.toLocaleString('id-ID')}
      </div>
      <button
        onClick={() => handleAddToCart(name)}
        className="bg-black text-white text-sm font-bold py-1 px-4 rounded hover:bg-[#444] transition"
      >
        + Keranjang
      </button>
    </motion.div>
  );

  const cameraProducts = [
    {
      imgSrc: 'https://storage.googleapis.com/a1aa/image/76626525-dd1a-4578-c804-d38d66ffb9c6.jpg',
      alt: 'Sony A7 Mark III',
      name: 'SONY A7 MARK III',
      price: 250000,
    },
    {
      imgSrc: 'https://storage.googleapis.com/a1aa/image/c829af28-b5f7-41c5-c6e2-33d18dfc9255.jpg',
      alt: 'Canon EOS M50',
      name: 'CANON EOS M50',
      price: 200000,
    },
  ];
  const cameraDisplay = [...cameraProducts, ...cameraProducts, ...cameraProducts].slice(0, 6);

  const lensProducts = [
    {
      imgSrc: 'https://storage.googleapis.com/a1aa/image/74c7a020-fb9f-4cf4-98ef-6cd5fa4ba4f3.jpg',
      alt: 'Sony 24-70 GM F2.8',
      name: 'Sony 24-70 GM F2.8',
      price: 150000,
    },
  ];
  const lensDisplay = Array(6).fill(lensProducts[0]);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eee1]">
      {/* Navbar */}
      <div className="bg-black pb-16">
        <Navbar />

        {/* Hero Slider */}
        <div className="max-w-2xl mx-auto mt-6 px-4 w-full">
          <Slider {...sliderSettings}>
            {heroImages.map((src, i) => (
              <motion.img
                key={i}
                src={src}
                alt={`kamera ${i}`}
                className="w-full h-auto rounded-md shadow-xl"
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
        <div className="justify-center flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {cameraDisplay.map((item, i) => (
            <ProductCard key={i} {...item} />
          ))}
        </div>
      </section>

      {/* Produk Lensa */}
      <section className="mt-6 px-6 mb-10">
        {/* <h3 className="text-[#3a372f] font-bold text-xl mb-3">Lensa</h3> */}
        <div className="justify-center flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {lensDisplay.map((item, i) => (
            <ProductCard key={i} {...item} />
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
            className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50"
          >
            ✅ {popupMsg}
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
   
  );
};
export default Landing;

