import { usePathname, useSearchParams } from "next/navigation";
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
  next: number | null;
  prev: number | null;
}

function changePageHref(
  page: number,
  pathname: string,
  searchParams: URLSearchParams
) {
  const params = new URLSearchParams(searchParams);
  params.set("page", page.toString());
  return `${pathname}?${params.toString()}`;
}
export default function PaginationController({
  page,
  next,
  prev,
}: PaginationControllerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Pagination className="pt-2 w-full" aria-label="Pagination">
      <PaginationContent className="flex w-full justify-center">
        {!!prev && (
          <PaginationItem>
            <PaginationPrevious
              href={changePageHref(prev, pathname, searchParams)}
            />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink href="#" aria-current="page" disabled>
            {page}
          </PaginationLink>
        </PaginationItem>

        {!!next && (
          <PaginationItem>
            <PaginationNext href={changePageHref(next, pathname, searchParams)}>
              {next}
            </PaginationNext>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
