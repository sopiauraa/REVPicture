import React from 'react';
import AppLayout from '@/layouts/StaffSidebarLayout';

const StaffDataBarang: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-4 flex gap-2">
        <input type="text" placeholder="search nama" className="border px-2 py-1 rounded" />
        <input type="text" placeholder="search jenis" className="border px-2 py-1 rounded" />
        <input type="text" placeholder="search brand" className="border px-2 py-1 rounded" />
        <button className="ml-auto bg-blue-500 text-white px-4 py-1 rounded">+ Add row</button>
      </div>
      <table className="w-full text-left border">
        <thead className="bg-gray-500">
          <tr>
            <th className="p-2">No</th>
            <th>Gambar</th>
            <th>Nama Barang</th>
            <th>Jenis</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Harga Sewa (8/24 Jam)</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{i + 1}</td>
              <td><div className="w-10 h-10 bg-gray-300"></div></td>
              <td>Barang {i + 1}</td>
              <td>Jenis A</td>
              <td>Brand X</td>
              <td>10</td>
              <td>Rp 100.000 / Rp 150.000</td>
              <td>
                <button className="text-blue-500 mr-2">Edit</button>
                <button className="text-red-500">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppLayout>
  );
};

export default StaffDataBarang;
