import StaffLayout from '@/layouts/staff_layout';
import { useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    
    const [filtersState, setFiltersState] = useState({
        search_name: filters.search_name || '',
        search_type: filters.search_type || '',
        search_brand: filters.search_brand || '',
    });

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

    // Filter products based on state
    const filteredProducts = products.filter((product) => {
        const matchesName = product.product_name.toLowerCase().includes(filtersState.search_name.toLowerCase());
        const matchesType = filtersState.search_type ? product.product_type.toLowerCase().includes(filtersState.search_type.toLowerCase()) : true;
        const matchesBrand = filtersState.search_brand ? product.brand.toLowerCase().includes(filtersState.search_brand.toLowerCase()) : true;
        return matchesName && matchesType && matchesBrand;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/staff/products/store', {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(false);
                setShowSuccessAlert(true);
                setTimeout(() => {
                    setShowSuccessAlert(false);
                }, 3000);
                router.reload({ only: ['products'] });
            },
        });
    };

    // Reset filters function
    const resetFilters = () => {
        setFiltersState({
            search_name: '',
            search_type: '',
            search_brand: '',
        });
    };

    // Handle edit product
    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    // Handle delete product
    const handleDelete = (productId: number) => {
        setProductIdToDelete(productId);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const handleDeleteConfirm = async () => {
        if (productIdToDelete) {
            try {
                const response = await fetch(`/staff/products/delete/${productIdToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setShowDeleteModal(false);
                    setShowDeleteAlert(true);
                    setTimeout(() => {
                        setShowDeleteAlert(false);
                    }, 3000);
                    router.reload({ only: ['products'] });
                } else {
                    console.error('Failed to delete product');
                    alert('Gagal menghapus produk. Silakan coba lagi.');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Terjadi kesalahan saat menghapus produk.');
            }
        }
        setProductIdToDelete(null);
    };

    // Handle edit success
    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedProduct(null);
        setShowEditSuccessAlert(true);
        setTimeout(() => {
            setShowEditSuccessAlert(false);
        }, 3000);
        router.reload({ only: ['products'] });
    };

    return (
        <StaffLayout title="Data Barang">
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Data Barang</h1>
                                <p className="text-sm text-gray-600 mt-1">Kelola semua data barang rental Anda</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 px-3 py-2 rounded-lg">
                                    <span className="text-sm font-medium text-blue-700">
                                        Total: {filteredProducts.length} barang
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                >
                                    <FaPlus size={12} />
                                    Tambah Barang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area dengan overflow scroll */}
                <div className="flex-1 overflow-auto p-6">
                    {/* Filter Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FaFilter className="text-gray-500" />
                            <h3 className="font-semibold text-gray-800">Filter & Pencarian</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search by name */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Cari nama barang..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={filtersState.search_name}
                                    onChange={(e) => setFiltersState({ ...filtersState, search_name: e.target.value })}
                                />
                            </div>

                            {/* Filter by brand */}
                            <select
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                value={filtersState.search_brand}
                                onChange={(e) => setFiltersState({ ...filtersState, search_brand: e.target.value })}
                            >
                                <option value="">Semua Brand</option>
                                <option value="Sony">Sony</option>
                                <option value="Canon">Canon</option>
                                <option value="Nikon">Nikon</option>
                                <option value="Fujifilm">Fujifilm</option>
                                <option value="Lumix">Lumix</option>
                            </select>

                            {/* Filter by type */}
                            <select
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                value={filtersState.search_type}
                                onChange={(e) => setFiltersState({ ...filtersState, search_type: e.target.value })}
                            >
                                <option value="">Semua Jenis</option>
                                <option value="Camera">Camera</option>
                                <option value="Lens">Lens</option>
                            </select>

                            {/* Reset button */}
                            <button
                                onClick={resetFilters}
                                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>

                    {/* Table Container dengan scroll horizontal dan vertikal */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Gambar</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Nama Barang</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Jenis</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Brand</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Stok</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Harga Sewa</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProducts.map((prod, idx) => (
                                        <tr 
                                            key={prod.product_id} 
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                    #{prod.product_id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative group">
                                                    <img 
                                                        src={prod.product_image.startsWith('/') ? prod.product_image : `/${prod.product_image}`} 
                                                        alt={prod.product_name} 
                                                        className="h-16 w-16 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200" 
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = '/images/placeholder.jpg';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{prod.product_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                    prod.product_type === 'Camera' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {prod.product_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-700">{prod.brand}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                    (prod.stock?.stock_available ?? 0) > 0 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {prod.stock?.stock_available ?? 0} unit
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <div className="font-medium">8j: Rp {prod.eight_hour_rent_price.toLocaleString()}</div>
                                                    <div className="text-gray-600">24j: Rp {prod.twenty_four_hour_rent_price.toLocaleString()}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button 
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                                                        onClick={() => handleEdit(prod)}
                                                        title="Edit barang"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button 
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200" 
                                                        onClick={() => handleDelete(prod.product_id)}
                                                        title="Hapus barang"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Empty state */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FaSearch className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data ditemukan</h3>
                                <p className="text-gray-500">Coba ubah filter pencarian atau tambah barang baru</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Alert */}
            {showSuccessAlert && (
                <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-bold">✓</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    Data barang berhasil ditambahkan!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Success Alert */}
            {showEditSuccessAlert && (
                <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg max-w-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">✓</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-800">
                                    Data barang berhasil diupdate!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Success Alert */}
            {showDeleteAlert && (
                <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <FaTrash className="text-red-600" size={14} />
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">
                                    Data barang berhasil dihapus!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modern Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Tambah Barang Baru</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-2xl text-gray-400 hover:text-gray-600">×</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image Upload Section */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Gambar Produk</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                                        <input
                                            id="image"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setData('product_image', e.target.files?.[0] ?? null)}
                                        />
                                        <label htmlFor="image" className="cursor-pointer">
                                            {data.product_image ? (
                                                <div className="space-y-3">
                                                    <img 
                                                        src={URL.createObjectURL(data.product_image)} 
                                                        alt="Preview" 
                                                        className="mx-auto h-32 w-32 rounded-lg object-cover shadow-md" 
                                                    />
                                                    <p className="text-sm text-gray-600">Klik untuk mengganti gambar</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <span className="text-3xl">📤</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-700">Upload Gambar</p>
                                                        <p className="text-sm text-gray-500">PNG, JPG hingga 2MB</p>
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Barang</label>
                                        <input
                                            type="text"
                                            placeholder="Masukkan nama barang"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            onChange={(e) => setData('product_name', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Barang</label>
                                        <select
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                            onChange={(e) => setData('product_type', e.target.value)}
                                            value={data.product_type}
                                            required
                                        >
                                            <option value="">Pilih jenis barang</option>
                                            <option value="Camera">Camera</option>
                                            <option value="Lens">Lens</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                        <input
                                            type="text"
                                            placeholder="Masukkan brand"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            onChange={(e) => setData('brand', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Stok Tersedia</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Jumlah stok"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            onChange={(e) => setData('stock_available', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Harga 8 Jam</label>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Rp 0"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                onChange={(e) => setData('eight_hour_rent_price', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Harga 24 Jam</label>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Rp 0"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                onChange={(e) => setData('twenty_four_hour_rent_price', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description - Full Width */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Produk</label>
                                <textarea
                                    placeholder="Masukkan deskripsi produk..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows={4}
                                    onChange={(e) => setData('product_description', e.target.value)}
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    Simpan Barang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Edit Barang</h2>
                                <button
                                    onClick={() => {setShowEditModal(false); setSelectedProduct(null);}}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-2xl text-gray-400 hover:text-gray-600">×</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Edit Form akan diisi sesuai kebutuhan */}
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">Edit data untuk: <strong>{selectedProduct.product_name}</strong></p>
                            {/* Form edit akan ditambahkan sesuai kebutuhan backend */}
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => {setShowEditModal(false); setSelectedProduct(null);}}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleEditSuccess}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    Update Barang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                                <FaTrash className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Hapus Barang
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {setShowDeleteModal(false); setProductIdToDelete(null);}}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
};

export default ProductIndex;