"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import RegisterAssociateForm from "./RegisterAssociateForm";

export function RegisterAssociate() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-x-hidden max-h-fit col-span-2 lg:col-span-1"
    >
      <Card>
        <CardHeader>
          <CardTitle>Register Associate</CardTitle>
          <CardDescription>
            Enter the associate information to register. The ID will be
            generated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterAssociateForm />
        </CardContent>
      </Card>
    </motion.div>
  );
}
