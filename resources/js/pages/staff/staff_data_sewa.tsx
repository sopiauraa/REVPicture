import StaffLayout from '@/layouts/staff_layout';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Package, Calendar, Phone, Clock, CheckCircle, Check } from 'lucide-react';

interface OrderDetail {
    product_name: string;
    day_rent: string;
    due_on: string;
    duration: string;
}

interface Order {
    order_id: number;
    customer_name: string;
    phone_number: string;
    status: 'terkonfirmasi' | 'selesai';
    details: OrderDetail[];
}

interface Props {
    orders: Order[];
}

const PenyewaanIndex: React.FC<Props> = ({ orders }) => {
    const [orderList, setOrderList] = useState<Order[]>(orders);

    // Update status order menjadi 'selesai'
    const handleStatusChange = (orderId: number) => {
        if (window.confirm('Yakin sudah dikembalikan?')) {
            router.patch(
                `/admin/datapenyewaan/${orderId}`,
                { status: 'selesai' },
                {
                    onSuccess: () => {
                        setOrderList((prev) => prev.filter((order) => order.order_id !== orderId));
                    },
                },
            );
        }
    };

    return (
        <StaffLayout title="Penyewaan">
            <section className="mt-4 px-6 pb-12">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Penyewaan Aktif</h1>
                    <p className="text-sm text-gray-600">
                        Kelola semua penyewaan yang sedang berlangsung
                    </p>
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
                                        Tanggal Rental
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tanggal Kembali
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Durasi
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Kontak WA
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
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
                                                    {order.details.map((detail, i) => (
                                                        <div key={i} className="bg-gray-50 rounded-md px-2 py-1">
                                                            <div className="font-medium text-sm text-gray-900 flex items-center gap-1">
                                                                <Package className="w-3 h-3" />
                                                                {detail.product_name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-700 text-sm flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {order.details[0]?.day_rent ?? '-'}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-700 text-sm flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-red-500" />
                                                    {order.details[0]?.due_on ?? '-'}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-700 text-sm flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {order.details[0]?.duration ?? '-'}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-gray-700 font-mono text-sm">
                                                    <Phone className="w-3 h-3" />
                                                    {order.phone_number}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {order.status === 'terkonfirmasi' ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Belum Dikembalikan
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Sudah Dikembalikan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center">
                                                    {/* Tombol Terima dengan styling konsisten */}
                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        onClick={() => handleStatusChange(order.order_id)}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Terima
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <Package className="w-12 h-12 mb-4 text-gray-300" />
                                                <p className="text-lg font-medium">Tidak ada penyewaan aktif</p>
                                                <p className="text-sm">Belum ada penyewaan yang sedang berlangsung</p>
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

export default PenyewaanIndex;