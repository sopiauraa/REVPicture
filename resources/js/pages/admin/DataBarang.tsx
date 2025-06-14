import DeleteBarangModal from '@/components/DeleteBarangModal';
import EditBarangModal from '@/components/EditBarangModal';
import TambahBarangModal from '@/components/TambahBarangModal';
import AdminLayout from '@/layouts/admin_layout';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

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
    flash?: {
        success?: string;
        error?: string;
    };
}

const DataBarang: React.FC<Props> = ({ products, filters, flash }) => {
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState<Product | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    
    // Ubah ini - simpan data produk lengkap, bukan hanya ID
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false); // Tambahkan state loading
    
    // State untuk success alert tambah barang
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
    
    const [filtersState, setFiltersState] = useState({
        search_name: filters.search_name || '',
        search_type: filters.search_type || '',
        search_brand: filters.search_brand || '',
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setShowEditSuccessAlert(true);
            setTimeout(() => {
                setShowEditSuccessAlert(false);
            }, 3000);
        }
    }, [flash]);

    const filteredProducts = products.filter((product) => {
        const matchesName = product.product_name.toLowerCase().includes(filtersState.search_name.toLowerCase());
        const matchesType = filtersState.search_type ? product.product_type.toLowerCase().includes(filtersState.search_type.toLowerCase()) : true;
        const matchesBrand = filtersState.search_brand ? product.brand.toLowerCase().includes(filtersState.search_brand.toLowerCase()) : true;
        return matchesName && matchesType && matchesBrand;
    });
    
    // Callback setelah berhasil tambah barang baru
    const handleTambahSuccess = () => {
        router.reload({ only: ['products'] });
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);
    };

    // Callback setelah berhasil edit barang
    const handleEditSuccess = () => {
        router.reload({ only: ['products'] });
        setShowEditSuccessAlert(true);
        setTimeout(() => {
            setShowEditSuccessAlert(false);
        }, 3000);
    };
    
    const handleEdit = (prod: Product) => {
        setSelectedBarang(prod);
        setShowEdit(true);
    };

    // Perbaiki fungsi ini - simpan data produk lengkap
    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setModalOpen(true);
    };

    // Perbaiki fungsi ini - terima data produk dari modal
    const handleDeleteConfirm = async (productData: { product_id: number; product_name?: string }) => {
        setIsDeleting(true);
        
        try {
            const response = await fetch(`/admin/product/delete/${productData.product_id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus produk. Silakan coba lagi.');
            }

            // Tutup modal terlebih dahulu
            setModalOpen(false);
            setProductToDelete(null);
            
            // Reload data
            router.reload({ only: ['products'] });
            
            // Tampilkan alert sukses setelah reload selesai
            setTimeout(() => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
            }, 300);

        } catch (error) {
            console.error('Error deleting product:', error);
            // Jangan tutup modal jika error, biar user bisa coba lagi
            throw error; // Re-throw error agar modal bisa handle
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseEditModal = () => {
        setShowEdit(false);
        setSelectedBarang(null);
    };

    // Tambahkan fungsi untuk close delete modal
    const handleCloseDeleteModal = () => {
        if (!isDeleting) { // Hanya bisa close jika tidak sedang loading
            setModalOpen(false);
            setProductToDelete(null);
        }
    };

    // Reset filters function
    const resetFilters = () => {
        setFiltersState({
            search_name: '',
            search_type: '',
            search_brand: '',
        });
    };

    return (
        <>
            <AdminLayout title="Data Barang">
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
                                    className="px-4 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        {/* Table Container dengan scroll horizontal dan vertikal */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ">
                            <div className="overflow-x-auto">
                                <div className="">
                                    <table className="w-full table-fixed">
                                        <colgroup>
                                            <col className="w-16" />      {/* No */}
                                            <col className="w-20" />      {/* Gambar */}
                                            <col className="w-48" />      {/* Nama Barang */}
                                            <col className="w-24" />      {/* Jenis */}
                                            <col className="w-28" />      {/* Brand */}
                                            <col className="w-20" />      {/* Stok */}
                                            <col className="w-36" />      {/* Harga Sewa */}
                                            <col className="w-20" />      {/* Aksi */}
                                        </colgroup>
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">No</th>
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
                                                            {idx + 1}
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
                                                        <div className="text-sm font-medium text-gray-900 truncate" title={prod.product_name}>
                                                            {prod.product_name}
                                                        </div>
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
                                                        <div className="text-sm font-medium text-gray-700 truncate" title={prod.brand}>
                                                            {prod.brand}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                            (prod.stock?.stock_available ?? 0) > 0 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {prod.stock?.stock_available ?? 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs text-gray-900">
                                                            <div className="font-medium">8j: Rp {prod.eight_hour_rent_price.toLocaleString()}</div>
                                                            <div className="text-gray-600">24j: Rp {prod.twenty_four_hour_rent_price.toLocaleString()}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button 
                                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200" 
                                                                onClick={() => handleEdit(prod)}
                                                                title="Edit barang"
                                                            >
                                                                <FaEdit size={14} />
                                                            </button>
                                                            <button 
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200" 
                                                                onClick={() => handleDeleteClick(prod)} // Kirim data produk lengkap
                                                                title="Hapus barang"
                                                            >
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

            {/* Success Alerts dengan posisi fixed di tengah atas */}
            {showSuccessAlert && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-down">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm w-max">
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

            {showEditSuccessAlert && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-down">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg max-w-sm w-max">
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

            {showAlert && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-down">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm w-max">
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
            </AdminLayout>

            {/* Backdrop Blur Overlay - Akan menutupi SELURUH layar termasuk navbar dan sidebar */}
            {(showModal || showEdit || modalOpen) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" />
            )}

            {/* Modals dengan z-index tertinggi */}
            <div className="relative z-[9999]">
                <TambahBarangModal 
                    visible={showModal} 
                    onClose={() => setShowModal(false)} 
                    onSuccess={handleTambahSuccess}
                />

                {selectedBarang && (
                    <EditBarangModal 
                        visible={showEdit} 
                        onClose={handleCloseEditModal} 
                        data={selectedBarang} 
                        onSuccess={handleEditSuccess}
                    />
                )}

                <DeleteBarangModal 
                    isOpen={modalOpen} 
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    productData={productToDelete ? {
                        product_id: productToDelete.product_id,
                        product_name: productToDelete.product_name
                    } : null}
                    isLoading={isDeleting}
                />
            </div>
        </>
    );
};

export default DataBarang;