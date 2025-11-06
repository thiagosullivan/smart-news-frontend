import { useInfiniteQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface CompanySelect {
  id: string;
  name: string;
}

interface CompaniesSelectResponse {
  companies: CompanySelect[];
  total: number;
  hasMore: boolean;
  nextPage: number | null;
}

export const useCompaniesSelect = (searchTerm: string = "") => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["companies-select", searchTerm],
    queryFn: async ({ pageParam = 1 }): Promise<CompaniesSelectResponse> => {
      // TIMEOUT
      // const delay = pageParam === 1 ? 50 : 500;
      // await new Promise((resolve) => setTimeout(resolve, delay));

      // console.log(`Carregando página ${pageParam} (delay: ${delay}ms)`);

      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: "5",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(
        `${API_BASE_URL}/companies/select?${params}`
      );
      if (!response.ok) throw new Error("Erro ao carregar empresas");
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });

  const allCompanies = data?.pages.flatMap((page) => page.companies) || [];

  return {
    data: allCompanies,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: status === "pending",
    isError: status === "error",
    error,
  };
};
