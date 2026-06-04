"use client";

import { motion } from "motion/react";

interface PageHeaderInfoProps {
  title: string;
  description: string;
}

export default function PageHeaderInfo({
  title,
  description,
}: Readonly<PageHeaderInfoProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
