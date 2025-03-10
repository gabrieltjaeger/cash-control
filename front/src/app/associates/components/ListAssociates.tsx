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
import { Suspense } from "react";

export function ListAssociates() {
  const { page, query } = useQueryAndPageParams();
  const { data, isLoading } = useListAssociates({
    page,
    name: query,
  });

  return (
    <Card className="overflow-x-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">List Associates</CardTitle>
        <CardDescription>
          Search for associates and view their information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingSpinner />}>
          <SearchQueryInput />
          {isLoading && (
            <div className="h-113.75 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && data.associates.length === 0 && (
            <div>No associates found.</div>
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
                next={data.pagination.next}
                prev={data.pagination.prev}
              />
            </>
          )}
        </Suspense>
      </CardContent>
    </Card>
  );
}
