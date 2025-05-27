import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const navItems = [
  { label: "Dashboard", icon: "fa-home", href: "/admin/dashboard" },
  { label: "Data Barang", icon: "fa-box", href: "/admin/databarang" },
  { label: "Booking Masuk", icon: "fa-envelope-open-text", href: "/admin/BookingMasuk" },
  { label: "Kalender Sewa", icon: "fa-calendar-alt", href: "/admin/kalender" },
  { label: "Data Penyewa", icon: "fa-users", href: "/admin/penyewa" },
  { label: "Data Penyewaan", icon: "fa-file-alt", href: "/admin/penyewaan" },
  { label: "Data Staff", icon: "fa-id-badge", href: "/admin/staff" },
  { label: "History penyewaan", icon: "fa-history", href: "/admin/history" },
];

interface AdminLayoutProps {
  title: string; // <- dari tiap page
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  const { url } = usePage();

  return (
    <div className="flex bg-[#F2F2F2] min-h-screen text-[13px] text-[#1a1a1a] font-[Inter,sans-serif]">
      {/* Sidebar */}
      <aside className="bg-[#1a1a1a] w-56 min-h-screen flex flex-col justify-between py-8 px-6 fixed top-0 left-0 bottom-0">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <img
              src="https://storage.googleapis.com/a1aa/image/99ecfc5a-41bc-4e1b-6949-dfa02ef6d22b.jpg"
              alt="REV logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-bold text-sm tracking-wide">REV PICTURE</span>
          </div>
          <nav className="flex flex-col gap-5">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 text-white text-[11px] font-semibold py-2 px-4 rounded-md transition duration-200 hover:bg-[#0F63D4] ${
                  url.startsWith(item.href) ? "bg-[#0F63D4]" : ""
                }`}
              >
                <i className={`fas ${item.icon} text-[14px]`}></i>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <button className="bg-[#6b6b6b] text-white text-[13px] font-semibold rounded-md py-2 px-4 flex items-center gap-2 w-full justify-center">
          <i className="fas fa-sign-out-alt"></i>Keluar
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col ml-56">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-[#F2F2F2] border-b border-[#d9d9d9] px-6 py-3 sticky top-0 z-10">
          <div className="text-[13px] font-semibold text-[#1a1a1a]">
            Admin<span className="font-normal italic">/{title}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                className="w-64 h-9 rounded-full border border-[#d9d9d9] bg-white pl-4 pr-10 text-[13px] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#a3a3a3]"
                placeholder="Cari ..."
                type="text"
              />
              <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-[14px]"></i>
            </div>
            <i className="fas fa-cog text-[#1a1a1a] text-[18px] hover:text-[#6b6b6b] cursor-pointer"></i>
            <i className="fas fa-bell text-[#1a1a1a] text-[18px] hover:text-[#6b6b6b] cursor-pointer"></i>
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
