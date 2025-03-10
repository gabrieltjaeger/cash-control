import { useSearchParams } from "next/navigation";
import { useDebounce } from "./useDebounce";

export function useQueryAndPageParams() {
  const searchParams = useSearchParams();

  const query = useDebounce(searchParams.get("query") as string, 500);

  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  return { query, page };
}
