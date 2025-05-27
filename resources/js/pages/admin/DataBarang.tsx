import DeleteBarangModal from '@/components/DeleteBarangModal';
import EditBarangModal from '@/components/EditBarangModal';
import TambahBarangModal from '@/components/TambahBarangModal';
import AdminLayout from '@/layouts/admin_layout';
import { FaEdit, FaTrash } from 'react-icons/fa';
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

const DataBarang: React.FC<Props> = ({ products, filters }) => {
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
    
    const [showEdit, setShowEdit] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState(null);
    const [filterBrand, setFilterBrand] = useState('');
    const [filterJenis, setFilterJenis] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handleDelete = () => {
        setModalOpen(false); //tutup modal dulu

        setTimeout(() => {
            setShowAlert(true); //tampilkan alert setelah modal hilang

            setTimeout(() => {
                setShowAlert(false); //hilangkan alert setelah 3 detik
            }, 3000);
        }, 300); //delay 300ms supaya modal punya waktu hilang dulu
    };

    return (
        <AdminLayout title="Data Barang">
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
        </AdminLayout>
    );
};


// const DataBarang = () => {

//     return (
//         <AdminLayout title="Data Barang">
//             <div className="px-6 py-4">
//                 {/* Filter dan Tambah */}
//                 <div className="mb-6 flex flex-wrap items-center gap-4">
//                     <select
//                         className="rounded-md border border-gray-300 bg-[#F9F9F9] px-6 py-3 text-sm font-medium transition duration-150 hover:bg-[#D9D9D9]"
//                         value={filterBrand}
//                         onChange={(e) => setFilterBrand(e.target.value)}
//                     >
//                         <option value="">Filter berdasarkan brand</option>
//                         <option value="Sony">Sony</option>
//                         <option value="Canon">Canon</option>
//                         <option value="Nikon">Nikon</option>
//                         <option value="Fujifilm">Fujifilm</option>
//                         <option value="Lumix">Lumix</option>
//                         <option value="DjiOsmoPOcket">Dji Osmo POcket 3</option>
//                     </select>

//                     <select
//                         className="rounded-md border border-gray-300 bg-[#eeeeee] px-6 py-3 text-sm font-medium transition duration-150 hover:bg-[#D9D9D9]"
//                         value={filterJenis}
//                         onChange={(e) => setFilterJenis(e.target.value)}
//                     >
//                         <option value="">Filter berdasarkan jenis</option>
//                         <option value="Kamera">Kamera</option>
//                         <option value="Lensa">Lensa</option>
//                     </select>

//                     <button
//                         onClick={() => setShowModal(true)}
//                         className="ml-auto rounded-md border border-[#0F63D4] px-5 py-2 text-sm font-medium text-[#0F63D4] transition hover:bg-[#0F63D4] hover:text-white"
//                     >
//                         + tambah barang
//                     </button>
//                 </div>

//                 {/* Tabel Data Barang */}
//                 <div className="overflow-x-auto rounded-md bg-white px-2 py-2 shadow-md">
//                     <table className="min-w-full border-separate border-spacing-y-2 text-sm text-[#1f1e29]">
//                         <thead>
//                             <tr className="bg-[#D4D4D4] text-left">
//                                 <th className="rounded-tl-md px-4 py-3">No</th>
//                                 <th className="px-4 py-3">Gambar</th>
//                                 <th className="px-4 py-3">Nama Barang</th>
//                                 <th className="px-4 py-3">Jenis</th>
//                                 <th className="px-4 py-3">Brand</th>
//                                 <th className="px-4 py-3">Stock</th>
//                                 <th className="px-4 py-3">Harga Sewa (8/24 Jam)</th>
//                                 <th className="rounded-tr-md px-4 py-3">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {barangList
//                                 .filter(
//                                     (item) => (filterBrand ? item.brand === filterBrand : true) && (filterJenis ? item.jenis === filterJenis : true),
//                                 )
//                                 .map((barang, idx) => (
//                                     <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-[#eeeeee]'} rounded-md`}>
//                                         <td className="px-4 py-3">{barang.no}</td>
//                                         <td className="px-4 py-3">{barang.gambar}</td>
//                                         <td className="px-4 py-3">{barang.nama}</td>
//                                         <td className="px-4 py-3">{barang.jenis}</td>
//                                         <td className="px-4 py-3">{barang.brand}</td>
//                                         <td className="px-4 py-3">{barang.stock}</td>
//                                         <td className="px-4 py-3">{barang.harga}</td>
//                                         <td className="px-4 py-3">
//                                             <div className="flex items-center gap-2">
//                                                 <button
//                                                     className="text-[#0F63D4] hover:text-[#084fad]"
//                                                     onClick={() => {
//                                                         setSelectedBarang(barang);
//                                                         setShowEdit(true);
//                                                     }}
//                                                 >
//                                                     <FaEdit size={14} />
//                                                 </button>
//                                                 <button className="text-[#EF4444] hover:text-[#dc2626]" onClick={() => setModalOpen(true)}>
//                                                     <FaTrash size={14} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Modal Tambah */}
//             <TambahBarangModal visible={showModal} onClose={() => setShowModal(false)} />

//             {/* Modal Edit */}
//             {selectedBarang && <EditBarangModal visible={showEdit} onClose={() => setShowEdit(false)} data={selectedBarang} />}

//             {showAlert && (
//                 <div className="animate-fadeInDown fixed top-6 left-1/2 z-[60] flex -translate-x-1/2 transform items-center gap-2 rounded-lg border border-red-400 bg-red-100 px-6 py-4 text-red-700 shadow-lg">
//                     <FaTrash className="text-xl text-red-500" />
//                     <span className="font-medium">Data barang berhasil dihapus.</span>
//                 </div>
//             )}
//             {/* Modal Delete */}
//             <DeleteBarangModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleDelete} showAlert={showAlert} />
//         </AdminLayout>
//     );
// };

export default DataBarang;
