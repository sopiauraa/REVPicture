import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaTimes, FaExclamationTriangle } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: number) => Promise<void>;
  productId?: number;
  productName?: string;
  showAlert?: boolean;
  isLoading?: boolean;
}

const DeleteBarangModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  productId,
  productName,
  showAlert = false,
  isLoading = false 
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showAlert) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setInternalLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!productId) {
      setError("Product ID tidak ditemukan");
      return;
    }

    setInternalLoading(true);
    setError(null);

    try {
      await onConfirm(productId);
      // Modal akan ditutup oleh parent component setelah sukses
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Gagal menghapus produk');
    } finally {
      setInternalLoading(false);
    }
  };

  const handleClose = () => {
    if (internalLoading || isLoading) return; // Prevent closing during loading
    setAlertVisible(false);
    setError(null);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !internalLoading && !isLoading) {
      handleClose();
    }
  };

  const isProcessing = internalLoading || isLoading;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
        onClick={handleBackdropClick}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-2xl relative transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={isProcessing}
            aria-label="Tutup modal"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Warning Icon */}
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Konfirmasi Penghapusan
          </h3>

          {/* Message */}
          <div className="text-gray-600 mb-6 space-y-2">
            <p>
              Apakah Anda yakin ingin menghapus produk 
              {productName && (
                <span className="font-semibold text-gray-800"> "{productName}"</span>
              )}?
            </p>
            <p className="text-sm">
              <span className="text-red-600 font-medium flex items-center justify-center gap-1">
                <FaTrashAlt className="text-xs" />
                Tindakan ini tidak dapat dibatalkan
              </span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || !productId}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-sm"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menghapus...
                </>
              ) : (
                <>
                  <FaTrashAlt className="text-sm" />
                  Hapus Data
                </>
              )}
            </button>
          </div>

          {/* Additional Info */}
          {productId && (
            <p className="text-xs text-gray-400 mt-3">
              ID Produk: {productId}
            </p>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {alertVisible && (
        <div className="fixed top-4 right-4 z-[70] transform transition-all duration-300 animate-in slide-in-from-right">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold">Berhasil Dihapus!</p>
              <p className="text-sm">
                {productName ? `Produk "${productName}" telah dihapus` : 'Data produk telah berhasil dihapus'}
              </p>
            </div>
            <button
              onClick={() => setAlertVisible(false)}
              className="text-green-600 hover:text-green-800 p-1"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteBarangModal;