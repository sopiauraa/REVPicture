import AdminLayout from '@/layouts/admin_layout';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

interface Order {
    order_id: number;
    customer_name: string;
    product_name: string;
    day_rent: string;
    due_on: string;
    duration: string;
    phone_number: string;
    status: 'terkonfirmasi' | 'selesai';
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

    // Hapus order
    const handleDelete = (orderId: number) => {
        if (window.confirm('Yakin ingin menolak dan menghapus order ini?')) {
            router.delete(`/admin/datapenyewaan/${orderId}`, {
                onSuccess: () => {
                    setOrderList((prev) => prev.filter((order) => order.order_id !== orderId));
                },
            });
        }
    };

    return (
        <AdminLayout title="Penyewaan">
            <section className="mt-4 px-6 pb-12">
                <div className="overflow-x-auto rounded-md bg-white p-6 shadow-md">
                    <h3 className="mb-4 text-[14px] font-semibold">Data Penyewaan Aktif</h3>
                    <table className="w-full border-separate border-spacing-y-2 text-[13px] text-[#1f1e29]">
                        <thead>
                            <tr className="bg-[#d3d3d3] text-left">
                                <th className="rounded-tl-md px-4 py-3">No</th>
                                <th className="px-4 py-3">Nama Penyewa</th>
                                <th className="px-4 py-3">Barang Disewa</th>
                                <th className="px-4 py-3">Tgl Ambil</th>
                                <th className="px-4 py-3">Tgl Kembali</th>
                                <th className="px-4 py-3">Durasi</th>
                                <th className="px-4 py-3">Kontak WA</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="rounded-tr-md px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            {orderList.map((order, idx) => (
                                <tr key={order.order_id} className={`${idx % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} rounded-md`}>
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">{order.customer_name}</td>
                                    <td className="px-4 py-3">{order.product_name}</td>
                                    <td className="px-4 py-3">{order.day_rent}</td>
                                    <td className="px-4 py-3">{order.due_on}</td>
                                    <td className="px-4 py-3">{order.duration}</td>
                                    <td className="px-4 py-3">{order.phone_number}</td>
                                    <td className="px-4 py-3">
                                        {order.status === 'terkonfirmasi' ? (
                                            <span className="font-semibold text-red-600">Belum Dikembalikan</span>
                                        ) : (
                                            <span className="font-semibold text-green-600">Sudah Dikembalikan</span>
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
                        </tbody>
                    </table>
                </div>
            </section>
        </AdminLayout>
    );
};

export default PenyewaanIndex;
