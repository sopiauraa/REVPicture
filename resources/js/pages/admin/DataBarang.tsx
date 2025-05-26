import React, { useState } from 'react';
import AdminLayout from '@/layouts/admin_layout';
import { FaEdit, FaTrash } from 'react-icons/fa';
import TambahBarangModal from '@/components/TambahBarangModal';
import EditBarangModal from '@/components/EditBarangModal';
import DeleteBarangModal from "@/components/DeleteBarangModal";

const barangList = [
  {
    no: 1,
    gambar: 'img1',
    nama: 'Sony A7 Mark III',
    jenis: 'Kamera',
    brand: 'Sony',
    stock: 3,
    harga: 'Rp.240.000/8 ; Rp.480.000/24',
  },
  {
    no: 2,
    gambar: 'imgsrc2',
    nama: 'Sony AE Mark I',
    jenis: 'Kamera',
    brand: 'Sony',
    stock: 2,
    harga: 'Rp.240.000/8 ; Rp.480.000/24',
  },
  {
    no: 3,
    gambar: 'imgsrc2',
    nama: 'Sony AE Mark I',
    jenis: 'Kamera',
    brand: 'Sony',
    stock: 4,
    harga: 'Rp.240.000/8 ; Rp.480.000/24',
  },
  {
    no: 4,
    gambar: 'imgsrc2',
    nama: 'Canon 1',
    jenis: 'Kamera',
    brand: 'Canon',
    stock: 2,
    harga: 'Rp.140.000/8 ; Rp.280.000/24',
  },
];

const DataBarang = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [filterBrand, setFilterBrand] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleDelete = () => {
  setModalOpen(false);  //tutup modal dulu

  setTimeout(() => {
    setShowAlert(true);  //tampilkan alert setelah modal hilang

      setTimeout(() => {
        setShowAlert(false); //hilangkan alert setelah 3 detik
      }, 3000);

    }, 300); //delay 300ms supaya modal punya waktu hilang dulu
  };

  
  return (
    <AdminLayout title="Data Barang">
      <div className="px-6 py-4">
        {/* Filter dan Tambah */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <select
            className="bg-[#F9F9F9] hover:bg-[#D9D9D9]  px-6 py-3 rounded-md text-sm font-medium border border-gray-300 transition duration-150"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="">Filter berdasarkan brand</option>
            <option value="Sony">Sony</option>
            <option value="Canon">Canon</option>
            <option value="Nikon">Nikon</option>
            <option value="Fujifilm">Fujifilm</option>
            <option value="Lumix">Lumix</option>
            <option value="DjiOsmoPOcket">Dji Osmo POcket 3</option>
          </select>

          <select
            className="bg-[#eeeeee] hover:bg-[#D9D9D9]  px-6 py-3  rounded-md text-sm font-medium border border-gray-300 transition duration-150"
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
          >
            <option value="">Filter berdasarkan jenis</option>
            <option value="Kamera">Kamera</option>
            <option value="Lensa">Lensa</option>
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="ml-auto border border-[#0F63D4] text-[#0F63D4] hover:bg-[#0F63D4] hover:text-white transition px-5 py-2 rounded-md text-sm font-medium"
          >
            + tambah barang
          </button>
        </div>

        {/* Tabel Data Barang */}
        <div className="bg-white px-2 py-2 rounded-md shadow-md overflow-x-auto">
          <table className="min-w-full text-sm text-[#1f1e29] border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#D4D4D4] text-left">
                <th className="py-3 px-4 rounded-tl-md">No</th>
                <th className="py-3 px-4">Gambar</th>
                <th className="py-3 px-4">Nama Barang</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Harga Sewa (8/24 Jam)</th>
                <th className="py-3 px-4 rounded-tr-md">Action</th>
              </tr>
            </thead>
            <tbody>
              {barangList
                .filter((item) =>
                  (filterBrand ? item.brand === filterBrand : true) &&
                  (filterJenis ? item.jenis === filterJenis : true)
                )
                .map((barang, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-[#eeeeee]'
                    } rounded-md`}
                  >
                    <td className="py-3 px-4">{barang.no}</td>
                    <td className="py-3 px-4">{barang.gambar}</td>
                    <td className="py-3 px-4">{barang.nama}</td>
                    <td className="py-3 px-4">{barang.jenis}</td>
                    <td className="py-3 px-4">{barang.brand}</td>
                    <td className="py-3 px-4">{barang.stock}</td>
                    <td className="py-3 px-4">{barang.harga}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-[#0F63D4] hover:text-[#084fad]"
                          onClick={() => {
                            setSelectedBarang(barang);
                            setShowEdit(true);
                          }}
                        >
                          <FaEdit size={14} />
                        </button>
                        <button className="text-[#EF4444] hover:text-[#dc2626]"  onClick={() => setModalOpen(true)}>
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah */}
      <TambahBarangModal visible={showModal} onClose={() => setShowModal(false)} />
      
      {/* Modal Edit */}
      {selectedBarang && (
        <EditBarangModal
          visible={showEdit}
          onClose={() => setShowEdit(false)}
          data={selectedBarang}
        />
      )}

      {showAlert && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 z-[60] animate-fadeInDown">
          <FaTrash className="text-red-500 text-xl" />
          <span className="font-medium">Data barang berhasil dihapus.</span>
        </div>
      )}
      {/* Modal Delete */}
        <DeleteBarangModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDelete}
          showAlert={showAlert}  />
    </AdminLayout>
  );
};

export default DataBarang;
