"use client";

import {
  Sidebar as BaseSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BarChart, Calendar, CreditCard, Settings, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const contentItems = [
  { href: "/associates", icon: Users, label: "Associates" },
  { href: "/payments", icon: CreditCard, label: "Payments" },
  { href: "/mensalities", icon: Calendar, label: "Mensalities" },
  { href: "/analytics", icon: BarChart, label: "Analytics" },
];

const footerItems = [
  { href: "/config", icon: Settings, label: "System Config" },
];
export default function Sidebar({
  ...rest
}: React.ComponentProps<typeof BaseSidebar>) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <BaseSidebar
      side="left"
      collapsible="offcanvas"
      className="text-white"
      {...rest}
    >
      <SidebarHeader className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <h1 className={`lg:pl-0 text-2xl font-bold w-full`}>
                      Cash Control
                    </h1>
                  </motion.div>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <motion.div
                      key={item.label}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
                        pathname === item.href
                          ? "bg-secondary text-secondary-foreground"
                          : "hover:bg-primary-foreground/10"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {footerItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <motion.div
                      key={item.label}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
                        pathname === item.href
                          ? "bg-secondary text-secondary-foreground"
                          : "hover:bg-primary-foreground/10"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </BaseSidebar>
  );
}
