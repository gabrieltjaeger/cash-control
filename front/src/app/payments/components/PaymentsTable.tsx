import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationController from "@/components/PaginationController";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListPayments } from "@/hooks/payments/useListPayments";
import { useQueryAndPageParams } from "@/hooks/useQueryAndPageParams";
import { formatPrice } from "@/lib/format-price";
import { Trash2 as Trash } from "lucide-react";

interface PaymentsTableProps {
  selectBy: "day" | "month" | "year" | "range";
  date?: Date;
}

export function PaymentsTable({ selectBy, date }: PaymentsTableProps) {
  const { page, setPage } = useQueryAndPageParams();

  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data, isLoading } = useListPayments({
    initialDate: date ? date.toISOString() : new Date().toISOString(),
    selectBy,
    timeZone,
    page,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-33">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoading && data.payments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-33">
        No payments found for this {selectBy}.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-33 overflow-x-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Associate</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.associate?.fullName}</TableCell>
              <TableCell>{formatPrice(payment.valueInCents, "BRL")}</TableCell>
              <TableCell>
                {new Date(payment.date).toLocaleDateString(locale, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                <Button variant="destructive" size="sm">
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationController
        page={page}
        setPage={setPage}
        next={data.pagination.next}
        prev={data.pagination.prev}
      />
    </div>
  );
}
