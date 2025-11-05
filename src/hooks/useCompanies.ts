import type { Company } from "@/types/company";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface CompaniesResponse {
  companies: Company[];
  error?: string;
}

function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Erro ${res.status}: ${res.statusText}`);
    }
    return res.json();
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => fetcher<CompaniesResponse>(`${API_BASE_URL}/companies`),
    select: (data) => data.companies,
    staleTime: 5 * 60 * 1000,
  });
}
