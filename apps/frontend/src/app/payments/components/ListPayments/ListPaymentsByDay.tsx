"use client";

import { PaymentsTable } from "@/app/payments/components/PaymentsTable";
import { DayPicker } from "@/components/ui/day-picker";
import { useState } from "react";

export function ListPaymentsByDay() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="flex items-start space-x-4 flex-col w-full gap-2">
      <DayPicker
        value={date}
        onChange={(newDate) => {
          if (newDate) setDate(newDate);
        }}
      />
      <div className="grid gap-4 w-full">
        <PaymentsTable selectBy="day" date={date} />
      </div>
    </div>
  );
}
