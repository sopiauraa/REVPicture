import React, { useState } from 'react';

interface TambahBarangModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void; 
}

const TambahBarangModal: React.FC<TambahBarangModalProps> = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: '',
    brand: '',
    brandBaru: '',
    stock_available: '',
    eight_hour_rent_price: '',
    twenty_four_hour_rent_price: '',
    product_description: ''
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

  // Function untuk kompres gambar
const compressImage = (file: File, maxSizeKB: number = 2000): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Hitung ukuran baru dengan mempertahankan aspect ratio
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Mulai dengan quality 0.8, turunkan sampai ukuran sesuai
      let quality = 0.8;
      
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (blob) {
            const sizeKB = blob.size / 1024;
            
            if (sizeKB <= maxSizeKB || quality <= 0.1) {
              // Buat File object baru dengan nama yang sama
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          }
        }, 'image/jpeg', quality);
      };
      
      tryCompress();
    };
    
    img.src = URL.createObjectURL(file);
  });
};

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      const fileSizeKB = file.size / 1024;
      
      let processedFile = file;
      
      // Jika file lebih dari 2MB, kompres
      if (fileSizeKB > 2000) {
        try {
          setLoading(true);
          processedFile = await compressImage(file, 1900); // Target 1.9MB untuk safety margin
          console.log(`File compressed from ${fileSizeKB.toFixed(2)}KB to ${(processedFile.size / 1024).toFixed(2)}KB`);
        } catch (error) {
          console.error('Error compressing image:', error);
          setError('Gagal mengkompres gambar. Silakan coba gambar lain.');
          setLoading(false);
          return;
        } finally {
          setLoading(false);
        }
      }
      
      setSelectedImage(processedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(processedFile);
    }
  };

  // Submit form
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Append form data dengan nama field yang benar
      submitData.append('product_name', formData.product_name);
      submitData.append('product_type', formData.product_type);
      
      // Use brandBaru if filled, otherwise use selected brand
      const brandToUse = formData.brandBaru.trim() || formData.brand;
      submitData.append('brand', brandToUse);
      
      submitData.append('stock_available', formData.stock_available);
      submitData.append('eight_hour_rent_price', formData.eight_hour_rent_price);
      submitData.append('twenty_four_hour_rent_price', formData.twenty_four_hour_rent_price);
      submitData.append('product_description', formData.product_description);
      
      // Append image if selected
      if (selectedImage) {
        submitData.append('product_image', selectedImage);
      }

      // Get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // Send to Laravel backend - sesuaikan dengan route yang benar
      const response = await fetch('/admin/product/store', {
        method: 'POST',
        body: submitData,
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Reset form
      resetForm();
      
      // Call success callback and close modal
      onSuccess?.();
      onClose();
      
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      product_name: '',
      product_type: '',
      brand: '',
      brandBaru: '',
      stock_available: '',
      eight_hour_rent_price: '',
      twenty_four_hour_rent_price: '',
      product_description: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
  };

  // Reset form when modal closes
  const handleClose = () => {
    resetForm();
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
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]" 
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Jenis *</label>
              <select 
                name="product_type"
                value={formData.product_type}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]"
                required
              >
                <option value="">Pilih Jenis</option>
                <option value="Camera">Camera</option>
                <option value="Lens">Lens</option>
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
                name="stock_available"
                value={formData.stock_available}
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
                  name="eight_hour_rent_price"
                  value={formData.eight_hour_rent_price}
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
                  name="twenty_four_hour_rent_price"
                  value={formData.twenty_four_hour_rent_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Deskripsi Produk</label>
              <input 
                type="text" 
                name="product_description"
                value={formData.product_description}
                onChange={handleInputChange}
                placeholder="Opsional"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F63D4]" 
              />
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.product_name || !formData.product_type || (!formData.brand && !formData.brandBaru) || !formData.stock_available || !formData.eight_hour_rent_price || !formData.twenty_four_hour_rent_price}
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