"use client";

import { ListPayments } from "@/app/payments/components/ListPayments";
import { motion } from "motion/react";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col h-full gap-3.5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <h1 className="text-3xl font-bold">Payments Reports</h1>
        <p className="text-muted-foreground">View and manage payment records</p>
      </motion.div>
      <ListPayments />
    </div>
  );
}
