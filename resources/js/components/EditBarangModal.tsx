import React, { useState, useRef, useEffect } from 'react';

interface EditBarangModalProps {
  visible: boolean;
  onClose: () => void;
  data: {
    namaBarang: string;
    jenis: string;
    brand: string;
    brandBaru: string;
    stock: string;
    harga8jam: string;
    harga24jam: string;
    gambar: string;
  };
}

const EditBarangModal: React.FC<EditBarangModalProps> = ({ visible, onClose, data }) => {
  const [gambarPreview, setGambarPreview] = useState<string>(data.gambar);
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [stock, setStock] = useState(data.stock);
  const [harga8, setHarga8] = useState(data.harga8jam);
  const [harga24, setHarga24] = useState(data.harga24jam);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
     if (data.gambar) {
    // Asumsikan folder gambar adalah 'products/lensa' atau 'products/camera'
    const folder = data.jenis === 'lensa' ? 'lensa' : 'camera';
    setGambarPreview(`/products/${folder}/${data.gambar}`);
  } else {
    setGambarPreview('');
  }
    setGambarFile(null);
    setStock(data.stock || '');
    setHarga8(data.harga8jam || '');
    setHarga24(data.harga24jam || '');
  }, [data]);


  if (!visible) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGambarFile(file);
      setGambarPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('stock', stock);
    formData.append('harga8jam', harga8);
    formData.append('harga24jam', harga24);
    if (gambarFile) {
      formData.append('product_image', gambarFile);
    }


    console.log('Submit data:', { stock, harga8, harga24, gambarFile });
    onClose(); // Close modal setelah submit (atau setelah response sukses)
  };

  return (
    <div className="fixed inset-0 backdrop-sm bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden flex">
        {/* Gambar */}
          <div className="bg-[#f0f0f0] w-1/2 flex flex-col items-center justify-center p-6 border-r">
            <div className="w-full border-2 border-dashed border-gray-300 h-64 flex items-center justify-center">
              {gambarPreview ? (
                <img src={gambarPreview} alt="preview" className="max-h-64 max-w-full object-contain" />
              ) : (
                <p className="text-gray-400">Belum ada gambar</p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              className="mt-4 bg-[#0F63D4] text-white px-4 py-1 rounded hover:bg-[#0c54b3] text-sm font-medium shadow-md"
              onClick={() => fileInputRef.current?.click()}
            >
              Ganti Gambar
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
              value={data.namaBarang}
              disabled
              className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
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
              value={stock || ''}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm">Harga Sewa /8 jam</label>
              <input
                type="text"
                value={harga8}
                onChange={(e) => setHarga8(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">/24 jam</label>
              <input
                type="text"
                value={harga24}
                onChange={(e) => setHarga24(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#0F63D4] hover:bg-[#0c54b3] text-white px-5 py-2 mt-3 rounded text-sm font-medium"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBarangModal;
