import { Suspense } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PaginationControllerProps {
  page: number;
  setPage: (page: number) => void;
  next: number | null;
  prev: number | null;
}

export default function PaginationController({
  page,
  setPage,
  next,
  prev,
}: PaginationControllerProps) {
  return (
    <Suspense fallback={null}>
      <Pagination className="w-full" aria-label="Pagination">
        <PaginationContent className="flex w-full justify-center">
          {!!prev && (
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage(prev)} />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href="#" aria-current="page" disabled>
              {page}
            </PaginationLink>
          </PaginationItem>

          {!!next && (
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage(next)}>
                {next}
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </Suspense>
  );
}
