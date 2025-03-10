import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterAssociateForm from "./RegisterAssociateForm";

export function RegisterAssociate() {
  return (
    <Card className="overflow-x-hidden max-h-fit">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Register Associate</CardTitle>
        <CardDescription>
          Enter the associate information to register. The ID will be generated
          automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterAssociateForm />
      </CardContent>
    </Card>
  );
}
