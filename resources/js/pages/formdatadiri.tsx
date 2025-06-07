import { usePage } from '@inertiajs/react';
import { useState } from 'react';

type Product = {
    product_id: number;
    product_image: string;
};

type Item = {
    name: string;
    quantity: number;
    price: number;
    product?: Product;
};

type PageProps = {
    items: Item[];
    total: number;
};

const FormDataDiri = () => {
    const { props } = usePage<PageProps>();
    const selectedItems = props.items ?? [];
    const totalHarga = props.total ?? 0;

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
        return `${prefix}${item.name}\n${spacing}Jumlah: ${item.quantity}, Total: Rp ${((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString(
            'id-ID',
        )}`;
    })
    .join('\n')}

Total Harga: Rp ${totalHarga.toLocaleString('id-ID')}

Terima kasih!`;

        const waUrl = `https://wa.me/+6282160502890?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="mx-auto w-full max-w-screen-lg p-6">
            <h1 className="mb-6 text-2xl font-bold">Data Diri</h1>

            {/* FORM DATA DIRI */}
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
                                        <p>Total: Rp {((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString('id-ID')}</p>
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
                <button onClick={handleKirimWA} className="mt-6 rounded bg-green-500 px-6 py-2 font-semibold text-black hover:bg-gray-100">
                    Sent to WhatsApp
                </button>
            </div>
        </div>
    );
};

export default FormDataDiri;
