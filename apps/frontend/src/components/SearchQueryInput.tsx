import { Input } from "@/components/ui/input";

interface SearchQueryInputProps {
  setQuery: (query: string) => void;
}

export default function SearchQueryInput({ setQuery }: SearchQueryInputProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <Input
      placeholder="Search..."
      className="w-full max-h-9 min-h-9"
      type="text"
      name="searchQuery"
      id="searchQuery"
      onChange={handleSearch}
    />
  );
}
