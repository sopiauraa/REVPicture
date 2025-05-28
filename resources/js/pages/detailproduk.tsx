import React, { useState } from 'react';
import Navbar from '../components/navbar';

const StarRating = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex mt-3 text-yellow-400 text-2xl cursor-pointer select-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setRating(star);
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const DetailProduk = () => {
  const [duration, setDuration] = useState('8 Jam');
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') setQuantity(quantity + 1);
    else if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="min-h-screen bg-[#faf3eb] font-sans">
      <Navbar cart={[]} setShowCart={() => {}} />
      <div className="px-4 py-8">
        <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">SONY A7 MARK III</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8 items-center md:items-start md:justify-center max-w-6xl mx-auto">
          <div className="border-4 border-blue-500 rounded-lg overflow-hidden">
            <img src="/kamera.png" alt="Sony A7 Mark III" className="w-64 h-auto object-cover" />
          </div>

          <div className="flex flex-col gap-3 text-center md:text-left w-full max-w-md">
            <p>Sewa 8 jam: <strong>Rp 200.000</strong></p>
            <p>Sewa 1 Hari: <strong>Rp 250.000</strong></p>
            <p>Termasuk: Battery 2 + Charger 1 + Tas</p>

            <div className="flex gap-3 mt-4 justify-center md:justify-start">
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium ${duration === '8 Jam' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setDuration('8 Jam')}
              >
                8 Jam
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium ${duration === '24 Jam' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setDuration('24 Jam')}
              >
                24 Jam
              </button>
            </div>

            <div className="flex items-center mt-5">
              <button onClick={() => handleQuantityChange('decrease')} className="px-4 py-2 bg-gray-200 rounded-l-md font-bold">-</button>
              <div className="px-5 py-2 border-t border-b text-lg font-semibold">{quantity}</div>
              <button onClick={() => handleQuantityChange('increase')} className="px-4 py-2 bg-gray-200 rounded-r-md font-bold">+</button>
              <button className="ml-5 bg-gray-800 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition-all duration-200">
                Masukkan Keranjang
              </button>
            </div>

            <StarRating />

            <a href="/syarat-ketentuan" className="mt-2 text-xs text-red-500 hover:underline text-right block w-full">*S&K Berlaku</a>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center md:text-left">PRODUK LAIN DENGAN MERK YANG SAMA</h2>

          <div className="flex gap-6 overflow-x-auto pb-3 px-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-[220px] bg-white shadow-md rounded-xl overflow-hidden p-3 shrink-0">
                <img
                  src="/kamera.png"
                  alt="Sony PWX-Z150"
                  className="w-full h-[130px] object-cover rounded-md"
                />
                <div className="mt-3 text-center">
                  <h3 className="text-sm font-semibold">Sony PWX-Z150</h3>
                  <p className="text-sm text-gray-600 mt-1">8 Jam: Rp 500.000</p>
                  <p className="text-sm text-gray-600">24 Jam: Rp 1.000.000</p>
                  <button className="mt-2 bg-black text-white text-sm font-semibold px-3 py-1 rounded hover:bg-gray-800">
                    + Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;