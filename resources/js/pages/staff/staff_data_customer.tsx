import React, { useState, useMemo } from 'react';
import AdminLayout from '@/layouts/staff_layout';
import { Search } from 'lucide-react';
import StaffLayout from '@/layouts/staff_layout';

interface Customer {
  customer_id: number;
  customer_name: string;
  phone_number: string;
  address: string;
  social_media: string;
}

interface Props {
  customers: Customer[];
}

const CustomerIndex: React.FC<Props> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search logic - hanya berdasarkan nama
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    
    return customers.filter(customer =>
      customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <StaffLayout title="Data Pelanggan">
      <section className="mt-4 px-6 pb-12">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Pelanggan</h1>
          <p className="text-sm text-gray-600">
            Kelola semua data pelanggan rental Anda
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-700">Pencarian</span>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama Pelanggan
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    No. HP
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sosial Media
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((cust, idx) => (
                    <tr
                      key={cust.customer_id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                          #{cust.customer_id}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {cust.customer_name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700 font-mono text-sm">
                          {cust.phone_number}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700 text-sm max-w-xs">
                          {cust.address}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-blue-600 font-medium text-sm">
                          {cust.social_media}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Tidak ada data ditemukan</p>
                        <p className="text-sm">Coba ubah kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredCustomers.length)} dari {filteredCustomers.length} data
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-white'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </StaffLayout>
  );
};

export default CustomerIndex;