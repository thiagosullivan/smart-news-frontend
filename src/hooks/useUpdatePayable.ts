import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3333";

interface UpdatePayableData {
  paidDate?: string;
  status?: string;
}

export const useUpdatePayable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      companyId,
      payableId,
      data,
    }: {
      companyId: string;
      payableId: string;
      data: UpdatePayableData;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/companies/${companyId}/payables/${payableId}`,
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
