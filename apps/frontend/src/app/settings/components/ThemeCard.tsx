"use client";

import ThemeSwitch from "@/components/ThemeSwitcher";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";

export default function ThemeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose between light and dark mode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <ThemeSwitch />
            <span className="text-sm text-muted-foreground">
              Toggle between light and dark mode
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
