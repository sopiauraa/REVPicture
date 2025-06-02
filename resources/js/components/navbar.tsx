import { Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from './CartContext';

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
};

const Navbar = ({ cart, setShowCart }: Props) => {
    const { user } = usePage().props.auth as { user?: { name: string } };
    const [brandOpen, setBrandOpen] = useState(false);
    const [akunOpen, setAkunOpen] = useState(false);
    const [jenisOpen, setJenisOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const { clearCart } = useCart();

    const handleSearch = () => {
        console.log('Mencari:', searchTerm);
    };

    const handleLogout = () => {
        clearCart();
        window.location.href = '/logout';
    };

    return (
        <header className="shadow-md">
            {/* Header atas */}
            <div className="bg-[#3a372f] px-5 py-5 text-sm font-bold text-white uppercase">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="https://storage.googleapis.com/a1aa/image/4a12e656-92bc-4900-add9-ca7382b68109.jpg"
                            alt="Logo REV PICTURE"
                            className="h-10 w-10 rounded-md object-contain"
                        />
                        <span className="text-base font-semibold text-white">REV PICTURE</span>
                    </div>

                    {/* Search bar */}
                    <div className="relative mx-auto w-full max-w-md md:mr-9">
                        <input
                            type="search"
                            placeholder="Cari produk..."
                            className="ring-black-400 w-full rounded-xl bg-white py-2.5 pr-9 pl-7 text-sm text-black shadow-md outline-none focus:ring-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Hamburger menu */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none md:hidden">
                        <i className="fas fa-bars text-xl"></i>
                    </button>

                    {/* Menu atas kanan */}
                    <div className={`flex-col items-center gap-5 text-sm md:flex md:flex-row ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
                        <Link href="/" className="flex items-center gap-1 transition hover:text-yellow-400">
                            <i className="fas fa-home" /> BERANDA
                        </Link>

                        {/* Dropdown AKUN */}
                        <div className="relative" onClick={() => setAkunOpen(!akunOpen)}>
                            <div className="flex cursor-pointer items-center gap-1 transition hover:text-yellow-400">
                                <i className="fas fa-user" />
                                {user?.name ? user.name : 'AKUN'}
                            </div>

                            {akunOpen && (
                                <div className="absolute left-0 z-50 mt-2 w-32 rounded bg-[#3a372f] text-left shadow-md">
                                    {user ? (
                                        <div className="cursor-pointer px-4 py-2 transition hover:bg-[#2e2c27]" onClick={handleLogout}>
                                            Logout
                                        </div>
                                    ) : (
                                        <>
                                            <div className="cursor-pointer px-4 py-2 transition hover:bg-[#2e2c27]">
                                                <Link href="/login">Login</Link>
                                            </div>
                                            <div className="cursor-pointer px-4 py-2 transition hover:bg-[#2e2c27]">
                                                <Link href="/register">Register</Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link href="/keranjang" className="top-4 right-4 z-50 rounded bg-black px-4 py-2 text-white">
                            🛒 Keranjang ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                        </Link>
                    </div>
                </div>
            </div>

            {/* Menu bawah */}
            <nav className="relative z-10 bg-[#7f7a73] py-5 text-sm font-bold text-white">
                <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-10">
                    {/* Dropdown Brand */}
                    <div className="relative" onMouseEnter={() => setBrandOpen(true)}>
                        <div className="flex cursor-pointer items-center gap-1 transition hover:text-yellow-300">
                            Brand <i className="fas fa-chevron-down text-xs"></i>
                        </div>
                        {brandOpen && (
                            <div
                                className="animate-fadeIn absolute z-20 mt-2 w-40 rounded-b-md bg-[#7f7a73] shadow-md"
                                onMouseLeave={() => setBrandOpen(false)}
                            >
                                {['Sony', 'Canon', 'Lumix', 'Fujifilm', 'Nikon'].map((brand, i) => (
                                    <div key={i} className="cursor-pointer px-4 py-2 transition hover:bg-[#6b675f]">
                                        {brand}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Menu statis */}
                    {['Kamera', 'Lensa', 'Paket Rev Picture', 'Penting Dibaca'].map((item, i) => (
                        <div key={i} className="cursor-pointer transition hover:text-yellow-300">
                            {item}
                        </div>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
