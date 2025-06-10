import AdminLayout from '@/layouts/admin_layout';
import { usePage } from '@inertiajs/react';
import React from 'react';

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
        <AdminLayout title="Riwayat Penyewaan">
            <section className="mt-4 px-6 pb-12">
                <div className="overflow-x-auto rounded-md bg-white p-6 shadow-md">
                    <h3 className="mb-4 text-[14px] font-semibold">Riwayat Penyewaan</h3>
                    <table className="w-full border-separate border-spacing-y-2 text-[13px] text-[#1f1e29]">
                        <thead>
                            <tr className="bg-[#d3d3d3] text-left">
                                <th className="rounded-tl-md px-4 py-3">No</th>
                                <th className="px-4 py-3">Nama Penyewa</th>
                                <th className="px-4 py-3">Barang Disewa</th>
                                <th className="px-4 py-3">Tanggal Sewa</th>
                                <th className="px-4 py-3">Durasi</th>
                                <th className="px-4 py-3">Harga</th>
                                <th className="rounded-tr-md px-4 py-3">Kontak WA</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px]">
                            {groupedOrders.map((order, idx) => (
                                <tr key={order.order_id} className={`${idx % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} rounded-md`}>
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">{order.customer_name}</td>
                                    <td className="px-4 py-3">
                                        {order.products.map((p, i) => (
                                            <div key={i}>• {p.name}</div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3">{order.order_date}</td>
                                    <td className="px-4 py-3">{order.day_rent} hari</td>
                                    <td className="px-4 py-3">Rp {order.price.toLocaleString()}</td>

                                    <td className="px-4 py-3">{order.phone_number}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </AdminLayout>
    );
};

export default HistoryPenyewaan;
