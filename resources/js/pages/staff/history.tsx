import StaffLayout from '@/layouts/staff_layout';
import { usePage } from '@inertiajs/react';
import React from 'react';
import { Package, Calendar, Phone, Clock, History, DollarSign } from 'lucide-react';

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
                                {groupedOrders.length > 0 ? (
                                    groupedOrders.map((order, idx) => (
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
                                                <p className="text-lg font-medium">Tidak ada riwayat penyewaan</p>
                                                <p className="text-sm">Belum ada penyewaan yang selesai</p>
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