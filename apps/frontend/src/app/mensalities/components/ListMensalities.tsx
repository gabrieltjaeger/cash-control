"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { YearPicker } from "@/components/ui/year-picker";
import { Suspense, useState } from "react";

import { useListMensalities } from "@/hooks/mensalities/useListMensalities";
import { formatPrice } from "@/lib/format-price";
import { months } from "@/lib/month";
import { motion } from "motion/react";

export default function ListMensalities() {
  const [date, setDate] = useState<Date>(new Date());
  const {
    data: mensalities,
    isLoading,
    error,
  } = useListMensalities({
    year: date.getFullYear(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-x-hidden col-span-2 lg:col-span-3"
    >
      <Card>
        <CardHeader>
          <CardTitle>Mensalities</CardTitle>
          <CardDescription>
            View a list of mensalities values for a specific year.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full flex flex-col justify-start items-start gap-2">
          <YearPicker
            value={date}
            onChange={(newDate) => {
              if (newDate) setDate(newDate);
            }}
          />
          <Suspense fallback={<LoadingSpinner />}>
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full text-destructive">
                Error: {error.message}
              </div>
            )}
            {!isLoading &&
              !error &&
              mensalities &&
              mensalities.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  No mensalities registered for {date.getFullYear()}.
                </div>
              )}
            {!isLoading && !error && mensalities && mensalities.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    {months.map((month) => (
                      <TableHead key={month} className="text-center">
                        {month}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {months.map((month) => {
                      const mensality = mensalities.find(
                        (mensality) => mensality.month === month
                      );
                      return (
                        <TableCell key={month} className="text-center">
                          {mensality
                            ? formatPrice(mensality.priceInCents, "BRL")
                            : "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </motion.div>
  );
}
