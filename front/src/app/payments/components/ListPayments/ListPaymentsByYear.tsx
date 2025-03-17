import { PaymentsTable } from "@/app/payments/components/PaymentsTable";
import { YearPicker } from "@/components/ui/year-picker";
import { useState } from "react";

export function ListPaymentsByYear() {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <div className="flex items-start space-x-4 flex-col w-full gap-2">
      <YearPicker
        value={date}
        onChange={(newDate) => {
          if (newDate) setDate(newDate);
        }}
      />
      <div className="grid gap-4 w-full">
        <PaymentsTable selectBy="year" date={date} />
      </div>
    </div>
  );
}
