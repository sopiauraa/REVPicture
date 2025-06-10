import { Link, usePage } from '@inertiajs/react';
import { Search, ShoppingCart, Menu, X, ChevronDown, Home, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from './CartContext';
import TermsModal from './TermsModal'; // Import modal

type Product = {
    product_id: number;
    product_name: string;
    product_description: string;
    brand: string;
    product_image: string;
    eight_hour_rent_price: number;
    twenty_four_hour_rent_price: number;
};

type CartItem = {
    product: Product;
    quantity: number;
};

type Props = {
    cart: CartItem[];
    setShowCart: (show: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    setBrandFilter: (brand: string) => void;
    setTypeFilter: (type: 'camera' | 'lens' | '') => void;
    currentBrandFilter?: string;
    currentTypeFilter?: 'camera' | 'lens' | '';
};

const Navbar = ({ 
    cart, 
    setShowCart, 
    searchTerm, 
    setSearchTerm, 
    setBrandFilter, 
    setTypeFilter,
    currentBrandFilter = '',
    currentTypeFilter = ''
}: Props) => {
    const { user, url } = usePage().props.auth as { user?: { name: string }; url?: string };
    const [brandOpen, setBrandOpen] = useState(false);
    const [akunOpen, setAkunOpen] = useState(false);
    const [jenisOpen, setJenisOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { clearCart } = useCart();

    // Deteksi halaman saat ini
    const currentPath = usePage().url;
    const isTermsPage = currentPath === '/syarat' || currentPath.includes('/syarat');

    const handleSearch = () => {
        console.log('Mencari:', searchTerm);
    };

    const handleLogout = () => {
        clearCart();
        window.location.href = '/logout';
    };

    // Handler untuk membuka modal syarat & ketentuan
    const handleTermsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsTermsModalOpen(true);
        setMobileNavOpen(false); // Close mobile nav when opening modal
    };

    // Handler untuk menutup modal
    const handleCloseTermsModal = () => {
        setIsTermsModalOpen(false);
    };

    const brands = ['Sony', 'Canon', 'Lumix', 'Fujifilm', 'Nikon'];
    const cartItemCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);

    // Function untuk menentukan text yang ditampilkan di dropdown brand
    const getBrandDisplayText = () => {
        if (!currentBrandFilter || currentBrandFilter === '') {
            return 'Brands';
        }
        return currentBrandFilter;
    };

    const handleBrandSelect = (brand: string) => {
        console.log('Brand clicked:', brand);
        setBrandFilter(brand);
        setBrandOpen(false);
        setMobileNavOpen(false); // Close mobile nav after selection
    };

    // Handle type filter dengan toggle logic
    const handleTypeFilter = (type: 'camera' | 'lens' | '') => {
        if (currentTypeFilter === type) {
            setTypeFilter('');
        } else {
            setTypeFilter(type);
        }
        setMobileNavOpen(false); // Close mobile nav after selection
    };

    // Helper function untuk styling active state
    const getTypeFilterClass = (type: 'camera' | 'lens' | '') => {
        const baseClass = "px-3 py-2 font-medium transition-all duration-200 rounded-md";
        
        if (isTermsPage) {
            return `${baseClass} text-gray-700 hover:text-slate-800 hover:bg-gray-100`;
        }
        
        if (currentTypeFilter === type && type !== '') {
            return `${baseClass} bg-slate-800 text-white shadow-md transform scale-105`;
        } else if (type === '' && currentTypeFilter === '') {
            return `${baseClass} bg-slate-800 text-white shadow-md transform scale-105`;
        } else {
            return `${baseClass} text-gray-700 hover:text-slate-800 hover:bg-gray-100`;
        }
    };

    // Mobile version of type filter class
    const getMobileTypeFilterClass = (type: 'camera' | 'lens' | '') => {
        const baseClass = "w-full text-left px-4 py-3 font-medium transition-all duration-200 rounded-lg";
        
        if (currentTypeFilter === type && type !== '') {
            return `${baseClass} bg-slate-800 text-white`;
        } else if (type === '' && currentTypeFilter === '') {
            return `${baseClass} bg-slate-800 text-white`;
        } else {
            return `${baseClass} text-gray-700 hover:bg-gray-50`;
        }
    };

    // Helper function untuk styling brand items
    const getBrandItemClass = (brand: string) => {
        const baseClass = "w-full text-left px-4 py-2 transition-all duration-200 font-medium";
        
        if (currentBrandFilter === brand) {
            return `${baseClass} bg-slate-800 text-white`;
        } else {
            return `${baseClass} text-gray-700 hover:bg-gray-50`;
        }
    };

    // Mobile brand item class
    const getMobileBrandItemClass = (brand: string) => {
        const baseClass = "w-full text-left px-4 py-3 transition-all duration-200 font-medium rounded-lg";
        
        if (currentBrandFilter === brand) {
            return `${baseClass} bg-slate-800 text-white`;
        } else {
            return `${baseClass} text-gray-700 hover:bg-gray-50`;
        }
    };

    // Helper function untuk styling Terms & Conditions button
    const getTermsButtonClass = () => {
        const baseClass = "px-3 py-2 font-medium transition-all duration-200 rounded-md cursor-pointer";
        
        if (isTermsModalOpen) {
            return `${baseClass} bg-slate-800 text-white shadow-md transform scale-105`;
        } else {
            return `${baseClass} text-gray-700 hover:text-slate-800 hover:bg-gray-100`;
        }
    };

    // Close mobile menu when clicking outside
    const closeMobileMenus = () => {
        setMenuOpen(false);
        setMobileNavOpen(false);
        setAkunOpen(false);
        setBrandOpen(false);
    };

    return (
        <>
            <header className="bg-white shadow-md border-b border-gray-200 relative z-40">
                {/* Main Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo - Responsive */}
                        <div className="flex items-center space-x-2 sm:space-x-4 group min-w-0 flex-shrink-0">
                            <div className="relative">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                                            <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
                                            <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full bg-gradient-to-br from-gray-100 to-gray-300"></div>
                                            <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full bg-slate-700"></div>
                                            <div className="absolute top-3 left-3 right-3 bottom-3 rounded-full bg-white opacity-20"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h1 className="text-lg sm:text-2xl font-serif font-bold text-slate-800 tracking-wide group-hover:text-slate-600 transition-colors duration-300 truncate">
                                    REV PICTURE
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 font-light tracking-wider uppercase hidden sm:block">
                                    Camera Rental Professional
                                </p>
                            </div>
                        </div>

                        {/* Search Bar - Desktop Only */}
                        <div className="hidden lg:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full group">
                                <input
                                    type="search"
                                    placeholder="cari produk..."
                                    className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:border-slate-500 focus:bg-white focus:ring-1 focus:ring-slate-200 transition-all duration-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-slate-600 transition-colors duration-300" />
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors duration-300 text-sm font-medium"
                                >
                                    Cari
                                </button>
                            </div>
                        </div>

                        {/* Right Menu */}
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center space-x-1">
                                <Link 
                                    href="/" 
                                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                                >
                                    <Home className="h-4 w-4" />
                                    <span>Beranda</span>
                                </Link>

                                {/* Account Menu */}
                                <div className="relative">
                                    <button
                                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                                        onClick={() => setAkunOpen(!akunOpen)}
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="hidden xl:inline">{user?.name || 'Account'}</span>
                                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${akunOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {akunOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            {user ? (
                                                <>
                                                    <Link 
                                                        href="/profil" 
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                        onClick={() => setAkunOpen(false)}
                                                    >
                                                        Profil
                                                    </Link>
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                        onClick={handleLogout}
                                                    >
                                                        Keluar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <Link 
                                                        href="/login" 
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        Masuk
                                                    </Link>
                                                    <Link 
                                                        href="/register" 
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-t border-gray-100"
                                                    >
                                                        Daftar
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cart Button - Responsive */}
                            <Link 
                                href="/keranjang" 
                                className="relative bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center space-x-1 sm:space-x-2 font-medium text-sm sm:text-base"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <span className="hidden sm:inline">Keranjang</span>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="lg:hidden p-2 text-gray-700 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            >
                                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className={`lg:hidden mt-3 ${menuOpen ? 'block' : 'hidden'}`}>
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="cari produk..."
                                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:border-slate-500 focus:bg-white transition-all duration-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors duration-300 text-sm"
                            >
                                Cari
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`lg:hidden mt-3 space-y-2 ${menuOpen ? 'block' : 'hidden'}`}>
                        <Link 
                            href="/" 
                            className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            onClick={() => setMenuOpen(false)}
                        >
                            <Home className="h-4 w-4" />
                            <span>Beranda</span>
                        </Link>
                        
                        {/* Mobile Navigation Toggle */}
                        <button
                            onClick={() => setMobileNavOpen(!mobileNavOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                            <span>Filter & Navigasi</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileNavOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Mobile Terms Button */}
                        <button
                            onClick={handleTermsClick}
                            className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left"
                        >
                            <span>Syarat & Ketentuan</span>
                        </button>
                        
                        {!user ? (
                            <>
                                <Link 
                                    href="/login" 
                                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Masuk
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Daftar
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    href="/profil" 
                                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Profil
                                </Link>
                                <button
                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    onClick={handleLogout}
                                >
                                    Keluar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Filters */}
                <div className={`lg:hidden bg-slate-50 border-t border-gray-200 ${mobileNavOpen ? 'block' : 'hidden'}`}>
                    <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
                        {/* Mobile Brand Filter */}
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-2">Brand</p>
                            <div className="space-y-1">
                                <button
                                    className={getMobileBrandItemClass('')}
                                    onClick={() => handleBrandSelect('')}
                                >
                                    Semua Brand
                                    {currentBrandFilter === '' && (
                                        <span className="float-right text-green-400">✓</span>
                                    )}
                                </button>
                                {brands.map((brand, i) => (
                                    <button
                                        key={i}
                                        className={getMobileBrandItemClass(brand)}
                                        onClick={() => handleBrandSelect(brand)}
                                    >
                                        {brand}
                                        {currentBrandFilter === brand && (
                                            <span className="float-right text-green-400">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Type Filter */}
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-2">Kategori</p>
                            <div className="space-y-1">
                                <button
                                    className={getMobileTypeFilterClass('')}
                                    onClick={() => handleTypeFilter('')}
                                >
                                    Semua Produk
                                    {currentTypeFilter === '' && (
                                        <span className="float-right text-green-300">●</span>
                                    )}
                                </button>
                                <button
                                    className={getMobileTypeFilterClass('camera')}
                                    onClick={() => handleTypeFilter('camera')}
                                >
                                    Kamera
                                    {currentTypeFilter === 'camera' && (
                                        <span className="float-right text-green-300">●</span>
                                    )}
                                </button>
                                <button
                                    className={getMobileTypeFilterClass('lens')}
                                    onClick={() => handleTypeFilter('lens')}
                                >
                                    Lensa
                                    {currentTypeFilter === 'lens' && (
                                        <span className="float-right text-green-300">●</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation Bar */}
                <nav className="hidden lg:block bg-slate-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-center space-x-8 py-4">
                            {/* Brand Dropdown */}
                            <div className="relative">
                                <button 
                                    className={`flex items-center space-x-1 px-3 py-2 font-medium transition-all duration-200 rounded-md ${
                                        (currentBrandFilter && currentBrandFilter !== '' && !isTermsPage)
                                        ? 'bg-slate-800 text-white shadow-md transform scale-105' 
                                        : 'text-gray-700 hover:text-slate-800 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setBrandOpen(!brandOpen)}
                                    onMouseEnter={() => setBrandOpen(true)}
                                >
                                    <span>{getBrandDisplayText()}</span>
                                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${brandOpen ? 'rotate-180' : ''}`} />
                                    {currentBrandFilter && currentBrandFilter !== '' && !isTermsPage && (
                                        <div className="w-2 h-2 bg-green-400 rounded-full ml-1"></div>
                                    )}
                                </button>
                                
                                {brandOpen && (
                                    <div 
                                        className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                                        onMouseLeave={() => {
                                            setTimeout(() => setBrandOpen(false), 100);
                                        }}
                                    >
                                        <button
                                            className={getBrandItemClass('')}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleBrandSelect('');
                                            }}
                                        >
                                            Semua Brand
                                            {currentBrandFilter === '' && (
                                                <span className="float-right text-green-400">✓</span>
                                            )}
                                        </button>
                                        
                                        {brands.map((brand, i) => (
                                            <button
                                                key={i}
                                                className={getBrandItemClass(brand)}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleBrandSelect(brand);
                                                }}
                                            >
                                                {brand}
                                                {currentBrandFilter === brand && (
                                                    <span className="float-right text-green-400">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Navigation Links dengan Active States */}
                            <button
                                className={getTypeFilterClass('camera')}
                                onClick={() => handleTypeFilter('camera')}
                            >
                                Kamera
                                {currentTypeFilter === 'camera' && !isTermsPage && (
                                    <span className="ml-2 text-green-300">●</span>
                                )}
                            </button>
                            
                            <button
                                className={getTypeFilterClass('lens')}
                                onClick={() => handleTypeFilter('lens')}
                            >
                                Lensa
                                {currentTypeFilter === 'lens' && !isTermsPage && (
                                    <span className="ml-2 text-green-300">●</span>
                                )}
                            </button>
                            
                            <button
                                className={getTypeFilterClass('')}
                                onClick={() => handleTypeFilter('')}
                            >
                                Semua Produk
                                {currentTypeFilter === '' && !isTermsPage && (
                                    <span className="ml-2 text-green-300">●</span>
                                )}
                            </button>
                            
                            {/* Syarat & Ketentuan Button */}
                            <button
                                onClick={handleTermsClick}
                                className={getTermsButtonClass()}
                            >
                                Syarat & Ketentuan
                                {isTermsModalOpen && (
                                    <span className="ml-2 text-green-300">●</span>
                                )}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Overlay */}
            {(menuOpen || mobileNavOpen) && (
                <div 
                    className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 lg:hidden"
                    onClick={closeMobileMenus}
                ></div>
            )}

            {/* Terms Modal */}
            <TermsModal 
                isOpen={isTermsModalOpen}
                onClose={handleCloseTermsModal}
            />
        </>
    );
};

export default Navbar;