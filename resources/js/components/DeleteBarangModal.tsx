import React, { useState, useEffect, useCallback } from "react";
import { FaTrashAlt, FaTimes, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

interface ProductDatabase {
  product_id: number;
  product_name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productData: { product_id: number; product_name?: string }) => Promise<void>;
  productData?: ProductDatabase | null;
  isLoading?: boolean;
}

const DeleteBarangModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  productData,
  isLoading = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading]);

  const handleConfirm = useCallback(async () => {
    if (!productData?.product_id) {
      setError("Product ID tidak ditemukan");
      return;
    }

    setError(null);

    try {
      await onConfirm({
        product_id: productData.product_id,
        product_name: productData.product_name
      });
      // Jangan close manual di sini, biar parent yang handle
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat menghapus produk';
      setError(errorMessage);
    }
  }, [productData, onConfirm]);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setError(null);
    onClose();
  }, [isLoading, onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  }, [isLoading, handleClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 
                 transition-all duration-300 animate-in fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-2xl 
                   relative transform transition-all duration-300 animate-in zoom-in-95 
                   border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                     transition-all duration-200 p-2 rounded-full hover:bg-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-gray-300"
          disabled={isLoading}
          aria-label="Tutup modal"
          type="button"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Warning Icon */}
        <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 
                        rounded-full flex items-center justify-center shadow-lg">
          <FaExclamationTriangle className="text-red-600 text-3xl animate-pulse" />
        </div>

        {/* Title */}
        <h3 
          id="modal-title"
          className="text-2xl font-bold text-gray-800 mb-3"
        >
          Konfirmasi Penghapusan
        </h3>

        {/* Message */}
        <div 
          id="modal-description"
          className="text-gray-600 mb-6 space-y-3"
        >
          <p className="text-lg">
            Apakah Anda yakin ingin menghapus produk 
            {productData?.product_name && (
              <span className="font-semibold text-gray-800 block mt-1">
                "{productData.product_name}"
              </span>
            )}?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 font-medium flex items-center justify-center gap-2">
              <FaTrashAlt className="text-sm" />
              Tindakan ini tidak dapat dibatalkan
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg 
                          animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-center gap-2">
              <FaExclamationTriangle className="text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3.5 
                       rounded-xl font-semibold transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                       focus:outline-none focus:ring-2 focus:ring-gray-300"
            type="button"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !productData?.product_id}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                       text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       flex items-center justify-center gap-2 
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       focus:outline-none focus:ring-2 focus:ring-red-300"
            type="button"
          >
            {isLoading ? (
              <>
                <FaSpinner className="text-sm animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <FaTrashAlt className="text-sm" />
                Hapus Produk
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        {productData?.product_id && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              ID Produk: <span className="font-mono">{productData.product_id}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteBarangModal;