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
import { Month } from "@/types/month";
import { Suspense, useState } from "react";

import { useListMensalities } from "@/hooks/mensalities/useListMensalities";

const months: Month[] = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export default function ListMensalities() {
  const [date, setDate] = useState<Date>(new Date());
  const { data: mensalities, isLoading } = useListMensalities({
    year: date.getFullYear(),
  });

  return (
    <Card className="overflow-x-hidden col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Monthly Fees</CardTitle>
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
          {!isLoading && mensalities && mensalities.length === 0 && (
            <div className="flex items-center justify-center h-full">
              No mensalities registered for {date.getFullYear()}.
            </div>
          )}
          {!isLoading && mensalities && mensalities.length > 0 && (
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
                          ? BigInt(mensality.priceInCents).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )
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
  );
}
