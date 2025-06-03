import React from 'react';
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
  return (
  <StaffLayout title="Data Pelanggan">
    <section className="mt-4 px-6 pb-12">
      <div className="bg-white rounded-md shadow-md p-6 overflow-x-auto">
        <h3 className="font-semibold text-[14px] mb-4">Data Pelanggan</h3>
        <table className="w-full text-[13px] text-[#1f1e29] border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-[#d3d3d3] text-left">
              <th className="py-3 px-4 rounded-tl-md">ID</th>
              <th className="py-3 px-4">Nama</th>
              <th className="py-3 px-4">No. HP</th>
              <th className="py-3 px-4">Alamat</th>
              <th className="py-3 px-4 rounded-tr-md">Sosial Media</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {customers.map((cust, idx) => (
              <tr
                key={cust.customer_id}
                className={`${
                  idx % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'
                } rounded-md`}
              >
                <td className="py-3 px-4">{cust.customer_id}</td>
                <td className="py-3 px-4">{cust.customer_name}</td>
                <td className="py-3 px-4">{cust.phone_number}</td>
                <td className="py-3 px-4">{cust.address}</td>
                <td className="py-3 px-4">{cust.social_media}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </StaffLayout>
  );
};

export default CustomerIndex;
