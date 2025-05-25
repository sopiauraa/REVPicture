import StaffLayout from '@/layouts/staff_layout';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface Product {
    product_id: number;
    product_name: string;
    product_type: string;
    product_image: string;
    brand: string;
    eight_hour_rent_price: number;
    twenty_four_hour_rent_price: number;
    stock?: { stock_available: number };
}

interface Props {
    products: Product[];
    filters: {
        search_name: string;
        search_type: string;
        search_brand: string;
    };
}

const ProductIndex: React.FC<Props> = ({ products, filters }) => {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post } = useForm({
        product_name: '',
        product_type: '',
        brand: '',
        stock_available: '',
        eight_hour_rent_price: '',
        twenty_four_hour_rent_price: '',
        product_image: null as File | null,
        product_description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/staff/products/store', {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(false);
                window.location.href = route('staff.staff_data_barang');
            },
        });
    };

    return (
        <StaffLayout title="Data Barang">
            {/* Filter Inputs */}
            <form method="GET" className="mb-4 flex gap-2">
                <input name="search_name" defaultValue={filters.search_name} placeholder="search nama" className="rounded border px-2 py-1" />
                <input name="search_type" defaultValue={filters.search_type} placeholder="search jenis" className="rounded border px-2 py-1" />
                <input name="search_brand" defaultValue={filters.search_brand} placeholder="search brand" className="rounded border px-2 py-1" />
                <button type="submit" className="ml-auto cursor-pointer rounded bg-blue-500 px-4 py-1 text-white">
                    Search
                </button>
                <button type="button" onClick={() => setShowModal(true)} className="cursor-pointer rounded bg-green-500 px-4 py-1 text-white">
                    + Add Row
                </button>
            </form>

            {/* Table */}
            <table className="w-full border text-left">
                <thead className="bg-gray-500 text-white">
                    <tr>
                        <th className="p-2">ID</th>
                        <th>Gambar</th>
                        <th>Nama</th>
                        <th>Jenis</th>
                        <th>Brand</th>
                        <th>Stok</th>
                        <th>Sewa 8/24 Jam</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod.product_id} className="border-t">
                            <td className="p-2">{prod.product_id}</td>
                            <td>
                                <img src={`/${prod.product_image}`} alt={prod.product_name} className="h-12 w-12 rounded object-cover" />
                            </td>
                            <td>{prod.product_name}</td>
                            <td>{prod.product_type}</td>
                            <td>{prod.brand}</td>
                            <td>{prod.stock?.stock_available ?? 0}</td>
                            <td>
                                {prod.eight_hour_rent_price} / {prod.twenty_four_hour_rent_price}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowModal(false)} // klik luar = close
                >
                    <form
                        onSubmit={handleSubmit}
                        onClick={(e) => e.stopPropagation()} // supaya klik di dalam form tidak menutup
                        className="flex w-[500px] gap-4 rounded bg-white p-6"
                    >
                        <div className="flex w-1/2 flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-gray-100 p-4">
                            <label htmlFor="image" className="cursor-pointer text-center">
                                <div>📤</div>
                                <div>Unggah gambar</div>
                            </label>
                            <input
                                id="image"
                                type="file"
                                className="hidden"
                                onChange={(e) => setData('product_image', e.target.files?.[0] ?? null)}
                            />
                            {data.product_image && (
                                <img src={URL.createObjectURL(data.product_image)} alt="Preview" className="mt-2 h-24 w-24 rounded object-cover" />
                            )}
                        </div>

                        <div className="w-1/2 space-y-2">
                            <input
                                type="text"
                                placeholder="Nama Barang"
                                className="w-full rounded border px-2 py-1"
                                onChange={(e) => setData('product_name', e.target.value)}
                            />
                            <select
                                className="w-full rounded border px-2 py-1"
                                onChange={(e) => setData('product_type', e.target.value)}
                                value={data.product_type}
                            >
                                <option value="">Pilih jenis</option>
                                <option value="camera">Camera</option>
                                <option value="lens">Lens</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Brand"
                                className="w-full rounded border px-2 py-1"
                                onChange={(e) => setData('brand', e.target.value)}
                            />
                            <textarea
                                placeholder="Deskripsi Produk"
                                className="w-full rounded border px-2 py-1"
                                rows={3}
                                onChange={(e) => setData('product_description', e.target.value)}
                            ></textarea>

                            <input
                                type="number"
                                placeholder="Stock"
                                className="w-full rounded border px-2 py-1"
                                onChange={(e) => setData('stock_available', e.target.value)}
                            />
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="/8 jam"
                                    className="w-1/2 rounded border px-2 py-1"
                                    onChange={(e) => setData('eight_hour_rent_price', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="/24 jam"
                                    className="w-1/2 rounded border px-2 py-1"
                                    onChange={(e) => setData('twenty_four_hour_rent_price', e.target.value)}
                                />
                            </div>
                            <button type="submit" className="mt-2 cursor-pointer rounded bg-black px-4 py-1 text-white">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </StaffLayout>
    );
};

export default ProductIndex;
