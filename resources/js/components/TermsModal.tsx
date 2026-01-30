import React from 'react';
import { X, FileText, AlertTriangle, Shield, CreditCard, Settings, Scale, RefreshCw } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      id: 1,
      title: "ATURAN UMUM",
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      items: [
        "Penyewa wajib meninggalkan 4 dokumen asli (SIM, KTP, KK, BPKB, IJAZAH, PASPORT, STNK, NPWP) dengan 1 nama identitas.",
        "Penyewa bersedia menginformasikan akun Instagram serta diambil fotonya saat pengambilan alat.",
        "Apabila penyewa TIDAK DAPAT DIHUBUNGI 2X24 jam Rev Picture Rental berhak melakukan pencarian masal dengan menyebarkan identitas penyewa dan seluruh data yang menjadi jaminan di media sosial.",
        "Penyewa menyetujui peralatan yang disewa untuk digunakan kegiatan yang tidak melanggar hukum negara & norma agama.",
        "Penyewa tidak akan memindah tangankan alat kepada pihak lain.",
        "Penyewa telah memahami fungsi alat yang disewa.",
        "Penyewa sanggup untuk menjaga alat yang disewa dan jika terjadi kerusakan atau kehilangan maka Penyewa sanggup mengganti sepenuhnya.",
        "Penyewa membayar tagihan pembayaran tepat waktu.",
        "Sewaktu-waktu Rev Picture Rental berhak membatalkan order penyewa karena alasan yang bersifat internal."
      ]
    },
    {
      id: 2,
      title: "SERAH TERIMA ALAT",
      icon: <RefreshCw className="w-5 h-5 text-emerald-400" />,
      items: [
        "Waktu operasional store untuk pengambilan & pengembalian mulai pukul 09.00-23.00.",
        "Waktu sewa dihitung 24 Jam Berdasarkan waktu Pengambilan Alat.",
        "Penyewa melakukan pelunasan pembayaran pada store crew sebagai syarat ambil alat.",
        "Waktu pengambilan alat menyesuaikan jam operasional store pada pukul 09.00-24.00 (Diharapkan untuk Melakukan Konfirmasi terlebih dahulu apakah alat sudah Ready untuk Dijemput).",
        "Penyewa bersedia dihubungi sewaktu-waktu perihal pengambilan & pengembalian alat.",
        "Saat pengambilan alat, Penyewa diwajibkan untuk memeriksa kelengkapan dan fungsi alat sebelum menandatangani dan stempel surat serah terima alat (packing slip). Segala bentuk masalah yang timbul setelahnya, adalah sepenuhnya tanggung jawab Penyewa.",
        "Penyewa tanda tangan dan stempel surat serah terima alat (packing slip) berarti telah menyetujui barang diterima dalam keadaan lengkap & baik, serta tunduk pada ketentuan layanan.",
        "Saat pengembalian alat, Penyewa wajib menyaksikan proses pemeriksaan alat oleh Store Crew hingga selesai dan dinyatakan alat kembali dengan lengkap dan baik.",
        "Penyewa menyadari bahwa alat yang disewa adalah alat untuk umum, yang memungkinkan terjadinya insiden sewaktu-waktu saat pengambilan alat, yaitu alat yang di-order terlambat dari jam pengambilan atau tidak bisa diambil sama sekali, dikarenakan kejadian khusus (misal: penyewa sebelumnya menghilang, kecelakaan, tertidur, atau alat mendadak rusak, dsb).",
        "Jika terjadi insiden alat tidak tersedia saat pengambilan alat, Rev Picture Rental akan mengganti alat dengan spesifikasi yang ekuivalen atau lebih tinggi atau penyewa dapat klaim refund penuh."
      ]
    },
    {
      id: 3,
      title: "BIAYA PEMBATALAN",
      icon: <CreditCard className="w-5 h-5 text-amber-400" />,
      items: [
        "Pembatalan order termasuk merubah tanggal sewa atau merubah jenis alat.",
        "Pembatalan order hanya berlaku jika alat belum di ambil dari store.",
        "Pembatalan order dikenakan biaya pembatalan:",
        "• Pembatalan H-3 & sebelumnya dari tanggal order, biaya 25% dari nilai order",
        "• Pembatalan H-2 sampai hari-H dari tanggal order, biaya 50% dari nilai order"
      ]
    },
    {
      id: 4,
      title: "KERUSAKAN & KEHILANGAN ALAT",
      icon: <Shield className="w-5 h-5 text-red-400" />,
      items: [
        "Penyewa mengetahui bahwa alat yang disewa tidak di asuransikan dan menyetujui untuk bertanggung jawab sepenuhnya serta tidak berbelit-belit dengan dasar alasan apapun yang menyebabkan alat dinyatakan Store Crew rusak atau hilang.",
        "Penyewa dilarang keras untuk melakukan perbaikan sendiri atas barang yang rusak saat masa sewa. Kerusakan wajib dilaporkan ke Store Crew untuk di proses lebih lanjut. Hanya Rev Picture Rental yang berhak memperbaiki alat.",
        "Setinggi-tingginya nilai penggantian atas barang yang rusak atau hilang adalah senilai harga terbaru di toko yang ditunjuk pihak Rev Picture Rental.",
        "Pengembalian alat yang tidak utuh atau ada bagian dari alat utama yang belum kembali karena alasan apapun sehingga menyebabkan alat kehilangan fungsi kerjanya maka penyewa dianggap sewa kembali (tambahan hari) hingga bagian tersebut dikembalikan ke pihak Rev Picture Rental (dengan kondisi alat utama di tahan Rev Picture Rental). Maksimal waktu pengembalian bagian yang hilang adalah 3 hari kerja atau ganti rugi penuh.",
        "Penyewa meninggalkan 4 IDENTITAS (1 nama) kepada Rev Picture Rental, sebagai jaminan atas kerusakan atau kehilangan, hingga penyewa menyelesaikan tanggung jawabnya untuk mengganti sesuai ketentuan."
      ]
    },
    {
      id: 5,
      title: "PERBUATAN MERUGIKAN & TINDAKAN KRIMINAL",
      icon: <AlertTriangle className="w-5 h-5 text-violet-400" />,
      items: [
        "Segala bentuk tindak kriminal atau perbuatan yang merugikan Rev Picture Rental akan diproses sesuai hukum yang berlaku di Negara Indonesia.",
        "Penyewa yang merugikan Rev Picture Rental akan di black-list (tidak dapat menyewa).",
        "Penyewa kategori blacklist dikarenakan faktor berikut:",
        "• faktor umum: attitude buruk, melanggar syarat & ketentuan",
        "• faktor teknis saat pengembalian alat: alat sering berantakan / tertinggal / rusak/ hilang",
        "• faktor non-teknis saat pengembalian alat: sering terlambat, telepon sulit dihubungi",
        "• faktor lainnya tidak kooperatif saat alat bermasalah, masalah dengan biaya sewa/ kompensasi",
        "• faktor external: blacklist di vendor rental lainnya / vendor umum"
      ]
    },
    {
      id: 6,
      title: "PERUBAHAN INFORMASI",
      icon: <Settings className="w-5 h-5 text-cyan-400" />,
      items: [
        "Isi dari dokumen publik yang diterbitkan Rev Picture Rental (syarat & ketentuan, pricelist, dll) dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.",
        "Adalah kewajiban penyewa untuk selalu memperbaharui informasi umum dari Rev Picture Rental melalui media social official https://www.instagram.com/sewarentalkameramedan/."
      ]
    },
    {
      id: 7,
      title: "PERSETUJUAN",
      icon: <Scale className="w-5 h-5 text-slate-300" />,
      items: [
        "Penyewa dengan sadar telah membaca dan menyetujui serta tunduk atas segala ketentuan yang tercantum didalam Syarat & Ketentuan Rev Picture Rental, dalam rentang waktu tak terbatas."
      ]
    }
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-slate-200/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Syarat & Ketentuan</h2>
                <p className="text-slate-300 text-sm font-medium mt-1">Rev Picture Camera Rental</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-xl transition-all duration-300 border border-white/20 group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] custom-scrollbar">
          <div className="p-8 space-y-10">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="relative">
                {/* Section Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-wide">
                          {section.id}. {section.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {section.items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 group">
                          <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full mt-3 group-hover:scale-125 transition-transform duration-200"></div>
                          <p className="text-slate-700 leading-relaxed text-sm font-medium">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Special Notice */}
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-2 border-red-200/50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-red-800 mb-3 text-lg">Perhatian Khusus untuk Kamera Action</h4>
                  <p className="text-red-700 leading-relaxed font-medium">
                    Kamera Action (GoPro, DJI Osmo Action, Xiaomi Yi) tidak untuk dipergunakan 
                    untuk berhubungan dengan air. Kebijakan ini dikarenakan Perusahaan GoPro 
                    tidak menanggung garansi karena kerusakan yang disebabkan dibawah air. 
                    Gunakanlah dengan bijak. Segala kerusakan yang disebabkan oleh air, maka 
                    penyewa mengganti unit baru.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white shadow-xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="font-bold text-xl mb-3">Informasi Terbaru</h4>
                <p className="text-slate-300 mb-6 font-medium">
                  Ikuti media sosial kami untuk mendapatkan informasi terbaru
                </p>
                <a 
                  href="https://www.instagram.com/sewarentalkameramedan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  <span>@sewarentalkameramedan</span>
                </a>
              </div>
            </div>
          </div>
        </div>


      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #475569, #334155);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #334155, #1e293b);
        }
      `}</style>
    </div>
  );
};

export default TermsModal;