const Footer = () => {
  return (
    <footer className="bg-[#1e1f23] text-[#cfcfcf] text-sm pt-10 pb-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-10 justify-between">
        {/* Kolom 1 */}
        <div className="flex-1 min-w-[180px]">
          <h3 className="text-white font-bold text-lg mb-2">REV PICTURE</h3>
          <p>Sewa Kamera Medan Terlengkap</p>
        </div>

        {/* Kolom 2 */}
        <div className="flex-1 min-w-[180px]">
          <h3 className="text-white font-semibold mb-2">KONTAK KAMI:</h3>
          <p className="mb-1">Alamat:</p>
          <p className="mb-2">
            De Residence 2 No.7F, Jl. Sei Belutu, Medan Selayang, Kota Medan, Sumatera Utara
          </p>
          <p>Telepon: 0812-8033-7337</p>
          <p className="mt-1">Email: <a href="mailto:admin@sewakameramedan.id" className="underline text-white">admin@sewakameramedan.id</a></p>
        </div>

        {/* Kolom 3 */}
        <div className="flex-1 min-w-[150px]">
          <h3 className="text-white font-semibold mb-2">AKUN SAYA</h3>
          <ul>
            <li className="hover:underline cursor-pointer">Login</li>
            <li className="hover:underline cursor-pointer">Histori Pesanan</li>
          </ul>
          <h3 className="text-white font-semibold mt-4 mb-2">LAINNYA</h3>
          <ul>
            <li className="hover:underline cursor-pointer">Syarat & Ketentuan</li>
          </ul>
        </div>

        {/* Kolom 4 */}
        <div className="flex-1 min-w-[100px]">
          <h3 className="text-white font-semibold mb-2">IKUTI KAMI</h3>
          <i className="fab fa-instagram text-white text-xl hover:text-yellow-400 cursor-pointer"></i>
        </div>
      </div>

      <div className="border-t border-[#3a3a3a] mt-6 pt-3 flex justify-between items-center text-xs max-w-6xl mx-auto">
        <p>Since 2015 - 2023 © <span className="font-bold">REV PICTURE</span></p>
        <div className="flex gap-2">
          <img src="https://storage.googleapis.com/a1aa/image/bank-transfer.png" alt="Bank Transfer" className="h-5" />
          <img src="https://storage.googleapis.com/a1aa/image/cash-on-place.png" alt="Cash on Place" className="h-5" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
