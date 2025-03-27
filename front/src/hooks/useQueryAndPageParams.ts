import { useState } from "react";

export function useQueryAndPageParams() {
  const [page, _setPage] = useState(1);
  const [query, _setQuery] = useState("");

  const setQuery = (value: string) => {
    _setQuery(value);
    setPage(1);
  };

  const setPage = (value: number) => {
    if (value < 1) {
      value = 1;
    }
    _setPage(value);
  };

  return {
    query,
    setQuery,
    page,
    setPage,
  };
}
