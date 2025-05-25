import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import StaffLayout from '@/layouts/staff_layout';


interface Order {
  order_id: number;
  customer_id: number;
  order_date: string;
  status_dp: 'belum_dibayar' | 'sudah_dibayar';
}

interface Props {
  order: Order[];
}

const OrderIndex: React.FC<Props> = ({ order }) => {
  const [orderList, setorderList] = useState(order);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    if (newStatus === 'sudah_dibayar') {
      if (window.confirm('Yakin sudah dibayar?')) {
        router.patch(`/staff/data_booking/${orderId}`, { status_dp: newStatus }, {
          onSuccess: () => {
            setorderList(prev => prev.filter(order => order.order_id !== orderId));
          },
        });
      }
    }
  };

  return (
    <StaffLayout title="Data order">
      <table className="w-full text-left border">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="p-2">Order ID</th>
            <th>Customer ID</th>
            <th>Tanggal Order</th>
            <th>Status_dp</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map(order => (
            <tr key={order.order_id} className="border-t">
              <td className="p-2">{order.order_id}</td>
              <td>{order.customer_id}</td>
              <td>{order.order_date}</td>
              <td>
                <select
                  value={order.status_dp}
                  onChange={e => handleStatusChange(order.order_id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="belum_dibayar">Belum Dibayar</option>
                  <option value="sudah_dibayar">Sudah Dibayar</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </StaffLayout>
  );
};

export default OrderIndex;
