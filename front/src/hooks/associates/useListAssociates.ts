import { listAssociates as listAssociatesAction } from "@/_actions/associates/GET/list-associates";
import { AssociateDTO } from "@/interfaces/dtos/associate-dto";
import { useQuery } from "@tanstack/react-query";

interface UseListAssociatesProps {
  page: number;
  name?: string;
}

interface ListAssociatesResponse {
  associates: AssociateDTO[];
  pagination: { next: number | null; prev: number | null };
}

export function useListAssociates({ page, name }: UseListAssociatesProps) {
  return useQuery<ListAssociatesResponse, Error>({
    queryKey: ["associates", page, name],
    queryFn: async () => {
      const response = await listAssociatesAction({ page, name });
      return response.data;
    },
  });
}
