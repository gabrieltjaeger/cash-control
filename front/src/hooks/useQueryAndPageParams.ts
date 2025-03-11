import { useState } from "react";

export function useQueryAndPageParams() {
  const [page, setPage] = useState(1);
  const [query, _setQuery] = useState("");

  const setQuery = (query: string) => {
    _setQuery(query);
    setPage(1);
  };

  return {
    query,
    setQuery,
    page,
    setPage,
  };
}
