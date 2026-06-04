"use client";

import { PaymentsTable } from "@/app/payments/components/PaymentsTable";
import { MonthPicker } from "@/components/ui/month-picker";
import { useState } from "react";

export function ListPaymentsByMonth() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="flex items-start space-x-4 flex-col w-full gap-2">
      <MonthPicker
        value={date}
        onChange={(newDate) => {
          if (newDate) setDate(newDate);
        }}
      />

      <div className="grid gap-4 w-full">
        <PaymentsTable selectBy="month" date={date} />
      </div>
    </div>
  );
}
