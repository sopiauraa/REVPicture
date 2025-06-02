import React, { useState } from 'react';
import AdminLayout from '@/layouts/admin_layout';

interface Order {
  order_id: number;
  customer_name: string;
  item_name: string;
  order_date: string;
  duration: string;
  price: number;
  contact_wa: string;
  status_dp: "belum_dibayar" | "sudah_dibayar";
}

const dummyOrders: Order[] = [
  {
    order_id: 2,
    customer_name: "Iar",
    item_name: "kamera",
    order_date: "2025-06-02",
    duration: "24 jam",
    price: 800000,
    contact_wa: "081234567890",
    status_dp: "sudah_dibayar",
  },
  {
    order_id: 3,
    customer_name: "Rika",
    item_name: "Drone",
    order_date: "2025-06-01",
    duration: "12 jam",
    price: 350000,
    contact_wa: "081245678901",
    status_dp: "sudah_dibayar",
  },
];

const HistoryPenyewaan: React.FC = () => {
  const [orderList, setOrderList] = useState(dummyOrders);

  return (
    <AdminLayout title="Riwayat Penyewaan">
      <section className="mt-4 px-6 pb-12">
        <div className="bg-white rounded-md shadow-md p-6 overflow-x-auto">
          <h3 className="font-semibold text-[14px] mb-4">Riwayat Penyewaan</h3>
          <table className="w-full text-[13px] text-[#1f1e29] border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#d3d3d3] text-left">
                <th className="py-3 px-4 rounded-tl-md">No</th>
                <th className="py-3 px-4">Nama Penyewa</th>
                <th className="py-3 px-4">Barang Disewa</th>
                <th className="py-3 px-4">Tanggal Sewa</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Kontak WA</th>
                {/* <th className="py-3 px-4 rounded-tr-md">Status DP</th> */}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {orderList.map((order, idx) => (
                <tr
                  key={order.order_id}
                  className={`${
                    idx % 2 === 0 ? "bg-[#f5f5f5]" : "bg-white"
                  } rounded-md`}
                >
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">{order.customer_name}</td>
                  <td className="py-3 px-4">{order.item_name}</td>
                  <td className="py-3 px-4">{order.order_date}</td>
                  <td className="py-3 px-4">{order.duration}</td>
                  <td className="py-3 px-4">Rp {order.price.toLocaleString()}</td>
                  <td className="py-3 px-4">{order.contact_wa}</td>
                  {/* <td className="py-3 px-4 text-green-600 font-semibold">Sudah Dibayar</td> */}
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
