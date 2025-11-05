import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
      console.log("🌐 Enviando requisição para:", `${API_BASE_URL}/companies`);
      console.log("📦 Dados enviados:", data);

      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("📡 Status da resposta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro da API:", errorText);
        throw new Error(errorText || "Erro ao criar empresa");
      }

      const result = await response.json();
      console.log("✅ Resposta da API:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
