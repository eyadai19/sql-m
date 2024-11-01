'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { sidebarItems } from "@/app/dashboard/layout";
import { usePathname } from "next/navigation";


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="w-64 bg-gray-100 h-full p-4">
    <SidebarContent>
      <SidebarMenu>
        {sidebarItems.map((item) =>
          item.children ? (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                {item.children.map((subItem) => {
                  const isActive = pathname === subItem.url;
                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={subItem.url}
                          className={`block text-gray-800 hover:bg-gray-200 p-2 rounded-md ${
                            isActive ? "bg-gray-200 p-2" : ""
                          }`}
                        >
                          {subItem.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a
                  href={item.url}
                  className={`block text-gray-800 hover:bg-gray-200 p-2 rounded-md s ${
                    item.title === "Dashboard Home" ? "font-semibold text-lg p-2 hover:bg-gray-100" : ""
                  }`}
                >
                  {item.title}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
  );
}
