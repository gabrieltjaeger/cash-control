import ThemeSwitch from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="h-full w-full container mx-auto text-foreground">
      <ThemeSwitch />
      <h1>Home</h1>
    </div>
  );
}
