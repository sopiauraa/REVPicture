import React from 'react';

interface TambahBarangModalProps {
  visible: boolean;
  onClose: () => void;
}

const TambahBarangModal: React.FC<TambahBarangModalProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 backdrop-sm bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden flex">
        {/* Kiri: Upload gambar */}
        <div className="bg-[#f0f0f0] w-1/2 flex flex-col items-center justify-center p-6 border-r">
          <div className="w-full border-2 border-dashed border-gray-300 h-64 flex flex-col items-center justify-center">
            <i className="fas fa-cloud-upload-alt text-4xl mb-2"></i>
            <p className="text-sm font-semibold">Unggah gambar</p>
          </div>
          <button className="mt-4 bg-white border border-[#0F63D4] text-[#0F63D4] px-4 py-1 rounded hover:bg-[#f9f9f9] text-sm font-medium">
            Unggah
          </button>
        </div>

        {/* Kanan: Form */}
        <div className="w-1/2 p-6 space-y-4 relative">
          <button className="absolute right-3 top-3 text-red-600 text-sm" onClick={onClose}>
            <i className="fas fa-times-circle text-xl"></i>
          </button>

          <div>
            <label className="block mb-1 text-sm">Nama Barang</label>
            <input type="text" className="w-full border rounded px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block mb-1 text-sm">Jenis</label>
            <select className="w-full border rounded px-3 py-2 text-sm">
                <option>Pilih Jenis</option>
                <option value="kamera">Kamera</option>
                <option value="lensa">Lensa</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm">Brand</label>
                <select className="w-full border rounded px-3 py-2 text-sm">
                <option value="">Pilih Brand</option>
                <option value="Canon">Canon</option>
                <option value="Sony">Sony</option>
                <option value="Nikon">Nikon</option>
                <option value="Fujifilm">Fujifilm</option>
                <option value="Lumix">Lumix</option>
                <option value="DjiOsmoPOcket">Dji Osmo POcket 3</option>
                </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm text-transparent">-</label>
              <input
                type="text"
                placeholder="brand baru"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Stock</label>
            <input type="number" className="w-full border rounded px-3 py-2 text-sm" />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm">Harga Sewa /8 jam</label>
              <input type="text" className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">/24 jam</label>
              <input type="text" className="w-full border rounded px-3 py-2 text-sm" />
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

export default TambahBarangModal;
