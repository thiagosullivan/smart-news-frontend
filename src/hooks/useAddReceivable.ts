import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3333";

interface AddReceivableData {
  description: string;
  amount: string;
  dueDate: string;
  status?: string;
  receivedDate?: string;
}

export const useAddReceivable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      companyId,
      data,
    }: {
      companyId: string;
      data: AddReceivableData;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/companies/${companyId}/receivables`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao adicionar conta a receber");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
