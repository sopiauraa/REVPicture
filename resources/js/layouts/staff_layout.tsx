import React from 'react';
import StaffSidebar from '@/components/staff_sidebar';

interface StaffLayoutProps {
  title: string;
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Content Area */}
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default StaffLayout;
