import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchAssociateMensalities } from "@/hooks/associates/useFetchAssociateMensalities";
import { MensalityDTO } from "@/interfaces/dtos/mensality-dto";
import { useState } from "react";

import { YearPicker } from "@/components/ui/year-picker";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { months } from "@/lib/month";
import { Month } from "@/types/month";

interface AssociateMensalitiesTableProps {
  associateId: string;
}

export default function AssociateMensalitiesTable({
  associateId,
}: AssociateMensalitiesTableProps) {
  const [date, setDate] = useState(new Date());
  const { data, isLoading } = useFetchAssociateMensalities({
    id: associateId,
    year: date.getFullYear(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensality History</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-start items-start gap-2">
        <YearPicker
          className="w-full"
          value={date}
          onChange={(newDate) => {
            if (newDate) setDate(newDate);
          }}
        />
        {isLoading && <LoadingSpinner />}
        {!isLoading && !data && (
          <div className="flex items-center justify-center h-full">
            Some error occurred while fetching mensalities.
          </div>
        )}
        {!isLoading && data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {months.map((month: Month) => {
                const isPaid = data.some(
                  (mensality: MensalityDTO) =>
                    mensality.month === month &&
                    mensality.year === date.getFullYear()
                );
                return (
                  <TableRow key={month}>
                    <TableCell>{month}</TableCell>
                    <TableCell>
                      <Badge variant={isPaid ? "success" : "destructive"}>
                        {isPaid ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
