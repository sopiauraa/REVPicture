import React, { useState } from 'react';
import { router } from '@inertiajs/react';
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

interface Props {
  order: Order[];
}

const dummyOrders = [
  {
    order_id: 1,
    customer_name: "Iar",
    item_name: "Kamera DSLR",
    order_date: "2025-06-01",
    duration: "8 jam",
    price: 150000,
    contact_wa: "081234567890",
    status_dp: "belum_dibayar",
  },
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
];

const OrderIndex: React.FC<Props> = ({ order }) => {
  // const [orderList, setOrderList] = useState(order);
  const [orderList, setOrderList] = useState(dummyOrders);
  

  const handleStatusChange = (orderId: number, newStatus: string) => {
    if (newStatus === "sudah_dibayar") {
      if (window.confirm("Yakin sudah dibayar?")) {
        router.patch(
          `/admin/bookingmasuk/${orderId}`,
          { status_dp: newStatus },
          {
            onSuccess: () => {
              setOrderList((prev) =>
                prev.filter((order) => order.order_id !== orderId)
              );
            },
          }
        );
      }
    }
  };

  return (
    <AdminLayout title="Booking">
      <section className=" mt-4 px-6 pb-12">
        <div className="bg-white rounded-md shadow-md p-6 overflow-x-auto">
          <h3 className="font-semibold text-[14px] mb-4">Booking Terbaru</h3>
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
                <th className="py-3 px-4">Status DP</th>
                <th className="py-3 px-4 rounded-tr-md text-center">Aksi</th>
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
                  <td className="py-3 px-4">
                    {order.status_dp === "belum_dibayar" ? (
                      <span className="text-red-600 font-semibold">Belum Dibayar</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Sudah Dibayar</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="w-[80px] bg-[#0F63D4] hover:bg-[#0c54b3] text-white py-1 px-3 text-xs rounded text-center">
                        Terima
                      </button>
                      <button className="w-[80px] bg-[#EF4444] hover:bg-[#dc2626] text-white py-1 px-3 text-xs rounded text-center">
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

export default OrderIndex;
