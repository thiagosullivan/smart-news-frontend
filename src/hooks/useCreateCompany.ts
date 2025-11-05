import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3333";

interface CreateCompanyData {
  name: string;
  costCenters: Array<{
    name: string;
    description: string;
  }>;
  accountsReceivable?: Array<{
    description: string;
    amount: string;
    dueDate: string;
    status: string;
    receivedDate?: string;
  }>;
  accountsPayable?: Array<{
    description: string;
    amount: string;
    dueDate: string;
    status: string;
    paidDate?: string;
  }>;
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCompanyData) => {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar empresa");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
