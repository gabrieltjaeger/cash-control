import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchQueryInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    e.preventDefault(); // Evita o comportamento de submit do formulário, se necessário

    const params = new URLSearchParams(searchParams);
    params.set("query", e.target.value);
    params.delete("page");

    // Atualiza a URL sem recarregar a página ou voltar ao topo
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Input
      placeholder="Search..."
      className="w-full"
      type="text"
      name="searchQuery"
      id="searchQuery"
      onChange={handleSearch}
    />
  );
}
