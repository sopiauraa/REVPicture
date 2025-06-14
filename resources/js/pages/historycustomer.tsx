import { usePage, router } from '@inertiajs/react';
import { Calendar, Package, Clock, CheckCircle, XCircle, Truck, ShoppingBag, Eye, Filter, Search, ArrowLeft } from 'lucide-react';
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

interface HistoryItem {
    order_id: number;
    customer_name: string;
    phone_number: string;
    order_date: string;
    day_rent: number;
    due_on: string;
    product_name: string;
    price: number;
}

export default function HistoryCustomer() {
    const { auth, history } = usePage().props as { 
        auth?: { user?: AuthProps['user'] },
        history?: HistoryItem[]
    };
    const user = auth?.user;
    
    const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<HistoryItem | null>(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<string>('all');

    // Initialize filtered history
    useEffect(() => {
        if (history) {
            setFilteredHistory(history);
        }
    }, [history]);

    // Filter history based on search and date
    useEffect(() => {
        if (!history) return;
        
        let filtered = history;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(item => 
                item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.order_id.toString().includes(searchQuery)
            );
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            
            switch (dateFilter) {
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case '3months':
                    filterDate.setMonth(now.getMonth() - 3);
                    break;
            }
            
            if (dateFilter !== 'all') {
                filtered = filtered.filter(item => 
                    new Date(item.order_date) >= filterDate
                );
            }
        }

        setFilteredHistory(filtered);
    }, [history, searchQuery, dateFilter]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleOrderDetail = (item: HistoryItem) => {
        setSelectedOrder(item);
        setShowOrderDetail(true);
    };

    const closeOrderDetail = () => {
        setShowOrderDetail(false);
        setSelectedOrder(null);
    };

    // Group history by order_id for display
    const groupedHistory = filteredHistory.reduce((acc, item) => {
        const orderId = item.order_id;
        if (!acc[orderId]) {
            acc[orderId] = {
                order_id: orderId,
                customer_name: item.customer_name,
                phone_number: item.phone_number,
                order_date: item.order_date,
                day_rent: item.day_rent,
                due_on: item.due_on,
                price: item.price,
                products: []
            };
        }
        acc[orderId].products.push(item.product_name);
        return acc;
    }, {} as Record<number, any>);

    const groupedOrders = Object.values(groupedHistory);

    return (
        <div title="Riwayat Pesanan">
            <Navbar 
                showSearch={false}
                showFilters={false}
                showCart={true}
            />
            
            {/* Order Detail Modal */}
            {showOrderDetail && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-800">Detail Pesanan</h3>
                                <button
                                    onClick={closeOrderDetail}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-600">ID Pesanan</label>
                                    <p className="text-slate-800 font-medium">#{selectedOrder.order_id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-600">Tanggal Pesanan</label>
                                    <p className="text-slate-800">{formatDate(selectedOrder.order_date)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-600">Status</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="inline-flex items-center space-x-1 rounded-full border px-3 py-1 text-sm font-medium bg-green-100 text-green-800 border-green-200">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Selesai</span>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-600">Total</label>
                                    <p className="text-slate-800 font-bold text-lg">{formatCurrency(selectedOrder.price)}</p>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">Produk Disewa</h4>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <h5 className="font-medium text-slate-800">{selectedOrder.product_name}</h5>
                                    <p className="text-slate-600 text-sm">Durasi: {selectedOrder.day_rent} hari</p>
                                    <p className="text-slate-600 text-sm">Jatuh tempo: {formatDate(selectedOrder.due_on)}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-600">Nama Customer</label>
                                    <p className="text-slate-800">{selectedOrder.customer_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-600">No. Telepon</label>
                                    <p className="text-slate-800">{selectedOrder.phone_number}</p>
                                </div>
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
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-800">Riwayat Pesanan</h1>
                                            <p className="text-slate-600">Daftar pesanan yang telah selesai</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        {/* Filters */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari pesanan atau produk..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Date Filter */}
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                >
                                    <option value="all">Semua Waktu</option>
                                    <option value="week">1 Minggu Terakhir</option>
                                    <option value="month">1 Bulan Terakhir</option>
                                    <option value="3months">3 Bulan Terakhir</option>
                                </select>

                                {/* Results Count */}
                                <div className="flex items-center justify-center md:justify-start">
                                    <span className="text-slate-600 text-sm">
                                        Menampilkan {groupedOrders.length} pesanan selesai
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                            {!history ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                                    <span className="ml-3 text-slate-600">Memuat pesanan...</span>
                                </div>
                            ) : groupedOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-600 mb-2">Tidak ada pesanan</h3>
                                    <p className="text-slate-500 text-center">
                                        {!history || history.length === 0 
                                            ? "Belum ada pesanan yang selesai." 
                                            : "Tidak ada pesanan yang sesuai dengan filter yang dipilih."
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200">
                                    {groupedOrders.map((order) => (
                                        <div key={order.order_id} className="p-6 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-4 mb-3">
                                                        <h3 className="font-semibold text-slate-800">#{order.order_id}</h3>
                                                        <span className="inline-flex items-center space-x-1 rounded-full border px-3 py-1 text-sm font-medium bg-green-100 text-green-800 border-green-200">
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span>Selesai</span>
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-6 text-sm text-slate-600 mb-3">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{formatDate(order.order_date)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Package className="w-4 h-4" />
                                                            <span>{order.products.length} produk</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-sm text-slate-600">
                                                        <p className="font-medium">Customer: {order.customer_name}</p>
                                                        <p className="truncate max-w-md">
                                                            Produk: {order.products.join(', ')}
                                                        </p>
                                                        <p>Durasi: {order.day_rent} hari</p>
                                                    </div>
                                                </div>

                                                <div className="text-right space-y-3">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-800">{formatCurrency(order.price)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleOrderDetail(filteredHistory.find(item => item.order_id === order.order_id)!)}
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