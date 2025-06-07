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
    <div className="fixed inset-0 backdrop-blur-sm bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden flex">
        {/* Gambar */}
        <div className="bg-[#f0f0f0] w-1/2 flex flex-col items-center justify-center p-6 border-r">
          <div className="w-full border-2 border-dashed border-gray-300 h-64 flex items-center justify-center rounded-lg">
            {gambarPreview ? (
              <img 
                src={gambarPreview} 
                alt="preview" 
                className="max-h-64 max-w-full object-contain rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
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
            disabled={isLoading}
          />
          <button
            className="mt-4 bg-[#0F63D4] text-white px-4 py-2 rounded hover:bg-[#0c54b3] text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {gambarFile ? 'Ganti Gambar Lagi' : 'Ganti Gambar'}
          </button>
          {errors.product_image && (
            <p className="text-red-500 text-xs mt-1">{errors.product_image}</p>
          )}
        </div>

        {/* Form */}
        <div className="w-1/2 p-6 space-y-4 relative">
          <button 
            className="absolute right-3 top-3 text-red-600 text-xl hover:text-red-800 disabled:opacity-50" 
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Barang</h3>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nama Barang</label>
            <input
              type="text"
              value={data?.product_name || ''}
              disabled
              className="w-full border rounded px-3 py-2 text-sm bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Jenis</label>
            <input
              type="text"
              value={data?.product_type || ''}
              disabled
              className="w-full border rounded px-3 py-2 text-sm bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              value={data?.brand || ''}
              disabled
              className="w-full border rounded px-3 py-2 text-sm bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={`w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F63D4] focus:border-transparent ${
                errors.stock ? 'border-red-500' : ''
              }`}
              min="0"
              disabled={isLoading}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Harga Sewa /8 jam</label>
              <input
                type="number"
                value={harga8}
                onChange={(e) => setHarga8(e.target.value)}
                className={`w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F63D4] focus:border-transparent ${
                  errors.eight_hour_rent_price ? 'border-red-500' : ''
                }`}
                min="1"
                disabled={isLoading}
              />
              {errors.eight_hour_rent_price && (
                <p className="text-red-500 text-xs mt-1">{errors.eight_hour_rent_price}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Harga Sewa /24 jam</label>
              <input
                type="number"
                value={harga24}
                onChange={(e) => setHarga24(e.target.value)}
                className={`w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F63D4] focus:border-transparent ${
                  errors.twenty_four_hour_rent_price ? 'border-red-500' : ''
                }`}
                min="1"
                disabled={isLoading}
              />
              {errors.twenty_four_hour_rent_price && (
                <p className="text-red-500 text-xs mt-1">{errors.twenty_four_hour_rent_price}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#0F63D4] hover:bg-[#0c54b3] text-white px-6 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBarangModal;