import { useState } from 'react';
import { Search } from "lucide-react";

const Navbar = () => {
  const [brandOpen, setBrandOpen] = useState(false);
  const [akunOpen, setAkunOpen] = useState(false);
  const [jenisOpen, setJenisOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = () => {
    console.log("Mencari:", searchTerm);
  };

  return (
    <header className="shadow-md">
      {/* Header atas */}
      <div className="bg-[#3a372f] text-white px-5 py-5 text-sm font-bold uppercase">
        <div className="flex justify-between items-center flex-wrap gap-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="https://storage.googleapis.com/a1aa/image/4a12e656-92bc-4900-add9-ca7382b68109.jpg"
              alt="Logo REV PICTURE"
              className="w-10 h-10 object-contain rounded-md"
            />
            <span className="text-white font-semibold text-base">REV PICTURE</span>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-md mx-auto md:mr-9">
            <input
              type="search"
              placeholder="Cari produk..."
              className="w-full rounded-xl bg-white text-black py-2.5 pl-7 pr-9 text-sm outline-none shadow-md focus:ring-2 ring-black-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Hamburger menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          {/* Menu atas kanan */}
          <div className={`flex-col md:flex md:flex-row items-center gap-5 text-sm ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
            <a href="#" className="flex items-center gap-1 hover:text-yellow-400 transition">
              <i className="fas fa-home" /> BERANDA
            </a>

            {/* Dropdown AKUN */}
            <div
              className="relative"
              onMouseEnter={() => setAkunOpen(true)}
              
            >
              <div className="flex items-center gap-1 cursor-pointer hover:text-yellow-400 transition">
                <i className="fas fa-user" /> AKUN
              </div>

              {akunOpen && (
                <div className="absolute left-0 mt-2 w-32 bg-[#3a372f] rounded shadow-md text-left z-50 animate-fadeIn" onMouseLeave={() => setAkunOpen(false)}>
                  <div className="px-4 py-2 hover:bg-[#2e2c27] cursor-pointer transition">Login</div>
                  <div className="px-4 py-2 hover:bg-[#2e2c27] cursor-pointer transition">Register</div>
                </div>
              )}
            </div>

            <a href="#" className="flex items-center gap-1 hover:text-yellow-400 transition">
              <i className="fas fa-shopping-cart" /> KERANJANG
            </a>
          </div>
        </div>
      </div>

      {/* Menu bawah */}
      <nav className="bg-[#7f7a73] text-white font-bold text-sm py-5 z-10 relative">
        <div className="flex justify-center gap-10 max-w-6xl mx-auto flex-wrap">
          {/* Dropdown Brand */}
          <div
            className="relative"
            onMouseEnter={() => setBrandOpen(true)}
            
          >
            <div className="cursor-pointer flex items-center gap-1 hover:text-yellow-300 transition">
              Brand <i className="fas fa-chevron-down text-xs"></i>
            </div>
            {brandOpen && (
              <div className="absolute bg-[#7f7a73] rounded-b-md shadow-md w-40 mt-2 z-20 animate-fadeIn" onMouseLeave={() => setBrandOpen(false)}>
                {['Sony', 'Canon', 'Lumix', 'Fujifilm', 'Nikon'].map((brand, i) => (
                  <div key={i} className="px-4 py-2 hover:bg-[#6b675f] cursor-pointer transition">
                    {brand}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Menu statis */}
          {['Kamera', 'Lensa', 'Paket Rev Picture', 'Penting Dibaca'].map((item, i) => (
            <div key={i} className="cursor-pointer hover:text-yellow-300 transition">
              {item}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
