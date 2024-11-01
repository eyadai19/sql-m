// app/dashboard/layout.tsx

import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar';
interface DashboardLayoutProps {
  children: React.ReactNode;
}


export const sidebarItems = [
  {
    title: "Dashboard Home",
    url: "/dashboard",
  },
  {
    title: "DDL",
    url: "/dashboard/DDL",
    children: [
      { title: "Alter", url: "/dashboard/DDL/alter" },
      { title: "Drop", url: "/dashboard/DDL/drop" },
      { title: "Schema", url: "/dashboard/DDL/schema" },
      { title: "Table", url: "/dashboard/DDL/table" },
    ],
  },
  {
    title: "DML",
    url: "/dashboard/DML",
    children: [
      { title: "Delete", url: "/dashboard/DML/delete" },
      { title: "Insert", url: "/dashboard/DML/insert" },
      { title: "Select", url: "/dashboard/DML/select" },
      { title: "Update", url: "/dashboard/DML/update" },
    ],
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;