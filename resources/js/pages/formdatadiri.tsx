import { ArrowLeftIcon, AtSymbolIcon, CalendarIcon, MapPinIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import React from 'react';

type Product = {
    product_id: number;
    product_image: string;
};

type Item = {
    name: string;
    quantity: number;
    price: number;
    product?: Product;
    day_rent?: number;
    duration?: string;
};

const FormDataDiri = () => {
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [totalHarga, setTotalHarga] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    useEffect(() => {
        const itemsFromStorage = localStorage.getItem('checkoutItems');
        const totalFromStorage = localStorage.getItem('checkoutTotal');
        const rentalDateFromStorage = localStorage.getItem('checkoutRentalDate');
        setFormData((prev) => ({
            ...prev,
            tanggalSewa: rentalDateFromStorage || '',
        }));
        if (itemsFromStorage) {
            setSelectedItems(JSON.parse(itemsFromStorage));
        }
        if (totalFromStorage) {
            setTotalHarga(parseInt(totalFromStorage));
        }
    }, []);

    const { customer_name, phone_number, address, social_media } = usePage().props;

    const [formData, setFormData] = useState({
        nama: typeof customer_name === 'string' ? customer_name : '',
        alamat: typeof address === 'string' ? address : '',
        noHp: typeof phone_number === 'string' ? phone_number : '',
        sosialMedia: typeof social_media === 'string' ? social_media : '',
        tanggalSewa: '',
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            nama: typeof customer_name === 'string' ? customer_name : '',
            alamat: typeof address === 'string' ? address : '',
            noHp: typeof phone_number === 'string' ? phone_number : '',
            sosialMedia: typeof social_media === 'string' ? social_media : '',
        }));
    }, [customer_name, phone_number, address, social_media]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Clear cart in localStorage and in context (if available)
    const clearCart = () => {
        localStorage.removeItem('cart'); // if you store cart in localStorage
        localStorage.removeItem('checkoutItems');
        localStorage.removeItem('checkoutTotal');
        localStorage.removeItem('checkoutRentalDate');
        // If you use a cart context, you can also call its clear method here
        if (window.dispatchEvent) {
            window.dispatchEvent(new Event('cart:clear'));
        }
    };

    const handleOrderSuccess = () => {
        // Set a flag in sessionStorage to show order success popup on landing
        sessionStorage.setItem('orderSuccess', '1');
        router.visit('/', { replace: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting!'); // Add this line

        // Map items to ensure product_id and day_rent are present at the top level
        const items = selectedItems.map((item) => ({
            product_id: item.product?.product_id ?? item.product,
            day_rent: item.day_rent ?? 1,
            duration: item.duration ?? (item.name?.includes('8 Jam') ? 'eight_hour' : 'twenty_four_hour'),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));

        const payload = {
            name: formData.nama || '',
            phone: formData.noHp || '',
            address: formData.alamat || '',
            social_media: formData.sosialMedia || '',
            tanggalSewa: formData.tanggalSewa || '',
            items,
            total: totalHarga,
        };

        router.post('/checkout', payload, {
            onSuccess: () => {
                clearCart();
                handleOrderSuccess();
            },
        });
    };

    const handleKirimWA = () => {
        const message = `Halo, saya ${formData.nama} ingin menyewa pada tanggal ${formData.tanggalSewa}
No HP: ${formData.noHp}
Alamat: ${formData.alamat}
Sosial Media: ${formData.sosialMedia}

Barang yang dipilih:
${selectedItems
    .map((item, i) => {
        const prefix = `${i + 1}. `;
        const spacing = ' '.repeat(prefix.length);
        const total = (item.price ?? 0) * (item.quantity ?? 0) * (item.day_rent ?? 1);
        return `${prefix}${item.name}
${spacing}Jumlah: ${item.quantity}
${spacing}Durasi: ${item.day_rent} hari
${spacing}Total: Rp ${total.toLocaleString('id-ID')}`;
    })
    .join('\n')}


Total Harga: Rp ${totalHarga.toLocaleString('id-ID')}

Terima kasih!`;

        const waUrl = `https://wa.me/+6282160502890?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
        clearCart();
    };

    const handleConfirmClick = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const confirmSendWA = () => {
        setShowConfirmModal(false);
        handleKirimWA();
    };

    const cancelSendWA = () => {
        setShowConfirmModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-slate-900 px-4 py-6 shadow-lg sm:px-6 sm:py-8">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.visit('/keranjang')}
                            className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-600 sm:text-base"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Kembali
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl">Data Diri Penyewa</h1>
                            <p className="mt-1 text-sm text-slate-300 sm:text-base">Lengkapi informasi untuk melanjutkan pemesanan</p>
                        </div>
                        <div className="w-[88px] sm:w-[96px]"></div> {/* Spacer untuk balance */}
                    </div>
                    {/* Pilih Customer Lama */}
                    <button
                        onClick={() => router.visit('/customers')}
                        type="button"
                        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white shadow transition-colors hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        Pilih Data Customer Sebelumnya
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-6 pb-40 sm:px-6 sm:py-8 sm:pb-44">
                <form onSubmit={handleConfirmClick} className="space-y-6 sm:space-y-8">
                    {/* Form Data Diri */}
                    <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
                        <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-slate-900 sm:text-xl">
                            <UserIcon className="h-5 w-5 text-slate-600 sm:h-6 sm:w-6" />
                            Informasi Pribadi
                        </h2>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Kolom Kiri */}
                            <div className="space-y-6">
                                {/* Nama */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        <UserIcon className="mr-2 inline h-4 w-4" />
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        name="nama"
                                        value={formData.nama}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama lengkap Anda"
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:ring-4 focus:ring-slate-100 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* No HP & Tanggal */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            <PhoneIcon className="mr-2 inline h-4 w-4" />
                                            No. WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            name="noHp"
                                            value={formData.noHp}
                                            onChange={handleChange}
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:ring-4 focus:ring-slate-100 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            <CalendarIcon className="mr-2 inline h-4 w-4" />
                                            Tanggal Sewa
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggalSewa"
                                            value={formData.tanggalSewa}
                                            min={today}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-slate-900 focus:ring-4 focus:ring-slate-100 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Kolom Kanan */}
                            <div className="space-y-6">
                                {/* Alamat */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        <MapPinIcon className="mr-2 inline h-4 w-4" />
                                        Alamat Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={handleChange}
                                        placeholder="Masukkan alamat lengkap untuk pengiriman"
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:ring-4 focus:ring-slate-100 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* Sosial Media */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        <AtSymbolIcon className="mr-2 inline h-4 w-4" />
                                        Sosial Media
                                    </label>
                                    <input
                                        type="text"
                                        name="sosialMedia"
                                        value={formData.sosialMedia}
                                        onChange={handleChange}
                                        placeholder="@username_anda"
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:ring-4 focus:ring-slate-100 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Daftar Barang */}
                    <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
                        <h2 className="mb-6 text-lg font-bold text-slate-900 sm:text-xl">Ringkasan Pesanan ({selectedItems.length} item)</h2>

                        {selectedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="mb-4 text-4xl text-slate-300 sm:text-6xl">📦</div>
                                <p className="text-center text-lg text-slate-500 sm:text-xl">Belum ada barang yang dipilih</p>
                                <p className="mt-2 px-4 text-center text-sm text-slate-400 sm:text-base">
                                    Silakan kembali ke keranjang untuk memilih produk
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedItems.map((item, i) => (
                                    <div
                                        key={item.product?.product_id ?? `item-${i}`}
                                        className="flex flex-col gap-4 rounded-xl border-2 border-slate-200 bg-slate-50 p-4 sm:p-6 md:flex-row md:items-center"
                                    >
                                        {item.product ? (
                                            <>
                                                <img
                                                    src={item.product.product_image}
                                                    alt={item.name}
                                                    className="mx-auto h-16 w-20 rounded-lg object-cover shadow-md sm:h-20 sm:w-24 md:mx-0"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-center text-base font-semibold text-slate-900 sm:text-lg md:text-left">
                                                        {item.name}
                                                    </h3>
                                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 sm:gap-4 sm:text-sm md:grid-cols-4">
                                                        <div className="text-center md:text-left">
                                                            <span className="font-medium">Harga:</span>
                                                            <p className="text-slate-900">Rp {(item.price ?? 0).toLocaleString('id-ID')}</p>
                                                        </div>
                                                        <div className="text-center md:text-left">
                                                            <span className="font-medium">Jumlah:</span>
                                                            <p className="text-slate-900">{item.quantity ?? 0} unit</p>
                                                        </div>
                                                        <div className="text-center md:text-left">
                                                            <span className="font-medium">Durasi:</span>
                                                            <p className="text-slate-900">{item.day_rent ?? 1} hari</p>
                                                        </div>
                                                        <div className="text-center md:text-left">
                                                            <span className="font-medium">Subtotal:</span>
                                                            <p className="text-base font-bold text-slate-900 sm:text-lg">
                                                                Rp{' '}
                                                                {((item.price ?? 0) * (item.quantity ?? 0) * (item.day_rent ?? 1)).toLocaleString(
                                                                    'id-ID',
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex w-full items-center justify-center rounded-lg bg-red-50 p-4">
                                                <p className="text-sm font-medium text-red-600 sm:text-base">⚠️ Data produk tidak ditemukan</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
            </div>
            {/* Footer Total */}
            <div className="fixed bottom-0 left-0 z-50 w-full border-t-2 border-slate-200 bg-white shadow-2xl">
                <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="text-center md:text-left">
                            <p className="text-xs font-medium text-slate-600 sm:text-sm">Total Pembayaran</p>
                            <p className="text-xl font-bold text-slate-900 sm:text-2xl">Rp {totalHarga.toLocaleString('id-ID')}</p>
                        </div>
                        <button
                            onClick={handleConfirmClick}
                            className="flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-3 sm:px-8 sm:py-4 sm:text-base"
                            disabled={!formData.nama || !formData.noHp || !formData.alamat || !formData.tanggalSewa}
                        >
                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109" />
                            </svg>
                            <span className="xs:inline hidden">Kirim ke </span>WhatsApp
                        </button>
                    </div>
                </div>
            </div>
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in-0 zoom-in-95 w-full max-w-lg duration-200">
                        <div className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 sm:mb-6 sm:h-16 sm:w-16">
                                <svg className="h-6 w-6 text-green-600 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                            </div>
                            <div className="text-center">
                                <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">Konfirmasi Pengiriman</h3>
                                <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:mb-8 sm:text-base">
                                    Apakah Anda yakin ingin memasukkan pesanan dan mengirim ke admin?
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                <button
                                    onClick={cancelSendWA}
                                    className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:ring-4 focus:ring-slate-100 sm:px-6 sm:text-base"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmSendWA}
                                    className="flex-1 transform rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-4 focus:ring-green-200 sm:px-6 sm:text-base"
                                >
                                    Ya, Kirim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormDataDiri;