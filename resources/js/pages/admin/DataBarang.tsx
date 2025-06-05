import DeleteBarangModal from '@/components/DeleteBarangModal';
import EditBarangModal from '@/components/EditBarangModal';
import TambahBarangModal from '@/components/TambahBarangModal';
import AdminLayout from '@/layouts/admin_layout';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useForm, router } from '@inertiajs/react';
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
    const [showEdit, setShowEdit] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState(null);
    const [filterBrand, setFilterBrand] = useState('');
    const [filterJenis, setFilterJenis] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);
    
    // State untuk success alert tambah barang
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    
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
    
    const [filtersState, setFiltersState] = useState({
        search_name: filters.search_name || '',
        search_type: filters.search_type || '',
        search_brand: filters.search_brand || '',
    });

    const filteredProducts = products.filter((product) => {
        const matchesName = product.product_name.toLowerCase().includes(filtersState.search_name.toLowerCase());
        const matchesType = filtersState.search_type ? product.product_type.toLowerCase().includes(filtersState.search_type.toLowerCase()) : true;
        const matchesBrand = filtersState.search_brand ? product.brand.toLowerCase().includes(filtersState.search_brand.toLowerCase()) : true;
        return matchesName && matchesType && matchesBrand;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/product/store', { 
            forceFormData: true,
            onSuccess: () => {
                setShowModal(false);
                window.location.href = route('admin.databarang');
            },
        });
    };
    
    // Callback setelah berhasil tambah barang baru
    const handleTambahSuccess = () => {
        // Refresh halaman untuk mendapatkan data terbaru
        router.reload({ only: ['products'] });
        
        // Tampilkan alert success
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);
    };
    
    const handleEdit = (prod: any) => {
        setSelectedBarang(prod);
        setShowEdit(true);
    };

    const handleDeleteClick = (id: number) => {
        setProductIdToDelete(id);
        setModalOpen(true);  // buka modal konfirmasi delete
    };

    const handleDeleteConfirm = () => {
        if (productIdToDelete) {
            // panggil API hapus barang pakai productIdToDelete
            console.log('Delete confirmed for id:', productIdToDelete);
        }
        setModalOpen(false); 

        setTimeout(() => {
            setShowAlert(true); 

            setTimeout(() => {
                setShowAlert(false); 
            }, 3000);
        }, 300);
    };

    return (
        <AdminLayout title="Data Barang">
            <div className="px-6 py-4">
                {/* Filter dan Tambah */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <select
                        className="rounded-md border border-gray-300 bg-[#F9F9F9] px-6 py-3 text-sm font-medium transition duration-150 hover:bg-[#D9D9D9]"
                        value={filtersState.search_brand}
                        onChange={(e) => setFiltersState({ ...filtersState, search_brand: e.target.value })}
                    >
                        <option value="">Filter berdasarkan brand</option>
                        <option value="Sony">Sony</option>
                        <option value="Canon">Canon</option>
                        <option value="Nikon">Nikon</option>
                        <option value="Fujifilm">Fujifilm</option>
                        <option value="Lumix">Lumix</option>
                    </select>

                    <select
                        className="rounded-md border border-gray-300 bg-[#eeeeee] px-6 py-3 text-sm font-medium transition duration-150 hover:bg-[#D9D9D9]"
                        value={filtersState.search_type}
                        onChange={(e) => setFiltersState({ ...filtersState, search_type: e.target.value })}
                    >
                        <option value="">Filter berdasarkan jenis</option>
                        <option value="Camera">Camera</option>
                        <option value="Lens">Lens</option>
                    </select>

                    <button
                        onClick={() => setShowModal(true)}
                        className="ml-auto rounded-md border border-[#0F63D4] px-5 py-2 text-sm font-medium text-[#0F63D4] transition hover:bg-[#0F63D4] hover:text-white"
                    >
                        + tambah barang
                    </button>
                </div>

                {/* Tabel Data Barang */}
                <div className="overflow-x-auto rounded-md bg-white px-2 py-2 shadow-md">
                    <table className="min-w-full border-separate border-spacing-y-2 text-sm text-[#1f1e29]">
                        <thead>
                            <tr className="bg-[#D4D4D4] text-left">
                                <th className="rounded-tl-md px-4 py-3">ID</th>
                                <th className="px-4 py-3">Gambar</th>
                                <th className="px-4 py-3">Nama Barang</th>
                                <th className="px-4 py-3">Jenis</th>
                                <th className="px-4 py-3">Brand</th>
                                <th className="px-4 py-3">Stok</th>
                                <th className="px-4 py-3">Harga Sewa (8/24 Jam)</th>
                                <th className="rounded-tr-md px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products
                                .filter((p) =>
                                    (!filtersState.search_brand || p.brand.toLowerCase().includes(filtersState.search_brand.toLowerCase())) &&
                                    (!filtersState.search_type || p.product_type.toLowerCase().includes(filtersState.search_type.toLowerCase()))
                                )
                                .map((prod, idx) => (
                                    <tr key={prod.product_id} className={`${idx % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-[#eeeeee]'} rounded-md`}>
                                        <td className="px-4 py-3">{prod.product_id}</td>
                                        <td className="px-4 py-3">
                                            <img src={`/${prod.product_image}`} alt={prod.product_name} className="h-12 w-12 rounded object-cover" />
                                        </td>
                                        <td className="px-4 py-3">{prod.product_name}</td>
                                        <td className="px-4 py-3">{prod.product_type}</td>
                                        <td className="px-4 py-3">{prod.brand}</td>
                                        <td className="px-4 py-3">{prod.stock?.stock_available ?? 0}</td>
                                        <td className="px-4 py-3">
                                            {prod.eight_hour_rent_price}/8 ; {prod.twenty_four_hour_rent_price}/24
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button className="text-[#0F63D4] hover:text-[#084fad]" onClick={() => handleEdit(prod)}>
                                                    <FaEdit size={14} />
                                                </button>
                                                <button className="text-[#EF4444] hover:text-[#dc2626]" onClick={() => handleDeleteClick(prod.product_id)}>
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alert Success Tambah Barang */}
            {showSuccessAlert && (
                <div className="animate-fadeInDown fixed top-6 left-1/2 z-[60] flex -translate-x-1/2 transform items-center gap-2 rounded-lg border border-green-400 bg-green-100 px-6 py-4 text-green-700 shadow-lg">
                    <div className="text-xl text-green-500">✓</div>
                    <span className="font-medium">Data barang berhasil ditambahkan!</span>
                </div>
            )}

            {/* Alert Success Delete */}
            {showAlert && (
                <div className="animate-fadeInDown fixed top-6 left-1/2 z-[60] flex -translate-x-1/2 transform items-center gap-2 rounded-lg border border-red-400 bg-red-100 px-6 py-4 text-red-700 shadow-lg">
                    <FaTrash className="text-xl text-red-500" />
                    <span className="font-medium">Data barang berhasil dihapus.</span>
                </div>
            )}

            {/* Modal Tambah - dengan callback onSuccess */}
            <TambahBarangModal 
                visible={showModal} 
                onClose={() => setShowModal(false)} 
                onSuccess={handleTambahSuccess}
            />

            {/* Modal Edit */}
            {selectedBarang && (
                <EditBarangModal 
                    visible={showEdit} 
                    onClose={() => setShowEdit(false)} 
                    data={selectedBarang} 
                />
            )}

            {/* Modal Delete */}
            <DeleteBarangModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onConfirm={handleDeleteConfirm} 
                showAlert={showAlert} 
            />
        </AdminLayout>
    );
};

export default DataBarang;