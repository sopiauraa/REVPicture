import { TrashIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useCart } from '../components/CartContext';

const Keranjang = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const has24HourItem = selectedItems.some((i) => cart[i].name.includes('(24 Jam)'));
    const [rentalDays, setRentalDays] = useState<{ [key: number]: number }>(
        () => Object.fromEntries(cart.map((_, i) => [i, 1])), // default to 1 day
    );

    const handleSelect = (index: number) => {
        setSelectedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
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

        const selectedData = selectedItems.map((i) => ({
            ...cart[i],
            day_rent: rentalDays[i],
        }));
        localStorage.setItem('selectedItems', JSON.stringify(selectedData));
        localStorage.setItem('totalHarga', totalHarga.toString());

        router.visit('/formdatadiri');
    };

    const incrementRentalDay = (index: number) => {
        setRentalDays((prev) => ({ ...prev, [index]: prev[index] + 1 }));
    };

    const decrementRentalDay = (index: number) => {
        setRentalDays((prev) => ({
            ...prev,
            [index]: Math.max(1, prev[index] - 1),
        }));
    };

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">KERANJANG SAYA</h1>
            <div className="flex justify-end">
                <button onClick={() => router.visit('/')} className="rounded bg-red-900 px-6 py-2 font-semibold text-white hover:bg-red-600">
                    Tutup
                </button>
            </div>
            {cart.length === 0 ? (
                <p className="text-gray-500">Keranjang kosong</p>
            ) : (
                <>
                    <label className="mb-4 flex cursor-pointer items-center gap-2">
                        <input type="checkbox" checked={selectedItems.length === cart.length} onChange={handleSelectAll} />
                        <span className="font-medium">Pilih Semua</span>
                    </label>

                    <div className="space-y-6">
                        {cart.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-start justify-between rounded-xl border p-4 shadow-sm md:flex-row md:items-center"
                            >
                                <div className="flex w-full items-start gap-4 md:w-auto">
                                    <input
                                        type="radio"
                                        checked={selectedItems.includes(index)}
                                        onChange={() => handleSelect(index)}
                                        className="mt-2"
                                    />

                                    <img src={item.product.product_image} alt={item.name} className="h-24 w-28 rounded-md object-cover shadow" />

                                    <div>
                                        <p className="text-lg font-semibold">{item.name}</p>

                                        <div className="mt-2 flex items-center gap-2">
                                            <button onClick={() => handleDecrement(index)} className="rounded bg-gray-200 px-2 py-1">
                                                −
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleIncrement(index)} className="rounded bg-gray-200 px-2 py-1">
                                                +
                                            </button>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Total Harga: Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.product.product_id)}
                                    className="mt-2 flex items-center justify-center rounded border border-red-500 p-2 text-red-600 transition hover:bg-red-100"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {has24HourItem && (
                        <div className="fixed bottom-20 left-0 z-40 w-full border-t bg-white p-4 shadow">
                            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
                                <p className="font-medium text-gray-700">Durasi sewa untuk barang “(Hari)”: </p>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <button
                                        onClick={() => {
                                            const updated = { ...rentalDays };
                                            selectedItems.forEach((i) => {
                                                if (cart[i].name.includes('(24 Jam)')) {
                                                    updated[i] = Math.max(1, rentalDays[i] - 1);
                                                }
                                            });
                                            setRentalDays(updated);
                                        }}
                                        className="rounded bg-gray-200 px-3 py-1"
                                    >
                                        −
                                    </button>
                                    <span className="min-w-[24px] text-center">
                                        {
                                            // Display rentalDays from the first selected 24 Jam item
                                            selectedItems.filter((i) => cart[i].name.includes('(24 Jam)')).map((i) => rentalDays[i])[0]
                                        }
                                    </span>
                                    <button
                                        onClick={() => {
                                            const updated = { ...rentalDays };
                                            selectedItems.forEach((i) => {
                                                if (cart[i].name.includes('(24 Jam)')) {
                                                    updated[i] = rentalDays[i] + 1;
                                                }
                                            });
                                            setRentalDays(updated);
                                        }}
                                        className="rounded bg-gray-200 px-3 py-1"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Total dan tombol pilih */}
                    <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between rounded-t-xl bg-gray-900 p-4 text-white">
                        <p className="text-lg font-semibold">Total Harga: Rp {totalHarga.toLocaleString('id-ID')}</p>
                        <button onClick={handleCheckout} className="rounded bg-white px-6 py-2 font-semibold text-black hover:bg-gray-100">
                            Pilih
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Keranjang;
