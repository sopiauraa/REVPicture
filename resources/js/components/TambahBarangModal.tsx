import React, { useState } from 'react';

interface TambahBarangModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void; 
}


const TambahBarangModal: React.FC<TambahBarangModalProps> = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    namaBarang: '',
    jenis: '',
    brand: '',
    brandBaru: '',
    stock: '',
    harga8jam: '',
    harga24jam: ''
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleSubmit = async () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Append form data
      submitData.append('namaBarang', formData.namaBarang);
      submitData.append('jenis', formData.jenis);
      
      // Use brandBaru if filled, otherwise use selected brand
      const brandToUse = formData.brandBaru.trim() || formData.brand;
      submitData.append('brand', brandToUse);
      
      submitData.append('stock', formData.stock);
      submitData.append('harga8jam', formData.harga8jam);
      submitData.append('harga24jam', formData.harga24jam);
      
      // Append image if selected
      if (selectedImage) {
        submitData.append('product_image', selectedImage);
      }

      // Send to Laravel backend
      const response = await fetch('/admin/product/store', {
        method: 'POST',
        body: submitData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan produk');
      }

      const result = await response.json();
      
      // Reset form
      setFormData({
        namaBarang: '',
        jenis: '',
        brand: '',
        brandBaru: '',
        stock: '',
        harga8jam: '',
        harga24jam: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
      
      // Call success callback and close modal
      onSuccess?.();
      onClose();
      
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setFormData({
      namaBarang: '',
      jenis: '',
      brand: '',
      brandBaru: '',
      stock: '',
      harga8jam: '',
      harga24jam: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden flex">
        {/* Kiri: Upload gambar */}
        <div className="bg-[#f0f0f0] w-1/2 flex flex-col items-center justify-center p-6 border-r">
          <div className="w-full border-2 border-dashed border-gray-300 h-64 flex flex-col items-center justify-center relative overflow-hidden">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm font-semibold">Unggah gambar</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="mt-4 bg-white border border-[#0F63D4] text-[#0F63D4] px-4 py-1 rounded hover:bg-[#f9f9f9] text-sm font-medium cursor-pointer"
          >
            {imagePreview ? 'Ganti Gambar' : 'Unggah'}
          </label>
        </div>

        {/* Kanan: Form */}
        <div className="w-1/2 p-6 space-y-4 relative">
          <button 
            className="absolute right-3 top-3 text-red-600 text-sm hover:text-red-800" 
            onClick={handleClose}
            type="button"
          >
            <span className="text-xl">✕</span>
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Nama Barang *</label>
              <input 
                type="text" 
                name="namaBarang"
                value={formData.namaBarang}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]" 
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Jenis *</label>
              <select 
                name="jenis"
                value={formData.jenis}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]"
                required
              >
                <option value="">Pilih Jenis</option>
                <option value="camera">Kamera</option>
                <option value="lens">Lensa</option>
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Brand</label>
                <select 
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]"
                  disabled={!!formData.brandBaru}
                >
                  <option value="">Pilih Brand</option>
                  <option value="Canon">Canon</option>
                  <option value="Sony">Sony</option>
                  <option value="Nikon">Nikon</option>
                  <option value="Fujifilm">Fujifilm</option>
                  <option value="Lumix">Lumix</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Brand Baru</label>
                <input
                  type="text"
                  name="brandBaru"
                  value={formData.brandBaru}
                  onChange={handleInputChange}
                  placeholder="Atau tulis brand baru"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Stock *</label>
              <input 
                type="number" 
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]" 
                required
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Harga Sewa /8 jam *</label>
                <input 
                  type="number" 
                  name="harga8jam"
                  value={formData.harga8jam}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]" 
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Harga /24 jam *</label>
                <input 
                  type="number" 
                  name="harga24jam"
                  value={formData.harga24jam}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]" 
                  required
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.namaBarang || !formData.jenis || (!formData.brand && !formData.brandBaru) || !formData.stock || !formData.harga8jam || !formData.harga24jam}
              className="bg-[#0F63D4] hover:bg-[#0c54b3] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-2 mt-3 rounded text-sm font-medium w-full"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahBarangModal;