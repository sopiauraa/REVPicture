import React, { useState } from 'react';
import Stafflayout from '@/layouts/staff_layout';
import { usePage } from '@inertiajs/react';

interface Order {
  order_id: number;
  customer_name: string;
  product_name: string;  // samakan dengan backend
  order_date: string;
  day_rent: number | string;  // sesuaikan tipe sesuai database, bisa number atau string
  price: number;
  phone_number: string;
}


const HistoryPenyewaan: React.FC = () => {
  const page = usePage();

  const history = page.props.history as Order[];
  return (
    <Stafflayout title="Riwayat Penyewaan">
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
                {history.map((order, idx) => (
                  <tr
                    key={order.order_id}
                    className={`${idx % 2 === 0 ? "bg-[#f5f5f5]" : "bg-white"} rounded-md`}
                  >
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4">{order.customer_name}</td>
                    <td className="py-3 px-4">{order.product_name}</td>
                    <td className="py-3 px-4">{order.order_date}</td>
                    <td className="py-3 px-4">{order.day_rent} hari</td>
                    <td className="py-3 px-4">Rp {order.price.toLocaleString()}</td>
                    <td className="py-3 px-4">{order.phone_number}</td>
                  </tr>
                ))}

            </tbody>
          </table>
        </div>
      </section>
    </Stafflayout>
  );
};

export default HistoryPenyewaan;
