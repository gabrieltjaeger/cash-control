"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "motion/react";
import ThemeSwitch from "./ThemeSwitcher";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: -20 }}
      className="shadow-md flex items-center justify-start w-full px-4 py-4 md:px-6 rounded-b-lg glass sticky top-0 z-10 bg-card/50!"
    >
      <SidebarTrigger />
      <div className="flex items-center justify-end  w-full">
        <div className="flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </div>
    </motion.header>
  );
}
