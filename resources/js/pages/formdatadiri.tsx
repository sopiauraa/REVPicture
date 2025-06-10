import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { UserIcon, PhoneIcon, MapPinIcon, CalendarIcon, AtSymbolIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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

    useEffect(() => {
        const itemsFromStorage = localStorage.getItem('checkoutItems');
        const totalFromStorage = localStorage.getItem('checkoutTotal');

        if (itemsFromStorage) {
            setSelectedItems(JSON.parse(itemsFromStorage));
        }
        if (totalFromStorage) {
            setTotalHarga(parseInt(totalFromStorage));
        }
    }, []);

    const [formData, setFormData] = useState({
        nama: '',
        alamat: '',
        noHp: '',
        tanggalSewa: '',
        sosialMedia: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting!'); // Add this line

        // Map items to ensure product_id and day_rent are present at the top level
        const items = selectedItems.map((item) => ({
            product_id: item.product?.product_id ?? item.product,
            day_rent: item.day_rent ?? 1,
            duration: item.duration ?? (item.name?.includes('8 Jam') ? 'eight_hour' : 'twenty_four_hour'),
            // Optionally include other fields if needed
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));

        const payload = {
            name: formData.nama,
            phone: formData.noHp,
            address: formData.alamat,
            social_media: formData.sosialMedia,
            tanggalSewa: formData.tanggalSewa,
            items,
            total: totalHarga,
        };

        router.post('/checkout', payload, {
            onSuccess: () => {
                localStorage.removeItem('checkoutItems');
                localStorage.removeItem('checkoutTotal');
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
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-slate-900 px-4 py-6 sm:px-6 sm:py-8 shadow-lg">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => router.visit('/keranjang')} 
                            className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-slate-600 text-sm sm:text-base"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Kembali
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Data Diri Penyewa</h1>
                            <p className="mt-1 text-sm sm:text-base text-slate-300">Lengkapi informasi untuk melanjutkan pemesanan</p>
                        </div>
                        <div className="w-[88px] sm:w-[96px]"></div> {/* Spacer untuk balance */}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-6 pb-40 sm:px-6 sm:py-8 sm:pb-44">
                <form onSubmit={handleKirimWA} className="space-y-6 sm:space-y-8">
                    {/* Form Data Diri */}
                    <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-slate-200">
                        <h2 className="mb-6 flex items-center gap-3 text-lg sm:text-xl font-bold text-slate-900">
                            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
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
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
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
                                            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
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
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
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
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
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
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Daftar Barang */}
                    <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-slate-200">
                        <h2 className="mb-6 text-lg sm:text-xl font-bold text-slate-900">
                            Ringkasan Pesanan ({selectedItems.length} item)
                        </h2>
                        
                        {selectedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="mb-4 text-4xl sm:text-6xl text-slate-300">📦</div>
                                <p className="text-lg sm:text-xl text-slate-500 text-center">Belum ada barang yang dipilih</p>
                                <p className="mt-2 text-sm sm:text-base text-slate-400 text-center px-4">Silakan kembali ke keranjang untuk memilih produk</p>
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
                                                    className="h-16 w-20 sm:h-20 sm:w-24 mx-auto md:mx-0 rounded-lg object-cover shadow-md" 
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 text-center md:text-left">{item.name}</h3>
                                                    <div className="mt-2 grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 md:grid-cols-4">
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
                                                            <p className="text-base sm:text-lg font-bold text-slate-900">
                                                                Rp {((item.price ?? 0) * (item.quantity ?? 0) * (item.day_rent ?? 1)).toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center rounded-lg bg-red-50 p-4 w-full">
                                                <p className="text-red-600 font-medium text-sm sm:text-base">⚠️ Data produk tidak ditemukan</p>
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
                            <p className="text-xs sm:text-sm font-medium text-slate-600">Total Pembayaran</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900">
                                Rp {totalHarga.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <button 
                            onClick={handleKirimWA}
                            className="flex items-center justify-center gap-2 sm:gap-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 sm:px-8 sm:py-4 font-bold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-4 focus:ring-green-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            disabled={!formData.nama || !formData.noHp || !formData.alamat || !formData.tanggalSewa}
                        >
                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                            </svg>
                            <span className="hidden xs:inline">Kirim ke </span>WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDataDiri;