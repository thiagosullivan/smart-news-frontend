import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3333";

interface UpdateReceivableData {
  receivedDate?: string;
  status?: string;
}

export const useUpdateReceivable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      companyId,
      receivableId,
      data,
    }: {
      companyId: string;
      receivableId: string;
      data: UpdateReceivableData;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/companies/${companyId}/receivables/${receivableId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar conta");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
