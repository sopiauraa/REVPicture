import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const navItems = [
  { label: "Dashboard", icon: "fa-home", href: "/admin/dashboard" },
  { label: "Data Barang", icon: "fa-box", href: "/admin/databarang" },
  { label: "Booking Masuk", icon: "fa-envelope-open-text", href: "/admin/bookingmasuk" },
  { label: "Kalender Sewa", icon: "fa-calendar-alt", href: "/admin/kalender" },
  { label: "Data Penyewa", icon: "fa-users", href: "/admin/datacustomer" },
  { label: "Data Penyewaan", icon: "fa-file-alt", href: "/admin/datapenyewaan" },
  { label: "Riwayat Penyewaan", icon: "fa-history", href: "/admin/history" },
  { label: "Manajemen User", icon: "fa-id-badge", href: "/admin/usermanagement" },
];

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  const { url } = usePage();
  const [search, setSearch] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== '') {
      router.get('/search', { q: search });
    }
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      router.post('/logout');
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-sm text-gray-800 font-['Inter',sans-serif]">
      {/* Sidebar */}
      <aside className={`bg-white shadow-xl border-r border-gray-200 ${sidebarCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col justify-between py-6 px-4 fixed top-0 left-0 bottom-0 transition-all duration-300 ease-in-out z-20`}>
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
              <i className="fas fa-camera text-white text-lg"></i>
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-gray-800 font-bold text-base tracking-wide block">REV PICTURE</span>
                <span className="text-gray-500 text-xs">Admin Panel</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item, idx) => {
              const isActive = url.startsWith(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 text-sm font-medium py-3 px-3 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <i className={`fas ${item.icon} text-base ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`}></i>
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-xl py-3 px-3 flex items-center gap-3 w-full justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
            title={sidebarCollapsed ? "Keluar" : undefined}
          >
            <i className="fas fa-sign-out-alt text-base"></i>
            {!sidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header/Navbar */}
        <header className="flex items-center justify-between bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-800">Admin</span>
              <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
              <span className="text-gray-600 font-medium">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  className="w-80 h-10 rounded-xl border border-gray-300 bg-white pl-4 pr-12 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Cari data, booking, atau penyewa..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1"
                  aria-label="Search"
                >
                  <i className="fas fa-search text-sm"></i>
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative group"
                title="Pengaturan"
              >
                <i className="fas fa-cog text-gray-600 text-lg group-hover:text-blue-600 transition-colors"></i>
              </button>
              
              <button 
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative group"
                title="Notifikasi"
              >
                <i className="fas fa-bell text-gray-600 text-lg group-hover:text-blue-600 transition-colors"></i>
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-white text-xs"></i>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-800">Admin</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;