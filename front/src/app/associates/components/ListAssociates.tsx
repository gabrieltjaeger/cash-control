"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import PaginationController from "@/components/PaginationController";
import SearchQueryInput from "@/components/SearchQueryInput";
import { Button } from "@/components/ui/button";
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
import { Forward } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Suspense, memo } from "react";

const ListAssociates = memo(function ListAssociates() {
  const { page, query, setPage, setQuery } = useQueryAndPageParams();
  const { data, isLoading, error } = useListAssociates({
    page,
    name: query,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-x-hidden col-span-2 lg:col-span-3"
    >
      <Card>
        <CardHeader>
          <CardTitle>List Associates</CardTitle>
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
            {error && (
              <div className="flex items-center justify-center h-full text-destructive">
                Error: {error.message}
              </div>
            )}
            {!isLoading && !error && data?.associates.length === 0 && (
              <div className="flex items-center justify-center h-full">
                No associates found.
              </div>
            )}
            {!isLoading && !error && data && data.associates.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Profile</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!!data.associates &&
                      data.associates.map((associate) => (
                        <TableRow key={associate.id}>
                          <TableCell>{associate.fullName}</TableCell>
                          <TableCell>{associate.email}</TableCell>
                          <TableCell>{associate.phone}</TableCell>
                          <TableCell>
                            <Link href={`/associates/${associate.id}`}>
                              <Button
                                variant="link"
                                size="sm"
                                className="hover:cursor-pointer hover:text-blue-500"
                              >
                                <Forward />
                              </Button>
                            </Link>
                          </TableCell>
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
    </motion.div>
  );
});

export { ListAssociates };
