import AdminLayout from '@/layouts/admin_layout';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

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
    items: OrderItem[]; // new structure
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
        <AdminLayout title=" Daftar pesanan">
            <section className="mt-4 px-6 pb-12">
                <div className="overflow-x-auto rounded-md bg-white p-6 shadow-md">
                    <h3 className="mb-4 text-[14px] font-semibold">Daftar Pesanan</h3>
                    <table className="w-full border-separate border-spacing-y-2 text-[13px] text-[#1f1e29]">
                        <thead>
                            <tr className="bg-[#d3d3d3] text-left">
                                <th className="rounded-tl-md px-4 py-3">No</th>
                                <th className="px-4 py-3">Nama Penyewa</th>
                                <th className="px-4 py-3">Barang Disewa</th>
                                <th className="px-4 py-3">Tanggal Sewa</th>
                                <th className="px-4 py-3">Durasi</th>
                                <th className="px-4 py-3">Harga</th>
                                <th className="px-4 py-3">Kontak WA</th>
                                <th className="px-4 py-3">Status DP</th>
                                <th className="rounded-tr-md px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            {orderList.map((order, idx) => (
                                <tr key={order.order_id} className={`${idx % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} rounded-md`}>
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">{order.customer_name}</td>
                                    <td className="px-4 py-3">
                                        {order.items.map((item, i) => (
                                            <div key={i}>{item.item_name}</div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3">{order.order_date}</td>
                                    <td className="px-4 py-3">
                                        {order.items.map((item, i) => (
                                            <div key={i}>{item.duration}</div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-green-700">
                                        Rp {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                                    </td>

                                    <td className="px-4 py-3">{order.contact_wa}</td>
                                    <td className="px-4 py-3">
                                        {order.status_dp === 'belum_dibayar' ? (
                                            <span className="font-semibold text-red-600">Belum Dibayar</span>
                                        ) : (
                                            <span className="font-semibold text-green-600">Sudah Dibayar</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="w-[80px] rounded bg-[#0F63D4] px-3 py-1 text-center text-xs text-white hover:bg-[#0c54b3]"
                                                onClick={() => handleStatusChange(order.order_id)}
                                            >
                                                Terima
                                            </button>
                                            <button
                                                className="w-[80px] rounded bg-[#EF4444] px-3 py-1 text-center text-xs text-white hover:bg-[#dc2626]"
                                                onClick={() => handleDelete(order.order_id)}
                                            >
                                                Tolak
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orderList.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="py-4 text-center text-gray-500">
                                        Tidak ada data order
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </AdminLayout>
    );
};

export default OrderIndex;
