import AdminLayout from '@/layouts/admin_layout';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

interface Rental {
    order_detail_id: number; // UBAH dari id
    order_id: number;
    product_id: number;
    day_rent: number;
    due_on: string;
    status: 'disewakan' | 'dikembalikan';
}

interface Props {
    rentals: Rental[];
}

const RentalIndex: React.FC<Props> = ({ rentals }) => {
    const [rentalList, setRentalList] = useState(rentals);

    const handleReturn = (rentalId: number, newStatus: string) => {
        if (newStatus === 'dikembalikan') {
            if (window.confirm('Sudah dikembalikan?')) {
                router.patch(
                    `/staff/data_sewa/${rentalId}`,
                    { status: newStatus },
                    {
                        onSuccess: () => {
                            setRentalList((prev) => prev.filter((r) => r.order_detail_id !== rentalId));
                        },
                    },
                );
            }
        }
    };

    return (
        <AdminLayout title="Penyewaan Aktif">
            <table className="w-full border text-left">
                <thead className="bg-gray-500 text-white">
                    <tr>
                        <th className="p-2">Order ID</th>
                        <th>Product ID</th>
                        <th>Lama Sewa (hari)</th>
                        <th>Jatuh Tempo</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rentalList.map((rental) => (
                        <tr key={rental.order_detail_id} className="border-t">
                            <td className="p-2">{rental.order_id}</td>
                            <td>{rental.product_id}</td>
                            <td>{rental.day_rent}</td>
                            <td>{rental.due_on}</td>
                            <td>
                                <select
                                    value={rental.status}
                                    onChange={(e) => handleReturn(rental.order_detail_id, e.target.value)}
                                    className="rounded border p-1"
                                >
                                    <option value="disewakan">Disewakan</option>
                                    <option value="dikembalikan">Dikembalikan</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default RentalIndex;
