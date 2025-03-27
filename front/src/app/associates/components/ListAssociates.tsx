"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationController from "@/components/PaginationController";
import SearchQueryInput from "@/components/SearchQueryInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListAssociates } from "@/hooks/associates/useListAssociates";
import { useQueryAndPageParams } from "@/hooks/useQueryAndPageParams";
import { Suspense, memo } from "react";

const ListAssociates = memo(function ListAssociates() {
  const { page, query, setPage, setQuery } = useQueryAndPageParams();
  const { data, isLoading } = useListAssociates({
    page,
    name: query,
  });

  return (
    <Card className="overflow-x-hidden col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">List Associates</CardTitle>
        <CardDescription>
          Search for associates and view their information.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full flex flex-col justify-start items-center gap-2">
        <Suspense fallback={<LoadingSpinner />}>
          <SearchQueryInput setQuery={setQuery} />
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && data.associates.length === 0 && (
            <div className="flex items-center justify-center h-full">
              No associates found.
            </div>
          )}
          {!isLoading && data.associates.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!!data.associates &&
                    data.associates.map((associate) => (
                      <TableRow key={associate.id}>
                        <TableCell>{associate.fullName}</TableCell>
                        <TableCell>{associate.email}</TableCell>
                        <TableCell>{associate.phone}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <PaginationController
                page={page}
                setPage={setPage}
                next={data.pagination.next}
                prev={data.pagination.prev}
              />
            </>
          )}
        </Suspense>
      </CardContent>
    </Card>
  );
});

export { ListAssociates };
