import React from 'react';

interface EditBarangModalProps {
  visible: boolean;
  onClose: () => void;
  data: {
    nama: string;
    jenis: string;
    brand: string;
    gambar: string;
    stock: number;
    harga8: string;
    harga24: string;
  };
}

const EditBarangModal: React.FC<EditBarangModalProps> = ({ visible, onClose, data }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 backdrop-sm bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden flex">
        {/* Gambar */}
        <div className="bg-[#f0f0f0] w-1/2 flex flex-col items-center justify-center p-6 border-r">
          <div className="w-full border-2 border-dashed border-gray-300 h-64 flex flex-col items-center justify-center">
            <img src={data.gambar} alt="preview" className="h-full object-contain" />
          </div>
          <button className="mt-4 bg-[#0F63D4] text-white px-4 py-1 rounded hover:bg-[#0c54b3] text-sm font-medium shadow-md">
            ganti Gambar
          </button>
        </div>

        {/* Form */}
        <div className="w-1/2 p-6 space-y-4 relative">
          <button className="absolute right-3 top-3 text-red-600 text-sm" onClick={onClose}>
            <i className="fas fa-times-circle text-xl"></i>
          </button>

          <div>
            <label className="block mb-1 text-sm">Nama Barang</label>
            <input
              type="text"
              defaultValue={data.nama}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Jenis</label>
            <input
              type="text"
              value={data.jenis}
              disabled
              className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Brand</label>
            <input
              type="text"
              value={data.brand}
              disabled
              className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Stock</label>
            <input
              type="number"
              defaultValue={data.stock}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm">Harga Sewa /8 jam</label>
              <input
                type="text"
                defaultValue={data.harga8}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">/24 jam</label>
              <input
                type="text"
                defaultValue={data.harga24}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button className="bg-[#0F63D4] hover:bg-[#0c54b3] text-white px-5 py-2 mt-3 rounded text-sm font-medium">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBarangModal;
