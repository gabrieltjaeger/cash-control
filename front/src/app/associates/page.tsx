"use client";

import { motion } from "motion/react";
import { ListAssociates } from "./components/ListAssociates";
import { RegisterAssociate } from "./components/RegisterAssociate";

export default function AssociatesPage() {
  return (
    <div className="flex flex-col h-full gap-6">
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
      <div className="gap-6 flex flex-col-reverse md:grid md:grid-cols-2 ">
        <ListAssociates />
        <RegisterAssociate />
      </div>
    </div>
  );
}
