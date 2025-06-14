import { usePage, router } from '@inertiajs/react';
import { Calendar, Package, Clock, CheckCircle, XCircle, Truck, ShoppingBag, Eye, Filter, Search, ArrowLeft, User, Phone, MapPin, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';

interface AuthProps {
    user?: {
        id?: number;
        name?: string;
        email?: string;
        role?: string;
    };
}

interface StatusOrderItem {
    order_id: string;
    customer_name: string;
    phone_number: string;
    order_date: string;
    day_rent: number;
    due_on: string;
    product_name: string;
    status: 'pending' | 'terkonfirmasi';
    price: number;
}

export default function StatusOrder() {
    const { auth, status } = usePage().props as { 
        auth?: { user?: AuthProps['user'] },
        status?: StatusOrderItem[]
    };
    const user = auth?.user;
    
    const [filteredStatus, setFilteredStatus] = useState<StatusOrderItem[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<StatusOrderItem | null>(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('order_date');

    // Initialize filtered status
    useEffect(() => {
        if (status) {
            setFilteredStatus(status);
        }
    }, [status]);

    // Filter status based on search and filters
    useEffect(() => {
        if (!status) return;
        
        let filtered = status;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(item => 
                item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.order_id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Sort
        if (sortBy === 'order_date') {
            filtered.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
        } else if (sortBy === 'price') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'customer_name') {
            filtered.sort((a, b) => a.customer_name.localeCompare(b.customer_name));
        }

        setFilteredStatus(filtered);
    }, [status, searchQuery, statusFilter, sortBy]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleOrderDetail = (item: StatusOrderItem) => {
        setSelectedOrder(item);
        setShowOrderDetail(true);
    };

    const closeOrderDetail = () => {
        setShowOrderDetail(false);
        setSelectedOrder(null);
    };

    const getStatusBadge = (orderStatus: string) => {
        if (orderStatus === 'pending') {
            return (
                <span className="inline-flex items-center space-x-1 rounded-full border px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                </span>
            );
        } else if (orderStatus === 'terkonfirmasi') {
            return (
                <span className="inline-flex items-center space-x-1 rounded-full border px-3 py-1 text-sm font-medium bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    <span>Terkonfirmasi</span>
                </span>
            );
        }
    };

    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return <span className="text-red-600 font-semibold">Terlambat {Math.abs(diffDays)} hari</span>;
        } else if (diffDays === 0) {
            return <span className="text-orange-600 font-semibold">Jatuh tempo hari ini</span>;
        } else if (diffDays <= 2) {
            return <span className="text-yellow-600 font-semibold">Jatuh tempo dalam {diffDays} hari</span>;
        } else {
            return <span className="text-green-600">{diffDays} hari lagi</span>;
        }
    };

    // Count statistics
    const totalOrders = filteredStatus.length;
    const pendingOrders = filteredStatus.filter(order => order.status === 'pending').length;
    const confirmedOrders = filteredStatus.filter(order => order.status === 'terkonfirmasi').length;

    return (
        <div title="Status Pesanan">
            <Navbar 
                showSearch={false}
                showFilters={false}
                showCart={true}
            />
            
            {/* Enhanced Order Detail Modal */}
            {showOrderDetail && selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-8 text-white">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Detail Pesanan</h3>
                                        <p className="text-slate-200 mt-1">Informasi lengkap pesanan rental</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeOrderDetail}
                                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-xl p-2"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {/* Status Badge */}
                            <div className="flex justify-center mb-8">
                                <div className="transform scale-125">
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Order Summary */}
                                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Ringkasan Pesanan
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Tanggal Pesanan</label>
                                                <p className="text-slate-800 font-medium text-lg">{formatDate(selectedOrder.order_date)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Durasi Sewa</label>
                                                <p className="text-slate-800 font-medium text-lg">{selectedOrder.day_rent} Hari</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Jatuh Tempo</label>
                                                <p className="text-slate-800 font-medium text-lg">{formatDate(selectedOrder.due_on)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Pembayaran</label>
                                                <p className="text-slate-800 font-bold text-2xl text-green-600">{formatCurrency(selectedOrder.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Information */}
                                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center">
                                        <Package className="w-5 h-5 mr-2" />
                                        Produk Disewa
                                    </h4>
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                        <h5 className="font-bold text-slate-800 text-xl mb-2">{selectedOrder.product_name}</h5>
                                        <div className="flex items-center justify-between">
                                            <div className="text-slate-600">
                                                <p className="text-sm">Periode sewa: <span className="font-semibold">{selectedOrder.day_rent} hari</span></p>
                                                <p className="text-sm">Tanggal kembali: <span className="font-semibold">{formatDate(selectedOrder.due_on)}</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-600 mb-1">Status Pengembalian:</p>
                                                <div className="bg-white rounded-lg px-3 py-1">
                                                    {getDaysUntilDue(selectedOrder.due_on)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 border-t border-slate-200 p-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={closeOrderDetail}
                                    className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    Tutup Detail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8">
                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={() => router.visit('/customerprofile')}
                                    className="flex items-center justify-center rounded-xl bg-slate-200 p-3 text-slate-700 transition-all duration-200 hover:bg-slate-300 hover:shadow-md"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800">Status Pesanan</h1>
                                        <p className="text-slate-600">Kelola dan pantau status pesanan rental</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Total Pesanan</p>
                                        <p className="text-2xl font-bold text-slate-800">{totalOrders}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Terkonfirmasi</p>
                                        <p className="text-2xl font-bold text-green-600">{confirmedOrders}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari pesanan, customer, atau produk..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Status Filter */}
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="terkonfirmasi">Terkonfirmasi</option>
                                </select>

                                {/* Sort By */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                >
                                    <option value="order_date">Tanggal Pesanan</option>
                                    <option value="price">Harga</option>
                                    <option value="customer_name">Nama Customer</option>
                                </select>

                                {/* Results Count */}
                                <div className="flex items-center justify-center md:justify-start">
                                    <span className="text-slate-600 text-sm">
                                        Menampilkan {filteredStatus.length} pesanan
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                            {!status ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                                    <span className="ml-3 text-slate-600">Memuat pesanan...</span>
                                </div>
                            ) : filteredStatus.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Package className="w-16 h-16 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-600 mb-2">Tidak ada pesanan</h3>
                                    <p className="text-slate-500 text-center">
                                        {!status || status.length === 0 
                                            ? "Belum ada pesanan yang perlu diproses." 
                                            : "Tidak ada pesanan yang sesuai dengan filter yang dipilih."
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200">
                                    {filteredStatus.map((order) => (
                                        <div key={order.order_id} className="p-6 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-4 mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <User className="w-5 h-5 text-slate-600" />
                                                            <h3 className="font-bold text-slate-800 text-lg">{order.customer_name}</h3>
                                                        </div>
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-6 text-sm text-slate-600 mb-3">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{formatDate(order.order_date)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{order.day_rent} hari</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Phone className="w-4 h-4" />
                                                            <span>{order.phone_number}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-sm text-slate-600 space-y-1">
                                                        <div className="flex items-center space-x-2">
                                                            <Package className="w-4 h-4" />
                                                            <span className="font-medium">{order.product_name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Jatuh tempo: {formatDate(order.due_on)}</span>
                                                        </div>
                                                        <div className="ml-5">
                                                            {getDaysUntilDue(order.due_on)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right space-y-3">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-800">{formatCurrency(order.price)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleOrderDetail(order)}
                                                        className="inline-flex items-center space-x-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-900 hover:shadow-lg hover:-translate-y-0.5"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span>Detail</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}