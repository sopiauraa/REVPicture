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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.product_name.trim()) {
      errors.product_name = 'Nama produk wajib diisi';
    }
    
    if (!formData.product_type) {
      errors.product_type = 'Kategori produk wajib dipilih';
    }
    
    if (!formData.brand && !formData.brandBaru.trim()) {
      errors.brand = 'Brand wajib dipilih atau diisi';
    }
    
    if (!formData.stock_available) {
      errors.stock_available = 'Stok wajib diisi';
    } else if (parseInt(formData.stock_available) < 0) {
      errors.stock_available = 'Stok tidak boleh negatif';
    }
    
    if (!formData.eight_hour_rent_price) {
      errors.eight_hour_rent_price = 'Harga sewa 8 jam wajib diisi';
    } else if (parseFloat(formData.eight_hour_rent_price) <= 0) {
      errors.eight_hour_rent_price = 'Harga sewa harus lebih dari 0';
    }
    
    if (!formData.twenty_four_hour_rent_price) {
      errors.twenty_four_hour_rent_price = 'Harga sewa 24 jam wajib diisi';
    } else if (parseFloat(formData.twenty_four_hour_rent_price) <= 0) {
      errors.twenty_four_hour_rent_price = 'Harga sewa harus lebih dari 0';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
    // Validate form first
    if (!validateForm()) {
      return;
    }

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
    setValidationErrors({});
  };

  // Reset form when modal closes
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden flex animate-in">
        {/* Kiri: Upload gambar */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 w-2/5 flex flex-col items-center justify-center p-6 border-r border-slate-200">
          <div className="w-full bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors duration-300 h-64 flex flex-col items-center justify-center relative overflow-hidden group">
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                  <span className="text-white text-sm font-medium">Klik untuk ganti gambar</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-700 mb-2">Unggah Gambar Produk</p>
                <p className="text-sm text-slate-500">Drag & drop atau klik untuk memilih</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG hingga 2MB</p>
              </div>
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
            className="mt-4 bg-white border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 hover:shadow-md text-sm font-semibold cursor-pointer transition-all duration-300 shadow-sm"
          >
            {imagePreview ? '📷 Ganti Gambar' : '📤 Pilih Gambar'}
          </label>
        </div>

        {/* Kanan: Form */}
        <div className="w-3/5 flex flex-col h-full">
          {/* Header - Fixed di atas */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Tambah Produk Baru</h2>
              <p className="text-sm text-slate-600 mt-1">Lengkapi informasi produk untuk rental</p>
            </div>
            <button 
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 flex items-center justify-center transition-colors duration-200 flex-shrink-0" 
              onClick={handleClose}
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Nama Produk *</label>
                  <input 
                    type="text" 
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className={`w-full border-2 ${validationErrors.product_name ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200`}
                    placeholder="Contoh: Canon EOS R5"
                  />
                  {validationErrors.product_name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.product_name}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Kategori Produk *</label>
                  <select 
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleInputChange}
                    className={`w-full border-2 ${validationErrors.product_type ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200`}
                  >
                    <option value="">Pilih kategori produk</option>
                    <option value="Camera">📷 Camera</option>
                    <option value="Lens">🔍 Lens</option>
                  </select>
                  {validationErrors.product_type && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.product_type}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Brand</label>
                  <select 
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={`w-full border-2 ${validationErrors.brand ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-500`}
                    disabled={!!formData.brandBaru}
                  >
                    <option value="">Pilih brand</option>
                    <option value="Canon">Canon</option>
                    <option value="Sony">Sony</option>
                    <option value="Nikon">Nikon</option>
                    <option value="Fujifilm">Fujifilm</option>
                    <option value="Lumix">Lumix</option>
                  </select>
                  {validationErrors.brand && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.brand}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Brand Baru</label>
                  <input
                    type="text"
                    name="brandBaru"
                    value={formData.brandBaru}
                    onChange={handleInputChange}
                    placeholder="Atau masukkan brand baru"
                    className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Jumlah Stok *</label>
                <input 
                  type="number" 
                  name="stock_available"
                  value={formData.stock_available}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full border-2 ${validationErrors.stock_available ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200`}
                  placeholder="0"
                />
                {validationErrors.stock_available && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.stock_available}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Harga Sewa 8 Jam *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                    <input 
                      type="number" 
                      name="eight_hour_rent_price"
                      value={formData.eight_hour_rent_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full border-2 ${validationErrors.eight_hour_rent_price ? 'border-red-300' : 'border-slate-200'} rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200`}
                      placeholder="0"
                    />
                  </div>
                  {validationErrors.eight_hour_rent_price && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.eight_hour_rent_price}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Harga Sewa 24 Jam *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                    <input 
                      type="number" 
                      name="twenty_four_hour_rent_price"
                      value={formData.twenty_four_hour_rent_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full border-2 ${validationErrors.twenty_four_hour_rent_price ? 'border-red-300' : 'border-slate-200'} rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200`}
                      placeholder="0"
                    />
                  </div>
                  {validationErrors.twenty_four_hour_rent_price && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.twenty_four_hour_rent_price}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Deskripsi Produk</label>
                <input 
                  type="text" 
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  placeholder="Tambahkan deskripsi detail tentang produk (opsional)"
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200" 
                />
              </div>
            </div>
          </div>

          {/* Footer - Fixed di bawah */}
          <div className="flex gap-4 px-6 py-4 border-t border-slate-200 bg-white">
            <button 
              type="button"
              onClick={handleClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Produk
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahBarangModal;