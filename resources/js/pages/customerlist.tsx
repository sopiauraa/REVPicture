import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { UserIcon } from '@heroicons/react/24/outline';

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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        <UserIcon className="h-5 w-5 inline-block mr-2" />
        Pilih Data Customer Sebelumnya
      </h1>
      <div className="flex flex-wrap gap-4">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div
              key={customer.customer_id}
              className={`rounded-xl border p-4 bg-white shadow min-w-[220px] max-w-xs ${
                selectedId === customer.customer_id ? 'border-blue-500' : ''
              }`}
            >
              <div className="font-semibold">{customer.customer_name}</div>
              <div className="text-sm text-slate-600">{customer.phone_number}</div>
              <div className="text-sm text-slate-600">{customer.address}</div>
              <div className="text-xs text-slate-400">{customer.social_media}</div>
              <button
                className="mt-3 rounded bg-slate-900 text-white px-3 py-1 text-sm hover:bg-slate-700 transition"
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
                Gunakan Data Ini
              </button>
            </div>
          ))
        ) : (
          <div className="text-slate-500 italic">Belum ada data customer sebelumnya.</div>
        )}
      </div>
    </div>
  );
}