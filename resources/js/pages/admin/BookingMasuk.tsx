import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import StaffLayout from '@/layouts/admin_layout';


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

// import React, { useEffect, useRef } from 'react';
// import AdminLayout from '@/layouts/admin_layout';
// import { usePage } from '@inertiajs/react';

// <AdminLayout title="Booking">
//      {/* Table */}
//       <section className="px-6 pb-12">
//         <div className="bg-white rounded-md shadow-md p-6 overflow-x-auto">
//           <h3 className="font-semibold text-[14px] mb-4">Booking Terbaru</h3>
//           <table className="w-full text-[13px] text-[#1f1e29] border-separate border-spacing-y-2">
//             <thead>
//               <tr className="bg-[#d3d3d3] text-left">
//                 <th className="py-3 px-4 rounded-tl-md">Nama Customer</th>
//                 <th className="py-3 px-4">Kamera</th>
//                 <th className="py-3 px-4">Durasi</th>
//                 <th className="py-3 px-4">Tanggal Booking</th>
//                 <th className="py-3 px-4 rounded-tr-md text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-[13px]">
//               {[...Array(4)].map((_, idx) => (
//                 <tr key={idx} className={`${idx % 2 === 0 ? "bg-[#f5f5f5]" : "bg-white"} rounded-md`}>
//                   <td className="py-3 px-4">Bima Arya</td>
//                   <td className="py-3 px-4 font-semibold">Canon M50</td>
//                   <td className="py-3 px-4">24 jam</td>
//                   <td className="py-3 px-4">25 Mei 2025</td>
//                   <td className="py-3 px-4">
//                     <div className="flex justify-center gap-2">
//                       <button className="w-[80px] bg-[#0F63D4] hover:bg-[#0c54b3] text-white py-1 px-3 text-xs rounded text-center">
//                         Terima
//                       </button>
//                       <button className="w-[80px] bg-[#EF4444] hover:bg-[#dc2626] text-white py-1 px-3 text-xs rounded text-center">
//                         Tolak
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
// </AdminLayout>