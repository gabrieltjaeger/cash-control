import PageHeaderInfo from "@/components/PageHeaderInfo";
import ThemeCard from "./components/ThemeCard";

export default function SettingsPage() {
  return (
    <>
      <PageHeaderInfo
        title="Settings"
        description="Manage your application settings and database"
      />
      <div className="gap-6 flex flex-col">
        <ThemeCard />
      </div>
    </>
  );
}
