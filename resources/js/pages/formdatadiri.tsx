import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';

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
        <div className="mx-auto w-full max-w-screen-lg p-6">
            <h1 className="mb-6 text-2xl font-bold">Data Diri</h1>

            {/* FORM DATA DIRI */}
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 rounded-lg bg-[#e8d5c0] p-6 md:grid-cols-2">
                {/* Kolom Kiri */}
                <div>
                    <label className="mb-1 block font-semibold">Nama:</label>
                    <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        placeholder="Nama Lengkap"
                        className="w-full rounded bg-white p-2 shadow-inner"
                    />

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block font-semibold">No. HP:</label>
                            <input
                                type="text"
                                name="noHp"
                                value={formData.noHp}
                                onChange={handleChange}
                                placeholder="08..."
                                className="w-full rounded bg-white p-2 shadow-inner"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold">Tanggal Sewa:</label>
                            <input
                                type="date"
                                name="tanggalSewa"
                                value={formData.tanggalSewa}
                                onChange={handleChange}
                                className="w-full rounded bg-white p-2 shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div>
                    <label className="mb-1 block font-semibold">Alamat:</label>
                    <input
                        type="text"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        placeholder="Alamat Lengkap"
                        className="w-full rounded bg-white p-2 shadow-inner"
                    />

                    <div className="mt-4">
                        <label className="mb-1 block font-semibold">Sosial Media:</label>
                        <input
                            type="text"
                            name="sosialMedia"
                            value={formData.sosialMedia}
                            onChange={handleChange}
                            placeholder="@username"
                            className="w-full rounded bg-white p-2 shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {/* DAFTAR BARANG DIPILIH */}
            <h2 className="mt-6 mb-4 text-xl font-semibold">Barang yang dipilih:</h2>
            {selectedItems.length === 0 ? (
                <p>Belum ada barang yang dipilih.</p>
            ) : (
                <ul>
                    {selectedItems.map((item, i) => (
                        <li key={item.product?.product_id ?? `item-${i}`} className="mb-4 flex items-start gap-4">
                            {item.product ? (
                                <>
                                    <img src={item.product.product_image} alt={item.name} className="h-16 w-20 rounded object-cover" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p>Harga: Rp {(item.price ?? 0).toLocaleString('id-ID')}</p>
                                        <p>Jumlah: {item.quantity ?? 0}</p>
                                        <p>Durasi: {item.day_rent ?? 1} hari</p>
                                        <p>Total: Rp {((item.price ?? 0) * (item.quantity ?? 0) * (item.day_rent ?? 1)).toLocaleString('id-ID')}</p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-red-500">Data produk tidak ditemukan</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* FOOTER TOTAL HARGA */}
            <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between rounded-t-xl bg-gray-900 p-4 text-white">
                <h3 className="text-lg font-semibold">Total Harga: Rp {totalHarga.toLocaleString('id-ID')}</h3>
                <button type="submit" className="mt-6 rounded bg-green-500 px-6 py-2 font-semibold text-black hover:bg-gray-100">
                    Sent to WhatsApp
                </button>
            </div>
            </form>
        </div>
    );
};

export default FormDataDiri;
