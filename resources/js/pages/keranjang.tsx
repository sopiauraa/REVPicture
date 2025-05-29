import { useCart } from '../components/CartContext';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';


const Keranjang = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSelect = (index: number) => {
    setSelectedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((_, i) => i));
    }
  };

 const handleIncrement = (index: number) => {
    increaseQuantity(cart[index].product.product_id);
  };

  const handleDecrement = (index: number) => {
    decreaseQuantity(cart[index].product.product_id);
  };

  const totalHarga = selectedItems.reduce((acc, i) => {
    return acc + cart[i].price * cart[i].quantity;
  }, 0);

    const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Pilih minimal satu barang ya bro');
      return;
    }

    const selectedData = selectedItems.map(i => cart[i]);

    localStorage.setItem('selectedItems', JSON.stringify(selectedData));
    localStorage.setItem('totalHarga', totalHarga.toString());

    router.visit('/formdatadiri');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">KERANJANG SAYA</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Keranjang kosong</p>
      ) : (
        <>
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.length === cart.length}
              onChange={handleSelectAll}
            />
            <span className="font-medium">Pilih Semua</span>
          </label>

          <div className="space-y-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center justify-between border rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-4 w-full md:w-auto">
                  <input
                    type="radio"
                    checked={selectedItems.includes(index)}
                    onChange={() => handleSelect(index)}
                    className="mt-2"
                  />

                  <img
                    src={item.product.product_image}
                    alt={item.name}
                    className="w-28 h-24 object-cover rounded-md shadow"
                  />

                  <div>
                    <p className="font-semibold text-lg">{item.name}</p>
                    <div className="flex items-center mt-2 gap-2">
                      <button
                        onClick={() => handleDecrement(index)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleIncrement(index)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Total Harga: Rp{' '}
                        {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                  </div>
                </div>
                  <button
                    onClick={() => removeFromCart(item.product.product_id)}
                    className="mt-2 p-2 border border-red-500 text-red-600 rounded hover:bg-red-100 transition flex items-center justify-center"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
              </div>
            ))}
          </div>

          {/* Total dan tombol pilih */}
          <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white rounded-t-xl p-4 flex justify-between items-center z-50">
            <p className="text-lg font-semibold">
                Total Harga: Rp {totalHarga.toLocaleString('id-ID')}
            </p>
           <button 
            onClick={handleCheckout}
            className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-100"
          >
            Pilih
          </button>
        </div>
        </>
      )}
    </div>
  );

};

export default Keranjang;
