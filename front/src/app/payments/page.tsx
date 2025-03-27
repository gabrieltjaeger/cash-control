import { ListPayments } from "@/app/payments/components/ListPayments";
import PageHeaderInfo from "@/components/PageHeaderInfo";

export default function PaymentsPage() {
  return (
    <>
      <PageHeaderInfo
        title="Payments Reports"
        description="View and manage payment records"
      />
      <ListPayments />
    </>
  );
}
