import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showAlert: boolean;
}

const DeleteBarangModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, showAlert }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-sm bg-black/80 z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-[400px] text-center shadow-lg relative">

        {/* Alert Box */}
        {showAlert && (
        <div 
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-500 text-red-700 px-5 py-3 rounded-lg flex items-center gap-3 shadow-lg animate-fadeInOut"
            role="alert"
        >
            <FaTrashAlt className="text-red-600 text-xl" />
            <span className="font-semibold">Data barang telah dihapus</span>
        </div>
        )}

        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
        >
          &times;
        </button>

        {/* Pesan */}
        <p className="text-lg font-semibold mb-6">
          Apakah Anda yakin ingin menghapus data ini ?
        </p>

        {/* Tombol */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-[#0F63D4] hover:bg-[#0c54b3] text-white px-6 py-2 rounded-md shadow transition duration-200 w-full"
          >
            Tidak
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow transition duration-200 w-full"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBarangModal;
