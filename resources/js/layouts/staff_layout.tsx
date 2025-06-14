import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const staffNavItems = [
  { label: "Data Barang", icon: "fa-box", href: "/staff/data_barang" },
  { label: "Pesanan Masuk", icon: "fa-envelope-open-text", href: "/staff/data_booking" },
  { label: "Kalender Sewa", icon: "fa-calendar-alt", href: "/staff/kalender" },
  { label: "Data Penyewa", icon: "fa-users", href: "/staff/data_customer" },
  { label: "Data Penyewaan", icon: "fa-file-alt", href: "/staff/data_sewa" },
  { label: "Riwayat Penyewaan", icon: "fa-history", href: "/staff/history" },
  { label: "Profil", icon: "fa-id-badge", href: "/staff/staffprofil" },
];

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 mx-4 max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 rounded-t-2xl"></div>
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-red-50 to-rose-50 rounded-full opacity-60"></div>
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
            <i className="fas fa-sign-out-alt text-white text-2xl"></i>
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Logout</h3>
          <p className="text-gray-600 leading-relaxed">
            Apakah Anda yakin ingin keluar dari sistem staff? 
            <br />
            <span className="text-sm text-gray-500 mt-1 block">Anda perlu login kembali untuk mengakses panel staff.</span>
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-sm"
          >
            <i className="fas fa-times mr-2"></i>
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

interface StaffLayoutProps {
  title: string;
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ title, children }) => {
  const { url } = usePage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    router.post('/logout');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="flex bg-gray-50/30 min-h-screen text-sm text-gray-800 font-['Inter',sans-serif]">
      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />

      {/* Sidebar */}
      <aside className={`bg-white shadow-2xl border-r border-gray-100 ${sidebarCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col justify-between py-6 px-4 fixed top-0 left-0 bottom-0 transition-all duration-300 ease-in-out z-20 backdrop-blur-sm`}>
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
        
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <i className="fas fa-camera text-white text-lg drop-shadow-sm"></i>
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-gray-800 font-bold text-base tracking-wide block bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">REV PICTURE</span>
                <span className="text-gray-500 text-xs font-medium">Staff Panel</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {staffNavItems.map((item, idx) => {
              const isActive = url.startsWith(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 text-sm font-medium py-3.5 px-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]" 
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-sm"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {/* Background decoration for active item */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"></div>
                  )}
                  
                  <i className={`fas ${item.icon} text-base ${isActive ? 'text-white drop-shadow-sm' : 'text-gray-500 group-hover:text-blue-600'} transition-all duration-300 relative z-10`}></i>
                  {!sidebarCollapsed && (
                    <span className="truncate relative z-10">{item.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute right-4 w-2 h-2 bg-white/80 rounded-full shadow-sm animate-pulse"></div>
                  )}
                  
                  {/* Hover effect line */}
                  <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-blue-500 rounded-r transition-all duration-300 ${!isActive ? 'group-hover:h-8' : ''}`}></div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <button 
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-medium rounded-xl py-3.5 px-4 flex items-center gap-3 w-full justify-center transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] group"
            title={sidebarCollapsed ? "Keluar" : undefined}
          >
            <i className="fas fa-sign-out-alt text-base group-hover:animate-pulse"></i>
            {!sidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header/Navbar */}
        <header className="z-30 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
          {/* Decorative gradient line */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2.5 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars text-gray-600 group-hover:text-blue-600 transition-colors duration-200"></i>
            </button>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm bg-gray-50/50 px-3 py-2 rounded-lg">
              <span className="font-semibold text-gray-800">Staff</span>
              <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
              <span className="text-blue-600 font-medium">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* <button 
                className="p-2.5 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 relative group"
                title="Pengaturan"
              >
                <i className="fas fa-cog text-gray-600 text-lg group-hover:text-blue-600 transition-all duration-200 group-hover:rotate-90"></i>
              </button> */}
              
              {/* <button 
                className="p-2.5 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 relative group"
                title="Notifikasi"
              >
                <i className="fas fa-bell text-gray-600 text-lg group-hover:text-blue-600 transition-all duration-200 group-hover:animate-pulse"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                </span>
              </button> */}

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100 ml-2">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <i className="fas fa-user text-white text-xs drop-shadow-sm"></i>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-gray-800">Staff</div>
                  <div className="text-xs text-gray-500 font-medium">Staff Panel</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-full overflow-hidden relative">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-50/50 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
            
            {/* Content wrapper */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;