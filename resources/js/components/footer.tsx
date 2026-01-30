const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-sm pt-12 pb-8 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-yellow-400"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-wrap gap-10 justify-between">
          {/* Kolom 1 - Brand */}
          <div className="flex-1 min-w-[180px]">
            <div className="mb-4">
              <h3 className="text-white font-bold text-xl mb-3 tracking-wide">
                REV PICTURE
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-400 mb-3"></div>
              <p className="text-slate-400 leading-relaxed">
                Sewa Kamera Medan Terlengkap
              </p>
            </div>
          </div>

          {/* Kolom 2 - Contact */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-white font-semibold mb-4 text-base">KONTAK KAMI</h3>
            <div className="space-y-3">
              <div>
                <p className="text-amber-400 font-medium mb-1">Alamat:</p>
                <p className="text-slate-400 leading-relaxed">
                  De Residence 2 No.7F, Jl. Sei Belutu, Medan Selayang, Kota Medan, Sumatera Utara
                </p>
              </div>
              <div>
                <p className="text-amber-400 font-medium">Telepon:</p>
                <p className="text-slate-300">0812-8033-7337</p>
              </div>
              <div>
                <p className="text-amber-400 font-medium">Email:</p>
                <a 
                  href="mailto:admin@sewakameramedan.id" 
                  className="text-slate-300 hover:text-amber-400 transition-colors duration-200 underline decoration-amber-400/50 hover:decoration-amber-400"
                >
                  admin@sewakameramedan.id
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 3 - Links */}
          <div className="flex-1 min-w-[150px]">
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4 text-base">AKUN SAYA</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:underline decoration-amber-400/50">
                    Login
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:underline decoration-amber-400/50">
                    Histori Pesanan
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-base">LAINNYA</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:underline decoration-amber-400/50">
                    Syarat & Ketentuan
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Kolom 4 - Social Media */}
          <div className="flex-1 min-w-[100px]">
            <h3 className="text-white font-semibold mb-4 text-base">IKUTI KAMI</h3>
            <div className="flex space-x-3">
              <div className="group">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-amber-400 group-hover:bg-amber-400 transition-all duration-300 cursor-pointer">
                  <i className="fab fa-instagram text-slate-400 text-lg group-hover:text-slate-900 transition-colors duration-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <p className="text-slate-400">
              Since 2015 - 2023 © 
              <span className="font-bold text-white ml-1">REV PICTURE</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs hidden sm:inline">Metode Pembayaran:</span>
            <div className="flex gap-2">
              <div className="bg-slate-800 p-2 rounded border border-slate-700 hover:border-amber-400 transition-colors duration-200 group">
                <i className="fas fa-university text-slate-400 text-sm group-hover:text-amber-400 transition-colors duration-200" title="Bank Transfer"></i>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700 hover:border-amber-400 transition-colors duration-200 group">
                <i className="fas fa-money-bill-wave text-slate-400 text-sm group-hover:text-amber-400 transition-colors duration-200" title="Cash on Place"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// const Footer = () => {
//   return (
//     <footer className="bg-white text-slate-700 text-sm pt-12 pb-8 px-6 relative overflow-hidden">
//       {/* Decorative background elements */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 opacity-50"></div>
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-900"></div>
      
//       <div className="max-w-6xl mx-auto relative z-10">
//         <div className="flex flex-wrap gap-10 justify-between">
//           {/* Kolom 1 - Brand */}
//           <div className="flex-1 min-w-[180px]">
//             <div className="mb-4">
//               <h3 className="text-slate-900 font-bold text-xl mb-3 tracking-wide">
//                 REV PICTURE
//               </h3>
//               <div className="w-12 h-1 bg-gradient-to-r from-slate-800 to-slate-900 mb-3"></div>
//               <p className="text-slate-600 leading-relaxed">
//                 Sewa Kamera Medan Terlengkap
//               </p>
//             </div>
//           </div>

//           {/* Kolom 2 - Contact */}
//           <div className="flex-1 min-w-[180px]">
//             <h3 className="text-slate-900 font-semibold mb-4 text-base">KONTAK KAMI</h3>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-slate-800 font-medium mb-1">Alamat:</p>
//                 <p className="text-slate-600 leading-relaxed">
//                   De Residence 2 No.7F, Jl. Sei Belutu, Medan Selayang, Kota Medan, Sumatera Utara
//                 </p>
//               </div>
//               <div>
//                 <p className="text-slate-800 font-medium">Telepon:</p>
//                 <p className="text-slate-700">0812-8033-7337</p>
//               </div>
//               <div>
//                 <p className="text-slate-800 font-medium">Email:</p>
//                 <a 
//                   href="mailto:admin@sewakameramedan.id" 
//                   className="text-slate-700 hover:text-slate-900 transition-colors duration-200 underline decoration-slate-800/50 hover:decoration-slate-900"
//                 >
//                   admin@sewakameramedan.id
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* Kolom 3 - Links */}
//           <div className="flex-1 min-w-[150px]">
//             <div className="mb-6">
//               <h3 className="text-slate-900 font-semibold mb-4 text-base">AKUN SAYA</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 hover:underline decoration-slate-800/50">
//                     Login
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 hover:underline decoration-slate-800/50">
//                     Histori Pesanan
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-slate-900 font-semibold mb-4 text-base">LAINNYA</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 hover:underline decoration-slate-800/50">
//                     Syarat & Ketentuan
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Kolom 4 - Social Media */}
//           <div className="flex-1 min-w-[100px]">
//             <h3 className="text-slate-900 font-semibold mb-4 text-base">IKUTI KAMI</h3>
//             <div className="flex space-x-3">
//               <div className="group">
//                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-300 group-hover:border-slate-800 group-hover:bg-slate-800 transition-all duration-300 cursor-pointer">
//                   <i className="fab fa-instagram text-slate-600 text-lg group-hover:text-white transition-colors duration-300"></i>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="border-t border-slate-300 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
//           <div className="flex items-center space-x-2">
//             <p className="text-slate-600">
//               Since 2015 - 2023 © 
//               <span className="font-bold text-slate-900 ml-1">REV PICTURE</span>
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <span className="text-slate-500 text-xs hidden sm:inline">Metode Pembayaran:</span>
//             <div className="flex gap-2">
//               <div className="bg-slate-100 p-2 rounded border border-slate-300 hover:border-slate-800 transition-colors duration-200 group">
//                 <i className="fas fa-university text-slate-600 text-sm group-hover:text-slate-800 transition-colors duration-200" title="Bank Transfer"></i>
//               </div>
//               <div className="bg-slate-100 p-2 rounded border border-slate-300 hover:border-slate-800 transition-colors duration-200 group">
//                 <i className="fas fa-money-bill-wave text-slate-600 text-sm group-hover:text-slate-800 transition-colors duration-200" title="Cash on Place"></i>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;