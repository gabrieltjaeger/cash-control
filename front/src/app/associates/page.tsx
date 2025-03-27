import PageHeaderInfo from "@/components/PageHeaderInfo";
import { ListAssociates } from "./components/ListAssociates";
import { RegisterAssociate } from "./components/RegisterAssociate";

export default function AssociatesPage() {
  return (
    <>
      <PageHeaderInfo
        title="Associates Management"
        description="Register and manage your associates"
      />
      <div className="gap-6 flex flex-col md:grid md:grid-cols-4">
        <RegisterAssociate />
        <ListAssociates />
      </div>
    </>
  );
}
