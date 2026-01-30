import StaffLayout from '@/layouts/staff_layout';
import { usePage } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import { Package, Calendar, Phone, Clock, History, DollarSign, FileText, Download, Search, Filter, X } from 'lucide-react';

interface Order {
    order_id: number;
    customer_name: string;
    product_name: string;
    order_date: string;
    day_rent: number | string;
    price: number;
    phone_number: string;
}

interface GroupedOrder {
    order_id: number;
    customer_name: string;
    order_date: string;
    day_rent: number | string;
    phone_number: string;
    price: number;
    products: { name: string }[];
}

const HistoryPenyewaan: React.FC = () => {
    const page = usePage();
    const history = page.props.history as Order[];

    // State untuk pilihan rekap
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedMonthYear, setSelectedMonthYear] = useState(new Date().getFullYear());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // State untuk filter
    const [searchCustomer, setSearchCustomer] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Kelompokkan berdasarkan order_id
    const grouped = history.reduce<Record<number, GroupedOrder>>((acc, order) => {
        if (!acc[order.order_id]) {
            acc[order.order_id] = {
                order_id: order.order_id,
                customer_name: order.customer_name,
                order_date: order.order_date,
                day_rent: order.day_rent,
                phone_number: order.phone_number,
                price: order.price,
                products: [],
            };
        }

        acc[order.order_id].products.push({
            name: order.product_name,
        });

        return acc;
    }, {});

    const groupedOrders = Object.values(grouped);

    // Filter data berdasarkan kriteria
// Filter data berdasarkan kriteria - PERBAIKAN
const filteredOrders = useMemo(() => {
    return groupedOrders.filter(order => {
        const orderDate = new Date(order.order_date);
        
        // Filter berdasarkan nama customer
        if (searchCustomer && !order.customer_name.toLowerCase().includes(searchCustomer.toLowerCase())) {
            return false;
        }

        // Filter berdasarkan bulan dan tahun (DIPERBAIKI)
        if (filterMonth && filterYear) {
            const orderMonth = orderDate.getMonth() + 1;
            const orderYear = orderDate.getFullYear();
            if (orderMonth !== parseInt(filterMonth) || orderYear !== parseInt(filterYear)) {
                return false;
            }
        }
        // Filter berdasarkan bulan saja (DITAMBAHKAN)
        else if (filterMonth && !filterYear) {
            const orderMonth = orderDate.getMonth() + 1;
            if (orderMonth !== parseInt(filterMonth)) {
                return false;
            }
        }
        // Filter berdasarkan tahun saja (DIPERBAIKI)
        else if (filterYear && !filterMonth) {
            const orderYear = orderDate.getFullYear();
            if (orderYear !== parseInt(filterYear)) {
                return false;
            }
        }

        // Filter berdasarkan rentang tanggal (DIPERBAIKI)
        if (filterStartDate && filterEndDate) {
            const startDate = new Date(filterStartDate);
            const endDate = new Date(filterEndDate);
            // Set waktu untuk perbandingan yang akurat
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            orderDate.setHours(0, 0, 0, 0);
            
            if (orderDate < startDate || orderDate > endDate) {
                return false;
            }
        }
        // Filter berdasarkan tanggal mulai saja (DITAMBAHKAN)
        else if (filterStartDate && !filterEndDate) {
            const startDate = new Date(filterStartDate);
            startDate.setHours(0, 0, 0, 0);
            orderDate.setHours(0, 0, 0, 0);
            
            if (orderDate < startDate) {
                return false;
            }
        }
        // Filter berdasarkan tanggal akhir saja (DITAMBAHKAN)
        else if (!filterStartDate && filterEndDate) {
            const endDate = new Date(filterEndDate);
            endDate.setHours(23, 59, 59, 999);
            orderDate.setHours(0, 0, 0, 0);
            
            if (orderDate > endDate) {
                return false;
            }
        }

        return true;
    });
}, [groupedOrders, searchCustomer, filterMonth, filterYear, filterStartDate, filterEndDate]);
    // Generate array tahun berdasarkan data pemesanan
    const years = useMemo(() => {
        if (history.length === 0) {
            // Jika tidak ada data, gunakan tahun sekarang saja
            return [new Date().getFullYear()];
        }

        // Cari tahun terkecil (pemesanan pertama) dari data
        const firstOrderYear = Math.min(
            ...history.map(order => new Date(order.order_date).getFullYear())
        );
        
        const currentYear = new Date().getFullYear();
        
        // Buat array tahun dari tahun pertama sampai tahun sekarang
        const yearRange = [];
        for (let year = firstOrderYear; year <= currentYear; year++) {
            yearRange.push(year);
        }
        
        // Urutkan dari yang terbaru ke terlama
        return yearRange.reverse();
    }, [history]);

    // Fungsi untuk reset filter
    const resetFilters = () => {
        setSearchCustomer('');
        setFilterMonth('');
        setFilterYear('');
        setFilterStartDate('');
        setFilterEndDate('');
    };

    // Fungsi untuk membuat rekap
    const generateRekap = (type: 'monthly' | 'yearly', month?: number, year?: number) => {
        const filteredOrders = groupedOrders.filter(order => {
            const orderDate = new Date(order.order_date);
            if (type === 'monthly') {
                return orderDate.getMonth() + 1 === month && orderDate.getFullYear() === year;
            } else {
                return orderDate.getFullYear() === year;
            }
        });

        const totalTransaksi = filteredOrders.length;
        const totalPendapatan = filteredOrders.reduce((sum, order) => sum + order.price, 0);
        const totalPelanggan = new Set(filteredOrders.map(order => order.customer_name)).size;

        // Hitung item paling sering disewa
        const productCount: Record<string, number> = {};
        filteredOrders.forEach(order => {
            order.products.forEach(product => {
                productCount[product.name] = (productCount[product.name] || 0) + 1;
            });
        });

        const topProduct = Object.entries(productCount)
            .sort(([,a], [,b]) => b - a)[0];

        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        return {
            periode: type === 'monthly' 
                ? `${monthNames[(month || 1) - 1]} ${year}`
                : `${year}`,
            totalTransaksi,
            totalPendapatan,
            totalPelanggan,
            topProduct: topProduct ? `${topProduct[0]} (${topProduct[1]}x)` : 'Tidak ada data',
            orders: filteredOrders
        };
    };

    // Fungsi untuk cetak rekap
    const printRekap = (type: 'monthly' | 'yearly') => {
        const month = type === 'monthly' ? selectedMonth : undefined;
        const year = type === 'monthly' ? selectedMonthYear : selectedYear;
        const rekap = generateRekap(type, month, year);
        
        const printContent = `
            <html>
            <head>
                <title>Rekap Penyewaan ${type === 'monthly' ? 'Bulanan' : 'Tahunan'}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                    .summary-item { margin: 10px 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f8f9fa; }
                    .price { color: #16a34a; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Rekap Penyewaan ${type === 'monthly' ? 'Bulanan' : 'Tahunan'}</h1>
                    <p>Periode: ${rekap.periode}</p>
                    <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
                </div>
                
                <div class="summary">
                    <h3>Ringkasan</h3>
                    <div class="summary-item"><strong>Total Transaksi:</strong> ${rekap.totalTransaksi}</div>
                    <div class="summary-item"><strong>Total Pendapatan:</strong> Rp ${rekap.totalPendapatan.toLocaleString()}</div>
                    <div class="summary-item"><strong>Total Pelanggan:</strong> ${rekap.totalPelanggan}</div>
                    <div class="summary-item"><strong>Item Terpopuler:</strong> ${rekap.topProduct}</div>
                </div>

                <h3>Detail Transaksi</h3>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th>Pelanggan</th>
                            <th>Barang</th>
                            <th>Durasi</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rekap.orders.map((order, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td>${order.order_date}</td>
                                <td>${order.customer_name}</td>
                                <td>${order.products.map(p => p.name).join(', ')}</td>
                                <td>${order.day_rent} hari</td>
                                <td class="price">Rp ${order.price.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <StaffLayout title="Riwayat Penyewaan">
            <section className="mt-4 px-6 pb-12">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <History className="w-6 h-6 text-blue-600" />
                        Riwayat Penyewaan
                    </h1>
                    <p className="text-sm text-gray-600">
                        Semua data penyewaan yang telah selesai
                    </p>
                </div>

                {/* Filter Section */}
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            Filter Data
                        </h3>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Customer */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Cari Pelanggan</label>
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            value={searchCustomer}
                            onChange={(e) => setSearchCustomer(e.target.value)}
                            placeholder="Nama pelanggan..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        </div>
                    </div>

                    {/* Filter Month */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Bulan</label>
                        <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                        <option value="">Semua Bulan</option>
                        <option value="1">Januari</option>
                        <option value="2">Februari</option>
                        <option value="3">Maret</option>
                        <option value="4">April</option>
                        <option value="5">Mei</option>
                        <option value="6">Juni</option>
                        <option value="7">Juli</option>
                        <option value="8">Agustus</option>
                        <option value="9">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Desember</option>
                        </select>
                    </div>

                    {/* Filter Year */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tahun</label>
                        <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                        <option value="">Semua Tahun</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                        </select>
                    </div>

                    {/* Date Range Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Rentang Tanggal</label>
                        <div className="flex gap-2">
                        <input
                            type="date"
                            value={filterStartDate}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                            type="date"
                            value={filterEndDate}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        </div>
                    </div>
                    </div>


                    {/* Filter Summary */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <span>Menampilkan {filteredOrders.length} dari {groupedOrders.length} data</span>
                        {(searchCustomer || filterMonth || filterYear || filterStartDate || filterEndDate) && (
                            <span className="text-blue-600 font-medium">Filter aktif</span>
                        )}
                    </div>
                </div>

                {/* Rekap Section */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cetak Rekap</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rekap Bulanan */}
                <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Rekap Bulanan</label>
                <div className="flex gap-2">
                    <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                    <option value="1">Januari</option>
                    <option value="2">Februari</option>
                    <option value="3">Maret</option>
                    <option value="4">April</option>
                    <option value="5">Mei</option>
                    <option value="6">Juni</option>
                    <option value="7">Juli</option>
                    <option value="8">Agustus</option>
                    <option value="9">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                    </select>
                    <select
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(parseInt(e.target.value))}
                    className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                    {years.map((year) => (
                        <option key={year} value={year}>
                        {year}
                        </option>
                    ))}
                    </select>
                    <button
                    onClick={() => printRekap('monthly')}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 hover:opacity-90 transition-all"
                    >
                    <FileText className="w-4 h-4" />
                    Cetak
                    </button>
                </div>
                </div>

                {/* Rekap Tahunan */}
                <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Rekap Tahunan</label>
                <div className="flex gap-2">
                    <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                    {years.map((year) => (
                        <option key={year} value={year}>
                        {year}
                        </option>
                    ))}
                    </select>
                    <button
                    onClick={() => printRekap('yearly')}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 hover:opacity-90 transition-all"
                    >
                    <FileText className="w-4 h-4" />
                    Cetak
                    </button>
                </div>
                </div>
            </div>
            </div>


                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Nama Penyewa
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Barang Disewa
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tanggal Sewa
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Durasi
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Total Harga
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Kontak WA
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order, idx) => (
                                        <tr
                                            key={order.order_id}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">
                                                    {order.customer_name}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    {order.products.map((product, i) => (
                                                        <div key={i} className="bg-gray-50 rounded-md px-2 py-1">
                                                            <div className="font-medium text-sm text-gray-900 flex items-center gap-1">
                                                                <Package className="w-3 h-3 text-blue-500" />
                                                                {product.name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-700 text-sm flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-green-500" />
                                                    {order.order_date}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-700 text-sm flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-amber-500" />
                                                    {order.day_rent} hari
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-green-600 flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    Rp {order.price.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-gray-700 font-mono text-sm">
                                                    <Phone className="w-3 h-3 text-blue-500" />
                                                    {order.phone_number}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <History className="w-12 h-12 mb-4 text-gray-300" />
                                                <p className="text-lg font-medium">
                                                    {groupedOrders.length > 0 ? 'Tidak ada data yang sesuai dengan filter' : 'Tidak ada riwayat penyewaan'}
                                                </p>
                                                <p className="text-sm">
                                                    {groupedOrders.length > 0 ? 'Coba ubah kriteria filter' : 'Belum ada penyewaan yang selesai'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </StaffLayout>
    );
};

export default HistoryPenyewaan;