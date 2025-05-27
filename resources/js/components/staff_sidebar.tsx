import React from 'react';

const StaffSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4 space-y-4">
      <div className="text-xl font-bold">Staff</div>
      <nav className="space-y-2">
        <a href="data_barang" className="block text-gray-700 font-semibold">Data Barang</a>
        <a href="data_booking" className="block text-gray-700">Booking Masuk</a>
        <a href="#" className="block text-gray-700">Kalender Sewa</a>
        <a href="data_customer" className="block text-gray-700">Data Penyewa</a>
        <a href="data_sewa" className="block text-gray-700">Penyewaan Aktif</a>
        <a href="#" className="block text-gray-700">Transaksi Pembayaran</a>
      </nav>
    </aside>
  );
};

export default StaffSidebar;
