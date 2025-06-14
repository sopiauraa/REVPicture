import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface Product {
    product_id: number;
    product_name: string;
    product_type: string;
    product_image: string;
    brand: string;
    eight_hour_rent_price: number;
    twenty_four_hour_rent_price: number;
    stock?: { stock_available: number };
}

interface EditBarangModalProps {
  visible: boolean;
  onClose: () => void;
  data: Product;
  onSuccess?: () => void;
}

const EditBarangModal: React.FC<EditBarangModalProps> = ({ visible, onClose, data, onSuccess }) => {
  const [gambarPreview, setGambarPreview] = useState<string>('');
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [stock, setStock] = useState<string>('');
  const [harga8, setHarga8] = useState<string>('');
  const [harga24, setHarga24] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk reset semua state
  const resetAllState = () => {
    setGambarPreview('');
    setGambarFile(null);
    setStock('');
    setHarga8('');
    setHarga24('');
    setErrors({});
    setIsLoading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (visible && data) {
      // Reset dulu semua state
      resetAllState();
      
      // Set data baru
      if (data.product_image) {
        const imagePath = data.product_image.startsWith('/') ? data.product_image : `/${data.product_image}`;
        setGambarPreview(imagePath);
      }
      
      setStock(data.stock?.stock_available?.toString() || '0');
      setHarga8(data.eight_hour_rent_price?.toString() || '');
      setHarga24(data.twenty_four_hour_rent_price?.toString() || '');
    } else if (!visible) {
      resetAllState();
    }
  }, [visible, data]);

  if (!visible) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Clear error gambar
    if (errors.product_image) {
      const newErrors = { ...errors };
      delete newErrors.product_image;
      setErrors(newErrors);
    }
    
    if (file) {
      // Validasi ukuran file
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, product_image: 'Ukuran file maksimal 2MB' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, product_image: 'Format file harus JPEG, PNG, JPG, atau GIF' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setGambarFile(file);
      setGambarPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!stock || parseInt(stock) < 0) {
      newErrors.stock = 'Stock harus diisi dan tidak boleh negatif';
    }
    
    if (!harga8 || parseInt(harga8) <= 0) {
      newErrors.eight_hour_rent_price = 'Harga 8 jam harus diisi dan lebih dari 0';
    }
    
    if (!harga24 || parseInt(harga24) <= 0) {
      newErrors.twenty_four_hour_rent_price = 'Harga 24 jam harus diisi dan lebih dari 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!data || !validateForm() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('stock', stock);
      formData.append('eight_hour_rent_price', harga8);
      formData.append('twenty_four_hour_rent_price', harga24);
      formData.append('_method', 'PUT');
      
      if (gambarFile) {
        formData.append('product_image', gambarFile);
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        formData.append('_token', csrfToken);
      }

      const response = await fetch(`/admin/product/update/${data.product_id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok) {
        // Reset state dan tutup modal
        resetAllState();
        onClose();
        
        // Reload data
        router.reload({ only: ['products'] });
        
        // Panggil callback success
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 100);
        }
      } else {
        // Handle error
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message || 'Terjadi kesalahan saat update.' });
        }
      }

    } catch (error) {
      console.error('Error updating product:', error);
      setErrors({ general: 'Terjadi kesalahan sistem. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetAllState();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden flex animate-in">
        {/* Kiri: Upload gambar */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 w-2/5 flex flex-col items-center justify-center p-6 border-r border-slate-200">
          <div className="w-full bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors duration-300 h-64 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            {gambarPreview ? (
              <div className="relative w-full h-full">
                <img 
                  src={gambarPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
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
                <p className="text-base font-semibold text-slate-700 mb-2">Gambar Produk</p>
                <p className="text-sm text-slate-500">Klik untuk ganti gambar</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG hingga 2MB</p>
              </div>
            )}
          </div>
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isLoading}
          />
          
          <button
            className="mt-4 bg-white border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 hover:shadow-md text-sm font-semibold cursor-pointer transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {gambarFile ? '📷 Ganti Gambar Lagi' : '📷 Ganti Gambar'}
          </button>
          
          {errors.product_image && (
            <p className="text-red-500 text-xs mt-2 text-center">{errors.product_image}</p>
          )}
        </div>

        {/* Kanan: Form */}
        <div className="w-3/5 flex flex-col h-full">
          {/* Header - Fixed di atas */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Edit Produk</h2>
              <p className="text-sm text-slate-600 mt-1">Perbarui informasi produk rental</p>
            </div>
            <button 
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 flex items-center justify-center transition-colors duration-200 flex-shrink-0 disabled:opacity-50" 
              onClick={handleClose}
              disabled={isLoading}
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
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Readonly Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Nama Produk</label>
                  <input
                    type="text"
                    value={data?.product_name || ''}
                    disabled
                    className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Kategori Produk</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={data?.product_type ? `${data.product_type === 'Camera' ? '📷' : '🔍'} ${data.product_type}` : ''}
                      disabled
                      className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Brand</label>
                <input
                  type="text"
                  value={data?.brand || ''}
                  disabled
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Editable Fields */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Jumlah Stok *</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={`w-full border-2 ${errors.stock ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200`}
                  min="0"
                  disabled={isLoading}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Harga Sewa 8 Jam *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                    <input
                      type="number"
                      value={harga8}
                      onChange={(e) => setHarga8(e.target.value)}
                      className={`w-full border-2 ${errors.eight_hour_rent_price ? 'border-red-300' : 'border-slate-200'} rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200`}
                      min="1"
                      disabled={isLoading}
                      placeholder="0"
                    />
                  </div>
                  {errors.eight_hour_rent_price && (
                    <p className="text-red-500 text-xs mt-1">{errors.eight_hour_rent_price}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-semibold text-slate-700">Harga Sewa 24 Jam *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                    <input
                      type="number"
                      value={harga24}
                      onChange={(e) => setHarga24(e.target.value)}
                      className={`w-full border-2 ${errors.twenty_four_hour_rent_price ? 'border-red-300' : 'border-slate-200'} rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200`}
                      min="1"
                      disabled={isLoading}
                      placeholder="0"
                    />
                  </div>
                  {errors.twenty_four_hour_rent_price && (
                    <p className="text-red-500 text-xs mt-1">{errors.twenty_four_hour_rent_price}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed di bawah */}
          <div className="flex gap-4 px-6 py-4 border-t border-slate-200 bg-white">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
            >
              {isLoading ? (
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
                  Perbarui Produk
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBarangModal;