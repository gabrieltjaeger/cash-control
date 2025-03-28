import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterMensalityForm from "./RegisterMensalityForm";

export default function RegisterMensality() {
  return (
    <Card className="overflow-x-hidden max-h-fit col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Register Monthly Fee
        </CardTitle>
        <CardDescription>
          Set the fee amount for a specific month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterMensalityForm />
      </CardContent>
    </Card>
  );
}
