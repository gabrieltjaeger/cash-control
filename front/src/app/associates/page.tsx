"use client";
import { motion } from "motion/react";
import { RegisterAssociate } from "./components/RegisterAssociate";

export default function AssociatesPage() {
  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <h1 className="text-3xl font-bold">Associates Management</h1>
        <p className="text-muted-foreground mt-2">
          Register and manage your associates
        </p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2">
        <RegisterAssociate />
      </div>
    </div>
  );
}
