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
    <StaffLayout title="Data Penyewa">
      <table className="w-full text-left border">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="p-2">ID</th>
            <th>Nama</th>
            <th>No. HP</th>
            <th>Alamat</th>
            <th>Sosial Media</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.customer_id} className="border-t">
              <td className="p-2">{cust.customer_id}</td>
              <td>{cust.customer_name}</td>
              <td>{cust.phone_number}</td>
              <td>{cust.address}</td>
              <td>{cust.social_media}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StaffLayout>
  );
};

export default CustomerIndex;
