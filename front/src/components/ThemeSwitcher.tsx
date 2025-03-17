"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [pendingTheme, setPendingTheme] = useState<string | null>(null);

  const [displayTheme, setDisplayTheme] = useState(resolvedTheme);

  useEffect(() => {
    if (!pendingTheme) {
      setDisplayTheme(resolvedTheme);
    }
  }, [resolvedTheme, pendingTheme]);

  const handleThemeChange = (newTheme: string) => {
    setPendingTheme(newTheme);
    setDisplayTheme(newTheme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          className="relative overflow-hidden"
        >
          {displayTheme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute"
              onAnimationComplete={() => {
                if (pendingTheme) {
                  setTheme(pendingTheme);
                  setPendingTheme(null);
                }
              }}
            >
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute"
              onAnimationComplete={() => {
                if (pendingTheme) {
                  setTheme(pendingTheme);
                  setPendingTheme(null);
                }
              }}
            >
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitch;
