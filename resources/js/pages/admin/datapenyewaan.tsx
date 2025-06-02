import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin_layout';

interface Rental {
  rental_id: number;
  customer_name: string;
  item_name: string;
  pickup_date: string;
  return_date: string;
  duration: string;
  contact_wa: string;
  status_return: 'belum_dikembalikan' | 'sudah_dikembalikan';
}

interface Props {
  rentals: Rental[];
}

const dummyRentals: Rental[] = [
  {
    rental_id: 1,
    customer_name: 'Ilham',
    item_name: 'Kamera DSLR',
    pickup_date: '2025-06-01',
    return_date: '2025-06-02',
    duration: '24 jam',
    contact_wa: '081234567890',
    status_return: 'belum_dikembalikan',
  },
  {
    rental_id: 2,
    customer_name: 'Nadia',
    item_name: 'Tripod',
    pickup_date: '2025-06-03',
    return_date: '2025-06-04',
    duration: '1 hari',
    contact_wa: '082345678901',
    status_return: 'belum_dikembalikan',
  },
];

const PenyewaanIndex: React.FC<Props> = ({ rentals }) => {
  const [rentalList, setRentalList] = useState(dummyRentals);

  const handleReturn = (rentalId: number) => {
    if (window.confirm('Barang sudah dikembalikan?')) {
      router.patch(
        `/admin/penyewaan/${rentalId}`,
        { status_return: 'sudah_dikembalikan' },
        {
          onSuccess: () => {
            setRentalList((prev) =>
              prev.filter((rental) => rental.rental_id !== rentalId)
            );
          },
        }
      );
    }
  };

  return (
    <AdminLayout title="Penyewaan">
      <section className="mt-4 px-6 pb-12">
        <div className="bg-white rounded-md shadow-md p-6 overflow-x-auto">
          <h3 className="font-semibold text-[14px] mb-4">Data Penyewaan Aktif</h3>
          <table className="w-full text-[13px] text-[#1f1e29] border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#d3d3d3] text-left">
                <th className="py-3 px-4 rounded-tl-md">No</th>
                <th className="py-3 px-4">Nama Penyewa</th>
                <th className="py-3 px-4">Barang Disewa</th>
                <th className="py-3 px-4">Tgl Ambil</th>
                <th className="py-3 px-4">Tgl Kembali</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Kontak WA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-tr-md text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {rentalList.map((rental, idx) => (
                <tr
                  key={rental.rental_id}
                  className={`${
                    idx % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'
                  } rounded-md`}
                >
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">{rental.customer_name}</td>
                  <td className="py-3 px-4">{rental.item_name}</td>
                  <td className="py-3 px-4">{rental.pickup_date}</td>
                  <td className="py-3 px-4">{rental.return_date}</td>
                  <td className="py-3 px-4">{rental.duration}</td>
                  <td className="py-3 px-4">{rental.contact_wa}</td>
                  <td className="py-3 px-4">
                    {rental.status_return === 'belum_dikembalikan' ? (
                      <span className="text-red-600 font-semibold">Belum Dikembalikan</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Sudah Dikembalikan</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {rental.status_return === 'belum_dikembalikan' && (
                      <button
                        onClick={() => handleReturn(rental.rental_id)}
                        className="w-[90px] bg-[#0F63D4] hover:bg-[#0c54b3] text-white py-1 px-3 text-xs rounded"
                      >
                        Selesai
                      </button>
                    )}
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

export default PenyewaanIndex;
