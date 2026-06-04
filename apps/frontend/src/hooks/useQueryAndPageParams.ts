import { useState } from "react";

export function useQueryAndPageParams() {
  const [page, _setPage] = useState(1);
  const [query, _setQuery] = useState("");

  const setQuery = (value: string) => {
    _setQuery(value);
    setPage(1);
  };

  const setPage = (newPage: number) => {
    const validPage = Math.max(1, newPage);
    _setPage(validPage);
  };

  return {
    query,
    setQuery,
    page,
    setPage,
  };
}
