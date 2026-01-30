import React from 'react';
import AdminLayout from '@/layouts/admin_layout';
import { FaEdit, FaTrash } from 'react-icons/fa';
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
      <section className="mt-4 px-6 pb-12">
        <div className="bg-white rounded-md shadow-md p-6 overflow-x-auto">
          <h3 className="font-semibold text-[14px] mb-4">Daftar Staff</h3>
          <table className="w-full text-[13px] text-[#1f1e29] border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#d3d3d3] text-left">
                <th className="py-3 px-5 rounded-tl-md">No</th>
                <th className="py-3 px-5">Nama</th>
                <th className="py-3 px-5">Email</th>
                <th className="rounded-tr-md px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {users.map((user, idx) => (
                <tr
                  key={user.user_id}
                  className={`${
                    idx % 2 === 0 ? "bg-[#f5f5f5]" : "bg-white"
                  } rounded-md`}
                >
                  <td className="py-3 px-5">{idx + 1}</td>
                  <td className="py-3 px-5">{user.name}</td>
                  <td className="py-3 px-5">{user.email}</td>
                  <td className="py-3 px-5 text-center">
                    <div className="flex items-center gap-2">
                        <button className="text-[#0F63D4] hover:text-[#084fad]" >
                          <FaEdit size={14} />
                        </button>                                           
                        <button className="text-[#EF4444] hover:text-[#dc2626]">
                          <FaTrash size={14} />
                        </button>                                                                                        
                     </div>                                                                                     
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
};

export default StaffIndex;
