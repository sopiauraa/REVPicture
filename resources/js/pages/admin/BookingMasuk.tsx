import AdminLayout from '@/layouts/admin_layout';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Package, Calendar, Phone, CreditCard, Check, X } from 'lucide-react';

interface OrderItem {
    item_name: string;
    duration: string;
    price: number;
    quantity: number;
}

interface Order {
    order_id: number;
    customer_name: string;
    order_date: string;
    contact_wa: string;
    status_dp: 'belum_dibayar' | 'sudah_dibayar';
    items: OrderItem[];
}

interface Props {
    orders: Order[];
}

const OrderIndex: React.FC<Props> = ({ orders }) => {
    const [orderList, setOrderList] = useState(orders);

    const handleStatusChange = (orderId: number) => {
        if (window.confirm('Yakin sudah dibayar?')) {
            router.patch(
                `/admin/data_booking/${orderId}`,
                { status_dp: 'sudah_dibayar' },
                {
                    onSuccess: () => {
                        setOrderList((prev) => prev.filter((order) => order.order_id !== orderId));
                    },
                },
            );
        }
    };

    const handleDelete = (orderId: number) => {
        if (window.confirm('Yakin ingin menolak dan menghapus order ini?')) {
            router.delete(`/admin/data_booking/${orderId}`, {
                onSuccess: () => {
                    setOrderList((prev) => prev.filter((order) => order.order_id !== orderId));
                },
            });
        }
    };

    return (
        <AdminLayout title="Daftar Pesanan">
            <section className="mt-4 px-6 pb-12">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Daftar Pesanan</h1>
                    <p className="text-sm text-gray-600">
                        Kelola semua pesanan booking rental Anda
                    </p>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Nama Penyewa
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Barang & Durasi
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tanggal Sewa
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Total Harga
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Kontak WA
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status DP
                                    </th>
                                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orderList.length > 0 ? (
                                    orderList.map((order, idx) => (
                                        <tr
                                            key={order.order_id}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                                                    #{order.order_id}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">
                                                    {order.customer_name}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-2">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="bg-gray-50 rounded-md p-2">
                                                            <div className="font-medium text-sm text-gray-900">
                                                                {item.item_name}
                                                            </div>
                                                            <div className="text-xs text-gray-600 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {item.duration} • Qty: {item.quantity}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-700 text-sm">
                                                    {order.order_date}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-green-600">
                                                    Rp {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-gray-700 font-mono text-sm">
                                                    <Phone className="w-3 h-3" />
                                                    {order.contact_wa}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {order.status_dp === 'belum_dibayar' ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <CreditCard className="w-3 h-3 mr-1" />
                                                        Belum Dibayar
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CreditCard className="w-3 h-3 mr-1" />
                                                        Sudah Dibayar
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center gap-3">
                                                    {/* Tombol Terima dengan styling biru gradien */}
                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        onClick={() => handleStatusChange(order.order_id)}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Terima
                                                    </button>
                                                    
                                                    {/* Tombol Tolak dengan styling yang lebih bagus */}
                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-lg hover:from-rose-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                                        onClick={() => handleDelete(order.order_id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Tolak
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <Package className="w-12 h-12 mb-4 text-gray-300" />
                                                <p className="text-lg font-medium">Tidak ada pesanan</p>
                                                <p className="text-sm">Belum ada pesanan yang masuk</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
};

export default OrderIndex;