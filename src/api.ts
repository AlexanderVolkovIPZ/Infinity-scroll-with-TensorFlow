import { useQuery, UseQueryResult } from "react-query";

export function useFetchData<Data>(url: string): UseQueryResult<Data, Error> {
  return useQuery("getPost", async () => {
    const response = await fetch(url);

    return response.json();
  });
}
