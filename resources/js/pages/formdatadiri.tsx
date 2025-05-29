import { useEffect, useState } from 'react';

const FormDataDiri = () => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [totalHarga, setTotalHarga] = useState<number>(0);

  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    noHp: '',
    tanggalSewa: '',
    sosialMedia: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const items = localStorage.getItem('selectedItems');
    const total = localStorage.getItem('totalHarga');

    if (items) {
      setSelectedItems(JSON.parse(items));
    }

    if (total) {
      setTotalHarga(parseInt(total));
    }
  }, []);


    const handleKirimWA = () => {
      const message = `Halo, saya ${formData.nama} ingin menyewa pada tanggal
      ${formData.tanggalSewa}
        No HP: ${formData.noHp}
        Alamat: ${formData.alamat}
        Sosial Media: ${formData.sosialMedia}

      Barang yang dipilih:
      ${selectedItems.map((item, i) => {
          const prefix = `${i + 1}. `;
          const spacing = ' '.repeat(prefix.length);
          return `${prefix}${item.name}\n${spacing}Jumlah: ${item.quantity}, Total: Rp ${((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString('id-ID')}`;
      }).join('\n')}

      Total Harga: Rp ${totalHarga.toLocaleString('id-ID')}

      Terima kasih!`;


        const waUrl = `https://wa.me/+6282160502890?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

  return (
    <div className="p-6 w-full max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Diri</h1>

      {/* FORM DATA DIRI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 bg-[#e8d5c0] p-6 rounded-lg">
        {/* Kolom Kiri */}
        <div>
          <label className="block font-semibold mb-1">Nama:</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="w-full p-2 rounded bg-white shadow-inner"
          />

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">No. HP:</label>
              <input
                type="text"
                name="noHp"
                value={formData.noHp}
                onChange={handleChange}
                placeholder="08..."
                className="w-full p-2 rounded bg-white shadow-inner"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tanggal Sewa:</label>
              <input
                type="date"
                name="tanggalSewa"
                value={formData.tanggalSewa}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div>
          <label className="block font-semibold mb-1">Alamat:</label>
          <input
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            placeholder="Alamat Lengkap"
            className="w-full p-2 rounded bg-white shadow-inner"
          />

          <div className="mt-4">
            <label className="block font-semibold mb-1">Sosial Media:</label>
            <input
              type="text"
              name="sosialMedia"
              value={formData.sosialMedia}
              onChange={handleChange}
              placeholder="@username"
              className="w-full p-2 rounded bg-white shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* DAFTAR BARANG DIPILIH */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Barang yang dipilih:</h2>
      {selectedItems.length === 0 ? (
        <p>Belum ada barang yang dipilih.</p>
      ) : (
        <ul>
          {selectedItems.map((item, i) => (
            <li key={item.product?.product_id || i} className="mb-4 flex items-start gap-4">
              {item.product ? (
                <>
                  <img
                    src={item.product.product_image}
                    alt={item.name}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>Harga: Rp {(item.price ?? 0).toLocaleString('id-ID')}</p>
                    <p>Jumlah: {item.quantity ?? 0}</p>
                    <p>
                      Total: Rp {((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString('id-ID')}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-red-500">Data produk tidak ditemukan</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* FOOTER TOTAL HARGA */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white rounded-t-xl p-4 flex justify-between items-center z-50">
        <h3 className="font-semibold text-lg">
          Total Harga: Rp {totalHarga.toLocaleString('id-ID')}
        </h3>
        <button
            onClick={handleKirimWA}
            className="bg-green-500 text-black px-6 py-2 rounded font-semibold hover:bg-gray-100 mt-6"
            >
            Sent to WhatsApp
        </button>
      </div>
    </div>
  );
};

export default FormDataDiri;
