import PageHeaderInfo from "@/components/PageHeaderInfo";
import ListMensalities from "./components/ListMensalities";
import RegisterMensality from "./components/RegisterMensality";

export default function MensalitiesPage() {
  return (
    <>
      <PageHeaderInfo
        title="Monthly Fees"
        description="Manage monthly fees and view payment status"
      />
      <div className="gap-6 flex flex-col md:grid md:grid-cols-4">
        <RegisterMensality />
        <ListMensalities />
      </div>
    </>
  );
}
