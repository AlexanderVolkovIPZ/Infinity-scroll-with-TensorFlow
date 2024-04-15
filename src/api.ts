import { useQuery } from "@tanstack/react-query";

export function useGetItems<Data>(url: string) {
  return useQuery<Data>({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch(url);

      return response.json();
    },
  });
}

/* export function useGetItem<Data>(url: string) {
  return useInfiniteQuery<Data>({
    queryKey: ["items"],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`${url}&page=${pageParam as number}`);

      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage?.length === 0) {
        return undefined;
      }

      return lastPageParam + 1;
    },
    refetchOnWindowFocus: false,
  });
} */
