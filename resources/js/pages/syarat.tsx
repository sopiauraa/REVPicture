// resources/js/Pages/SyaratKetentuanPage.tsx
import ErrorBoundary from '@/components/error-boundary';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

// Tipe item bisa berupa string atau objek dengan nested subItems dan subSubItems
type SectionItem =
    | string
    | {
          text: string;
          subItems?: SectionItem[];
      };

export default function SyaratKetentuanPage() {
    const sections: { title: string; items: SectionItem[] }[] = [
        {
            title: 'ATURAN UMUM',
            items: [
                'Penyewa wajib meninggalkan 4 dokumen asli (SIM, KTP, KK, BPKB, IJAZAH, PASPORT, STNK, NPWP) dengan 1 nama identitas.',
                'Penyewa bersedia menginformasikan akun Instagram serta diambil fotonya saat pengambilan alat.',
                'Apabila penyewa TIDAK DAPAT DIHUBUNGI 2X24 jam Rev Picture Rental berhak melakukan pencarian masal denga menyebarkan identitas penyewa di media sosial.',
                'Penyewa menyetujui peralatan yang disewa untuk digunakan kegiatan yang tidak melanggar hukum negara & norma agama.',
                'Penyewa tidak akan memindah tangankan alat kepada pihak lain',
                'Penyewa telah memahami fungsi alat yang disewa.',
                'enyewa sanggup untuk menjaga alat yang disewa dan jika terjadi kerusakan atau kehilangan maka Penyewa sanggup mengganti sepenuhnya.',
                'Penyewa membayar tagihan pembayaran tepat waktu.',
                'Sewaktu-waktu Rev Picture Rental berhak membatalkan order penyewa karena alasan yang bersifat internal.',
            ],
        },
        {
            title: 'SYARAT TERIMA ALAT',
            items: [
                'Waktu operasional store untuk pengambilan & pengembalian mulai pukul 09.00 - 24.00.',
                'Waktu sewa dihitung 24 Jam Berdasarkan waktu Pengambilan Alat.',
                'Penyewa melakukan pelunasan pembayaran pada store crew sebagai syarat ambil alat.',
                'Waktu pengambilan alat menyesuaikan jam operasional store pada pukul 09.00 - 24.00 (Diharapkan untuk Melakukan Konfirmasi terlebih dahulu apakah alat sudah Ready untuk Dijemput).',
                'Penyewa bersedia dihubungi sewaktu-waktu perihal pengambilan & pengembalian alat.',
                'Saat pengambilan alat, Penyewa diwajibkan untuk memeriksa kelengkapan dan fungsi alat sebelum menandatangani dan stempel surat serah terima alat (packing slip). Segal a bentuk masalah yang timbul setelahnya, adalah sepenuhnya tanggung jawab Penyewa.',
                'Penyewa tanda tangan dan stempel surat serah terima alat (packing slip) berarti telah menyetujui barang diterima dalam keadaan lengkap & baik, serta tunduk pada ketentuan layanan.',
                'Saat pengembalian alat, Penyewa wajib menyaksikan proses pemeriksaan alat oleh Store Crew hingga selesai dan dinyatakan alat kembali dengan lengkap dan baik.',
                'Penyewa menyadari bahwa alat yang disewa adalah alat untuk umum, yang memungkinkan terjadinya insiden sewaktu-waktu saat pengambilan alat, yaitu alat yang di-order terlambat dari jam pengambilan atau tidak bisa diambil sama sekali, dikarenakan kejadian khusus (misal : penyewa sebelumnya menghilang, kecelakaan, tertidur, atau alat mendadak rusak, dsb).',
                'Jika terjadi insiden alat tidak tersedia saat pengambilan alat, Rev Picture Rental akan mengganti alat dengan spesifikasi yang ekuivalen atau lebih tinggi atau penyewa dapat klaim refund penuh.',
            ],
        },
        {
            title: 'BIAYA PEMBATALAN',
            items: [
                'Pembatalan order termasuk merubah tanggal sewa atau merubah jenis alat.',
                'Pembatalan order hanya berlaku jika alat belum di ambil dari store.',
                'Pembatalan order dikenakan biaya pembatalan.',
                'Pembatalan H-3 & sebelumnya dari tanggal order, biaya 25% dari nilai order.',
                'Pembatalan H-2 sampai hari-H dari tanggal order, biaya 50% dari nilai order.',
            ],
        },
        {
            title: 'KERUSAKAN & KEHILANGAN ALAT',
            items: [
                'Penyewa bertanggung jawab atas kerusakan atau kehilangan alat selama masa sewa.',
                'Kerusakan wajib dilaporkan ke store crew; hanya Rev Picture Rental yang berhak memperbaiki alat.',
                'Nilai penggantian maksimal: harga terbaru di toko yang ditunjuk Rev Picture Rental.',
                'Keterlambatan pengembalian bagian alat dianggap perpanjangan sewa hingga pengembalian lengkap (maksimal 3 hari kerja) atau ganti rugi penuh.',
                'Penyewa meninggalkan 4 identitas sebagai jaminan hingga tanggung jawab selesai.',
                {
                    text: 'Jenis ganti rugi bawah kategori berikut (dikenakan satu atau lebih):',
                    subItems: [
                        'Biaya Servis: Ganti rugi uang untuk spare part atau jasa.',
                        'Biaya Penalty: Ganti rugi uang atas kerusakan ringan.',
                        {
                            text: 'Biaya Ganti Rugi Penuh:',
                            subItems: [
                                'Ganti rugi uang atas alat dengan kondisi hilang atau mengalami kerusakan berat (kehilangan fungsi utama, perubahan bentuk, jatuh di air laut/tawar, jatuh dengan keras, dll).',
                                'Kamera Action (GoPro, DJI Osmo Action, Xiaomi Yi) tidak untuk dipergunakan untuk berhubungan dengan air. Kebijakan ini dikarenakan Perusahaan GoPro tidak menanggung garansi karena kerusakan yang disebabkan dibawah air. Gunakanlah dengan bijak. Segala kerusakan yang disebabkan oleh air, maka penyewa mengganti unit baru.',
                            ],
                        },
                        {
                            text: 'Biaya Kompensasi:',
                            subItems: [
                                'Proses ganti rugi alat yang melewati 3 hari weekend (jumat, sabtu dan minggu) sejak tanggal kembali alat, maka Penyewa wajib membayar biaya kompensasi atas sewa di 3 hari tersebut dan berulang terus setiap minggunya, sebagai kompensasi atas alat yang tidak dapat disewakan karena kelalaian penyewa. Biaya kompensasi ini terus berlaku hingga alat selesai permasalahannya.',
                                'Penyewa bebas biaya kompensasi jika meminjamkan alat dengan kualifikasi yang sama atas alat yang bermasalah.',
                            ],
                        },
                        'Biaya Operasional: Dalam proses ganti rugi, jika terdapat biaya operasional (transport, dll) maka akan dikenakan kepada Penyewa.',
                    ],
                },
                'Setelah diinformasikan total tagihan ganti rugi, Penyewa membayar lunas dalam tempo waktu maksimal 3 hari kerja, atau akan dituntut sesuai pasal 5.',
            ],
        },
        {
            title: 'PERBUATAN MERUGIKAN & TINDAKAN KRIMINAL',
            items: [
                'Segal a bentuk tindak kriminal atau perbuatan yang merugikan Rev Picture Rental akan diproses sesuai hukum yang berlaku di Negara Indonesia.',
                'Penyewa yang merugikan Rev Picture Rental akan di black-list (tidak dapat menyewa).',
                {
                    text: 'Penyewa kategori blacklist dikarenakan faktor berikut:',
                    subItems: [
                        'faktor umum : attitide buruk, melanggar syarat & ketentuan.',
                        'faktor teknis saat pengembalian alat : alat sering berantakan / tertinggal / rusak / hilang.',
                        'faktor non-teknis saat pengembalian alat : sering terlambat, telepon sulit dihubungi.',
                        'faktor lainnya : tidak kooperatif saat alat bermasalah, masalah dengan biaya sewa/  kompensasi.',
                        'faktor external : blacklist di vendor rental lainnya / vendor umum.',
                    ],
                },
            ],
        },
        {
            title: 'PERUBAHAN INFORMASI',
            items: [
                'Isi dari dokumen publik yang diterbitkan Rev Picture Rental (syarat & ketentuan, pricelist, dll) dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.',
                'Adalah kewajiban penyewa untuk selalu memperbaharui informasi umum dari Rev Picture Rental melalui media social official https:l!www.instaqram.com/sewarentaIkameramedan/.',

            ],
        },
        {
            title: 'PERSETUJUAN',
            items: ['Penyewa dengan sadar telah membaca dan menyetujui serta tunduk atas segala ketentuan yang tercantum didalam Syarat & Ketentuan Rev Picture Rental, dalam rentang waktu tak terbatas.'],
        },
    ];

    // Fungsi rekursif untuk render daftar bertingkat
    const renderItem = (item: SectionItem, level: number = 0) => {
        if (typeof item === 'string') {
            return <li key={item}>{item}</li>;
        }
        return (
            <li key={item.text}>
                {item.text}
                {item.subItems && (
                    <ol type={level === 0 ? 'a' : 'i'} className="mt-2 list-inside list-decimal space-y-2 pl-6 leading-relaxed">
                        {item.subItems.map((sub) => renderItem(sub, level + 1))}
                    </ol>
                )}
            </li>
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FCF6EF]">


            <main className="flex-1 px-6 py-12 sm:px-10 lg:px-20">
                {/* Back Button & Title */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 flex items-center text-[#413C36] transition-colors hover:text-[#7B7875]"
                >
                    <i className="fas fa-chevron-left mr-2 text-lg" />
                    <span className="text-2xl leading-tight font-extrabold">Syarat & Ketentuan Sewa</span>
                </button>

                {/* Content Card */}
                <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-xl">
                    {sections.map((section, idx) => (
                        <div key={idx} className="mb-8">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#7f7a73] font-bold text-white">
                                    {idx + 1}
                                </div>
                                <h2 className="text-2xl font-semibold text-[#413C36]">
                                    {section.title}
                                </h2>
                            </div>
                            <ol className="list-inside list-decimal space-y-3 pl-6 text-gray-700">{section.items.map((item) => renderItem(item))}</ol>
                        </div>
                    ))}
                </div>
            </main>


        </div>
    );
}
