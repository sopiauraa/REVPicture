export function StaffSidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-4 space-y-4">
      <div className="text-xl font-bold">Staff</div>
      <nav className="space-y-2">
        <a href="#" className="block text-gray-700 font-semibold">Dashboard</a>
        <a href="#" className="block text-green-600 font-semibold bg-green-50 p-2 rounded">Data Barang</a>
        <a href="#" className="block text-gray-700">Data Staff</a>
        <a href="#" className="block text-gray-700">Booking Masuk</a>
        <a href="#" className="block text-gray-700">Kalender Sewa</a>
        <a href="#" className="block text-gray-700">Data Penyewa</a>
        <a href="#" className="block text-gray-700">Penyewaan Aktif</a>
        <a href="#" className="block text-gray-700">Transaksi Pembayaran</a>
      </nav>
    </aside>
  );
}
