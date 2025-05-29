import React from 'react';
import AdminLayout from '@/layouts/admin_layout';

interface User {
  user_id: number;
  name: string;
  email: string;
}

interface Props {
  users: User[];
}

const StaffIndex: React.FC<Props> = ({ users }) => {
  return (
    <AdminLayout title="Data Staff">
      <table className="w-full text-left border">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="p-2">ID</th>
            <th>Nama</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="border-t">
              <td className="p-2">{user.user_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default StaffIndex;
