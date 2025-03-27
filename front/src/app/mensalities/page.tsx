import PageHeaderInfo from "@/components/PageHeaderInfo";

export default function MensalitiesPage() {
  return (
    <>
      <PageHeaderInfo
        title="Monthly Fees"
        description="Manage monthly fees and view payment status"
      />
      <div className="gap-6 flex flex-col md:grid md:grid-cols-4"></div>
    </>
  );
}
