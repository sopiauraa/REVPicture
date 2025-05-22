import { StaffShell } from '@/components/StaffShell';
import { StaffSidebar } from '@/components/StaffSidebar';
import { StaffContent } from '@/components/StaffContent';
import { StaffSidebarHeader } from '@/components/StaffSidebarHeader';
import { type PropsWithChildren } from 'react';

export default function StaffSidebarLayout({ children }: PropsWithChildren) {
  return (
    <StaffShell>
      <StaffSidebar />
      <StaffContent>
        <StaffSidebarHeader />
        {children}
      </StaffContent>
    </StaffShell>
  );
}
