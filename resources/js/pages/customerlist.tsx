import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { UserIcon, PhoneIcon, MapPinIcon, AtSymbolIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Customer {
  customer_id: number;
  customer_name: string;
  phone_number: string;
  address: string;
  social_media: string;
}

interface CustomerListProps {
  customers?: Customer[];
}

export default function CustomerList(props: CustomerListProps) {
  // Get customers from props (passed from Inertia::render)
  const customers = props.customers || [];
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (customers.length > 0) {
      setSelectedId(customers[0].customer_id);
    }
  }, [customers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => router.visit('/formdatadiri')}
              className="flex items-center space-x-3 bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <ArrowLeftIcon className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Kembali</span>
            </button>

            {/* Center Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Data Customer</h1>
              <p className="text-slate-300 mt-1">Pilih Data Customer yang Terdaftar sebelumnya</p>
            </div>

            {/* Spacer for balance */}
            <div className="w-32"></div>
          </div>

          {/* Subtitle */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center space-x-2 text-slate-300">
              <UserIcon className="h-5 w-5" />
              <span className="font-medium">Pilih Data Customer Sebelumnya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {customers.length > 0 ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Customer Terdaftar</h2>
                  <p className="text-slate-600 text-sm mt-1">{customers.length} customer ditemukan</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {customers.map((customer) => (
                <div
                  key={customer.customer_id}
                  className={`group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedId === customer.customer_id 
                      ? 'ring-2 ring-slate-600 shadow-xl' 
                      : 'hover:ring-1 hover:ring-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {customer.customer_name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <PhoneIcon className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 break-all">{customer.phone_number}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 line-clamp-2">{customer.address}</p>
                        </div>
                      </div>

                      {customer.social_media && (
                        <div className="flex items-start space-x-3">
                          <AtSymbolIcon className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 break-all">{customer.social_media}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full mt-6 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      onClick={() => {
                        setSelectedId(customer.customer_id);
                        // Send customer data to formdatadiri page
                        router.visit('/formdatadiri', {
                          data: {
                            customer_id: customer.customer_id,
                            customer_name: customer.customer_name,
                            phone_number: customer.phone_number,
                            address: customer.address,
                            social_media: customer.social_media,
                          },
                        });
                      }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Gunakan Data Ini</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </button>
                  </div>

                  {/* Selection Indicator */}
                  {selectedId === customer.customer_id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserIcon className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum Ada Data Customer</h3>
              <p className="text-slate-600 mb-6">
                Belum ada customer yang terdaftar sebelumnya. Silakan tambahkan customer baru.
              </p>
              <button 
                onClick={() => router.visit('/formdatadiri')}
                className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Tambah Customer Baru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}