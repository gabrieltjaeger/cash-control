"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import RegisterMensalityForm from "./RegisterMensalityForm";

export default function RegisterMensality() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-x-hidden max-h-fit col-span-2 lg:col-span-1"
    >
      <Card>
        <CardHeader>
          <CardTitle>Register Mensality</CardTitle>
          <CardDescription>
            Set the fee amount for a specific month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterMensalityForm />
        </CardContent>
      </Card>
    </motion.div>
  );
}
