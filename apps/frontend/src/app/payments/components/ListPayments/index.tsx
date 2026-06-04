"use client";

import { ListPaymentsByDay } from "@/app/payments/components/ListPayments/ListPaymentsByDay";
import { ListPaymentsByMonth } from "@/app/payments/components/ListPayments/ListPaymentsByMonth";
import { ListPaymentsByYear } from "@/app/payments/components/ListPayments/ListPaymentsByYear";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";

export function ListPayments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <Tabs defaultValue="daily" className="w-full flex flex-col gap-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">Annual</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="space-y-4">
              <ListPaymentsByDay />
            </TabsContent>
            <TabsContent value="monthly">
              <ListPaymentsByMonth />
            </TabsContent>
            <TabsContent value="annual">
              <ListPaymentsByYear />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
