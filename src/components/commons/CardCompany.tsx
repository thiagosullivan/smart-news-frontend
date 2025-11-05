import { formatToBRL } from "@/utils/formatToBRL";
import { Button } from "../ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { useUpdatePayable } from "@/hooks/useUpdatePayable";

interface CardCompanyProps {
  payable: {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: string;
    paidDate: string | null;
  };
  companyName: string;
  companyId: string;
}

const CardCompany = ({ payable, companyName, companyId }: CardCompanyProps) => {
  console.log(payable, companyName, "CARD COMPANY");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: payable.status,
    paidDate: payable.paidDate || "",
  });

  const { mutate: updatePayable, isPending } = useUpdatePayable();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleSave = () => {
    updatePayable(
      {
        companyId,
        payableId: payable.id,
        data: {
          status: formData.status,
          paidDate: formData.paidDate || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
        onError: (error) => {
          console.error("Erro ao atualizar:", error);
          alert("Erro ao salvar alterações");
        },
      }
    );
  };

  const handleStatusChange = (newStatus: string) => {
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
      paidDate:
        newStatus === "PAID" && !prev.paidDate
          ? new Date().toISOString().split("T")[0]
          : prev.paidDate,
    }));
  };

  return (
    <AlertDialog>
      <div className="border border-smart-news-gray-three rounded-md p-4 max-w-[425px] w-full">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-smart-news-gray-two font-bold">{companyName}</h2>
          <AlertDialogTrigger asChild>
            <Button className="bg-smart-news-purple-one hover:bg-smart-news-purple-one/70 cursor-pointer">
              <SquarePen />
              Editar
            </Button>
          </AlertDialogTrigger>
        </div>

        <p className="font-bold text-smart-news-gray-two text-sm w-full border-b border-smart-news-gray-three pb-2.5 mt-2">
          Conta a Pagar
        </p>

        <div className="mt-3 space-y-2">
          <div className="mb-6">
            <p className="font-semibold text-smart-news-gray-two text-sm">
              Descrição:
            </p>
            <p className="text-sm text-smart-news-gray-two">
              {payable.description}
            </p>
          </div>

          <div className="flex items-center gap-x-4">
            <div>
              <p className="font-semibold text-smart-news-gray-two text-sm">
                Vencimento:
              </p>
              <p className="text-sm text-smart-news-gray-two">
                {formatDate(payable.dueDate)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-smart-news-gray-two text-sm">
                Pago:
              </p>
              <div className="text-sm text-smart-news-gray-two">
                {payable.paidDate !== null ? (
                  <p>{formatDate(payable.paidDate)}</p>
                ) : (
                  <p>--/--/--</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="font-semibold text-smart-news-gray-two text-sm">
                Valor à pagar:
              </p>
              <p className="text-base font-bold text-smart-news-gray-two">
                {formatToBRL(payable.amount)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-smart-news-gray-two text-sm">
                Status:
              </p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-md ${
                  payable.status === "PAID"
                    ? "bg-smart-news-green-one text-white"
                    : payable.status === "OVERDUE"
                    ? "bg-smart-news-red-one text-white"
                    : "bg-smart-news-yellow-one text-white"
                }`}
              >
                {payable.status === "PAID"
                  ? "PAGO"
                  : payable.status === "OVERDUE"
                  ? "VENCIDO"
                  : "PENDENTE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-4 flex items-center justify-between">
            <AlertDialogTitle>Editar informações</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Empresa: <br />
            <p className="font-bold text-base">{companyName}</p>
            <br />
            Descrição: {payable.description}
            <br />
            Valor: {formatToBRL(payable.amount)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="OVERDUE">Vencido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Data de Pagamento
              {formData.status === "PAID" && !formData.paidDate && (
                <span className="text-orange-500 text-xs ml-2">
                  (Será preenchida com hoje)
                </span>
              )}
            </label>
            <input
              type="date"
              value={formData.paidDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, paidDate: e.target.value }))
              }
              className="w-full border rounded-md p-2"
              disabled={formData.status !== "PAID"}
            />
            {formData.status !== "PAID" && (
              <p className="text-xs text-gray-500 mt-1">
                Data de pagamento só é editável quando status é "Pago"
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-smart-news-purple-one hover:bg-smart-news-purple-one/70"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CardCompany;
