import { TrashIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useCart } from '../components/CartContext';

const Keranjang = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = useState(false);
    
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

    const handleDeleteClick = (index: number) => {
        setItemToDelete(index);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (itemToDelete !== null) {
            console.log('Menghapus item:', cart[itemToDelete].product.product_id);
            removeFromCart(cart[itemToDelete].product.product_id);
            
            // Remove from selected items if it was selected
            setSelectedItems(prev => prev.filter(i => i !== itemToDelete));
            
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
    };

    const handleDeleteSelectedClick = () => {
        if (selectedItems.length === 0) {
            alert('Pilih minimal satu barang untuk dihapus');
            return;
        }
        setShowDeleteSelectedConfirm(true);
    };

    const confirmDeleteSelected = () => {
        // Sort in descending order to avoid index shifting issues
        const sortedSelectedItems = [...selectedItems].sort((a, b) => b - a);
        
        sortedSelectedItems.forEach(index => {
            console.log('Menghapus item:', cart[index].product.product_id);
            removeFromCart(cart[index].product.product_id);
        });
        
        setSelectedItems([]);
        setShowDeleteSelectedConfirm(false);
    };

    const cancelDeleteSelected = () => {
        setShowDeleteSelectedConfirm(false);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Pilih minimal satu barang ya bro');
            return;
        }

        const selectedData = selectedItems.map((i) => ({
            product: cart[i].product, // Save the full product object
            product_id: cart[i].product.product_id,
            product_image: cart[i].product.product_image,
            name: cart[i].name,
            price: cart[i].price,
            quantity: cart[i].quantity,
            day_rent: rentalDays[i],
            duration: cart[i].name.includes('8 Jam') ? 'eight_hour' : 'twenty_four_hour',
        }));

        const totalHarga = selectedItems.reduce((acc, i) => acc + cart[i].price * cart[i].quantity * rentalDays[i], 0);

        localStorage.setItem('checkoutItems', JSON.stringify(selectedData));
        localStorage.setItem('checkoutTotal', totalHarga.toString());

        router.visit('/formdatadiri');
    };
    
    const handleIncrement = (index: number) => {
        increaseQuantity(cart[index].product.product_id);
    };

    const handleDecrement = (index: number) => {
        decreaseQuantity(cart[index].product.product_id);
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

    const totalHarga = selectedItems.reduce((acc, i) => acc + cart[i].price * cart[i].quantity * rentalDays[i], 0);
    
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header - Responsive */}
            <div className="bg-slate-900 px-4 py-6 shadow-sm sm:px-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Tombol Kembali dengan style yang lebih bagus */}
                    <button 
                        onClick={() => router.visit('/')} 
                        className="order-1 flex items-center gap-2 self-start rounded-xl bg-slate-700/80 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-slate-600/80 active:scale-95 sm:order-none sm:px-5 sm:py-3 sm:text-base"
                    >
                        <svg 
                            className="h-4 w-4 sm:h-5 sm:w-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                            />
                        </svg>
                        Kembali
                    </button>
                    
                    {/* Title */}
                    <h1 className="order-2 text-2xl font-bold text-white sm:order-none sm:text-3xl lg:text-center lg:flex-1">
                        KERANJANG SAYA
                    </h1>
                </div>
            </div>

            <div className="px-4 pb-32 pt-6 sm:px-6">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="mb-4 text-4xl text-slate-300 sm:text-6xl">🛒</div>
                        <p className="text-lg text-slate-500 sm:text-xl">Keranjang Anda masih kosong</p>
                        <p className="mt-2 text-sm text-slate-400 sm:text-base">Silakan tambahkan produk untuk memulai</p>
                    </div>
                ) : (
                    <>
                        {/* Select All & Delete Selected - Responsive */}
                        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedItems.length === cart.length} 
                                        onChange={handleSelectAll}
                                        className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                    />
                                    <span className="text-base font-semibold text-slate-900 sm:text-lg">
                                        Pilih Semua ({cart.length} item)
                                    </span>
                                </label>
                                
                                {selectedItems.length > 0 && (
                                    <button
                                        onClick={handleDeleteSelectedClick}
                                        className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:px-4"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        <span className="hidden sm:inline">Hapus Terpilih</span>
                                        <span className="sm:hidden">Hapus</span>
                                        ({selectedItems.length})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Cart Items - Responsive */}
                        <div className="space-y-4">
                            {cart.map((item, index) => (
                                <div
                                    key={index}
                                    className={`rounded-xl border-2 bg-white p-4 shadow-sm transition-all sm:p-6 ${
                                        selectedItems.includes(index) 
                                            ? 'border-slate-900 bg-slate-50' 
                                            : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* Mobile Layout */}
                                        <div className="flex items-start gap-3 sm:hidden">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(index)}
                                                onChange={() => handleSelect(index)}
                                                className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                            />

                                            <img 
                                                src={item.product.product_image} 
                                                alt={item.name} 
                                                className="h-20 w-20 rounded-lg object-cover shadow-md" 
                                            />

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold text-slate-900 leading-tight">{item.name}</h3>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    Rp {item.price.toLocaleString('id-ID')} / unit
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteClick(index)}
                                                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-red-300 bg-white text-red-600 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
                                                title="Hapus dari keranjang"
                                                type="button"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Desktop Layout */}
                                        <div className="hidden sm:flex sm:items-center sm:justify-between">
                                            <div className="flex items-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(index)}
                                                    onChange={() => handleSelect(index)}
                                                    className="mt-2 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                                />

                                                <img 
                                                    src={item.product.product_image} 
                                                    alt={item.name} 
                                                    className="h-24 w-28 rounded-lg object-cover shadow-md" 
                                                />

                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                                                    <p className="mt-1 text-slate-600">
                                                        Rp {item.price.toLocaleString('id-ID')} / unit
                                                    </p>
                                                    
                                                    <div className="mt-3 rounded-lg bg-slate-100 p-3">
                                                        <p className="text-sm font-medium text-slate-700">
                                                            Subtotal: <span className="text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteClick(index)}
                                                className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-red-300 bg-white text-red-600 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
                                                title="Hapus dari keranjang"
                                                type="button"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Quantity Controls - Responsive */}
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-slate-700">Jumlah:</span>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleDecrement(index)} 
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="min-w-[40px] text-center font-semibold text-slate-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleIncrement(index)} 
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Subtotal for mobile */}
                                            <div className="rounded-lg bg-slate-100 p-3 sm:hidden">
                                                <p className="text-sm font-medium text-slate-700">
                                                    Subtotal: <span className="text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Rental Duration Selector - Responsive */}
                        {has24HourItem && (
                            <div className="fixed bottom-20 left-0 z-40 w-full border-t-2 border-slate-200 bg-white p-4 shadow-lg">
                                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm font-semibold text-slate-900 sm:text-base">Durasi sewa untuk barang "(Hari)":</p>
                                    <div className="flex items-center gap-3">
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
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300"
                                        >
                                            −
                                        </button>
                                        <span className="min-w-[40px] text-center text-lg font-semibold text-slate-900">
                                            {selectedItems.filter((i) => cart[i].name.includes('(24 Jam)')).map((i) => rentalDays[i])[0]}
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
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Total dan tombol checkout - Responsive */}
                        <div className="fixed bottom-0 left-0 z-50 w-full border-t-2 border-slate-200 bg-slate-900 p-4 shadow-lg">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-center sm:text-left">
                                    <p className="text-xs text-slate-300 sm:text-sm">Total Pembayaran</p>
                                    <p className="text-lg font-bold text-white sm:text-xl">
                                        Rp {totalHarga.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <button 
                                    onClick={handleCheckout} 
                                    className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto sm:px-8 sm:text-base"
                                    disabled={selectedItems.length === 0}
                                >
                                    <span className="hidden sm:inline">Lanjut Checkout</span>
                                    <span className="sm:hidden">Checkout</span>
                                    ({selectedItems.length})
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal - Responsive */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg animate-in fade-in-0 zoom-in-95 duration-200">
                        <div className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8">
                            {/* Icon */}
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 sm:mb-6 sm:h-16 sm:w-16">
                                <TrashIcon className="h-6 w-6 text-red-600 sm:h-8 sm:w-8" />
                            </div>
                            
                            {/* Content */}
                            <div className="text-center">
                                <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">Hapus Item dari Keranjang</h3>
                                <p className="mb-6 text-sm text-slate-600 leading-relaxed sm:mb-8 sm:text-base">
                                    Apakah Anda yakin ingin menghapus <span className="font-semibold text-slate-900">"{itemToDelete !== null ? cart[itemToDelete].name : ''}"</span> dari keranjang belanja Anda?
                                </p>
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-slate-100 sm:px-6 sm:text-base"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-red-700 hover:to-red-800 hover:shadow-xl focus:ring-4 focus:ring-red-200 transform hover:scale-105 sm:px-6 sm:text-base"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Selected Confirmation Modal - Responsive */}
            {showDeleteSelectedConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg animate-in fade-in-0 zoom-in-95 duration-200">
                        <div className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8">
                            {/* Icon */}
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 sm:mb-6 sm:h-16 sm:w-16">
                                <TrashIcon className="h-6 w-6 text-red-600 sm:h-8 sm:w-8" />
                            </div>
                            
                            {/* Content */}
                            <div className="text-center">
                                <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">Hapus Item Terpilih</h3>
                                <p className="mb-6 text-sm text-slate-600 leading-relaxed sm:mb-8 sm:text-base">
                                    Apakah Anda yakin ingin menghapus <span className="font-semibold text-slate-900">{selectedItems.length} item</span> yang dipilih dari keranjang belanja Anda?
                                </p>
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                <button
                                    onClick={cancelDeleteSelected}
                                    className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-slate-100 sm:px-6 sm:text-base"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDeleteSelected}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-red-700 hover:to-red-800 hover:shadow-xl focus:ring-4 focus:ring-red-200 transform hover:scale-105 sm:px-6 sm:text-base"
                                >
                                    Ya, Hapus Semua
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Keranjang;