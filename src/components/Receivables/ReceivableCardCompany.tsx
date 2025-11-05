import { formatToBRL } from "@/utils/formatToBRL";
import { Button } from "../ui/button";
import { Loader2, SquarePen, Trash2, X } from "lucide-react";
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
import { useUpdateReceivable } from "@/hooks/useUpdateReceivable";
import { useDeleteReceivable } from "@/hooks/useDeleteReceivable";
import { toast } from "sonner";

interface ReceivableCardCompanyProps {
  receivable: {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: string;
    receivedDate: string | null;
  };
  companyName: string;
  companyId: string;
}

const ReceivableCardCompany = ({
  receivable,
  companyName,
  companyId,
}: ReceivableCardCompanyProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: receivable.status,
    receivedDate: receivable.receivedDate || "",
  });

  const { mutate: updateReceivable, isPending: isUpdating } =
    useUpdateReceivable();
  const { mutate: deleteReceivable, isPending: isDeleting } =
    useDeleteReceivable();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleSave = () => {
    updateReceivable(
      {
        companyId,
        receivableId: receivable.id,
        data: {
          status: formData.status,
          receivedDate: formData.receivedDate || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast.success("Item atualizado com sucesso!", {
            style: {
              backgroundColor: "#4CAF50",
              color: "#fff",
            },
          });
        },
        onError: (error) => {
          console.error("Erro ao atualizar:", error);
          toast.error("Erro ao atualizar!", {
            style: {
              backgroundColor: "#c74242",
              color: "#fff",
            },
          });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteReceivable(
      {
        companyId,
        receivableId: receivable.id,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast.success("Deletado com sucesso!", {
            style: {
              backgroundColor: "#4CAF50",
              color: "#fff",
            },
          });
        },
        onError: (error) => {
          console.error("Erro ao deletar:", error);
          toast.error("Erro ao deletar", {
            style: {
              backgroundColor: "#c74242",
              color: "#fff",
            },
          });
        },
      }
    );
  };

  const handleStatusChange = (newStatus: string) => {
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
      receivedDate:
        newStatus === "PAID" && !prev.receivedDate
          ? new Date().toISOString().split("T")[0]
          : prev.receivedDate,
    }));
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="border border-smart-news-gray-three rounded-md p-4 max-w-none md:max-w-[425px] w-full">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-smart-news-gray-two font-bold">{companyName}</h2>
          <AlertDialogTrigger asChild>
            <Button className="bg-smart-news-purple-one hover:bg-smart-news-purple-one/70 cursor-pointer">
              <SquarePen />
              Editar
            </Button>
          </AlertDialogTrigger>
        </div>

        {/* Corrigi o texto para "Conta a Receber" */}
        <p className="font-bold text-smart-news-gray-two text-sm w-full border-b border-smart-news-gray-three pb-2.5 mt-2">
          Conta a Receber
        </p>

        <div className="mt-3 space-y-2">
          <div className="mb-6">
            <p className="font-semibold text-smart-news-gray-two text-sm">
              Descrição:
            </p>
            <p className="text-sm text-smart-news-gray-two">
              {receivable.description}
            </p>
          </div>

          <div className="flex items-center gap-x-4">
            <div>
              <p className="font-semibold text-smart-news-gray-two text-sm">
                Vencimento:
              </p>
              <p className="text-sm text-smart-news-gray-two">
                {formatDate(receivable.dueDate)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-smart-news-gray-two text-sm">
                Recebido:
              </p>{" "}
              {/* Mudei de "Pago" para "Recebido" */}
              <div className="text-sm text-smart-news-gray-two">
                {receivable.receivedDate !== null ? (
                  <p>{formatDate(receivable.receivedDate)}</p>
                ) : (
                  <p>--/--/--</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="font-semibold text-smart-news-gray-two text-sm">
                Valor a receber: {/* Mudei de "pagar" para "receber" */}
              </p>
              <p className="text-base font-bold text-smart-news-gray-two">
                {formatToBRL(receivable.amount)}
              </p>
            </div>
            <div>
              <p className="font-semibold text-smart-news-gray-two text-sm">
                Status:
              </p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-md ${
                  receivable.status === "PAID"
                    ? "bg-smart-news-green-one text-white"
                    : receivable.status === "OVERDUE"
                    ? "bg-smart-news-red-one text-white"
                    : "bg-smart-news-yellow-one text-white"
                }`}
              >
                {receivable.status === "PAID"
                  ? "RECEBIDO"
                  : receivable.status === "OVERDUE"
                  ? "VENCIDO"
                  : "PENDENTE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader className="relative">
          <div className="mb-4 flex items-center justify-between">
            <AlertDialogTitle>Editar informações</AlertDialogTitle>
            <div>
              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Deletando...
                      </div>
                    ) : (
                      "Confirmar"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
              <div className="absolute -top-9 -right-6">
                <AlertDialogCancel className="rounded-full h-6 w-6 bg-gray-900 hover:bg-gray-700 cursor-pointer border-none">
                  <X className="text-white" />
                </AlertDialogCancel>
              </div>
            </div>
          </div>
          <AlertDialogDescription>
            Empresa: <br />
            <span className="font-bold text-base">{companyName}</span>
            <br />
            Descrição: {receivable.description}
            <br />
            Valor: {formatToBRL(receivable.amount)}
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
              <option value="PAID">Recebido</option> {/* Mudei de "Pago" */}
              <option value="OVERDUE">Vencido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Data de Recebimento {/* Mudei de "Pagamento" */}
              {formData.status === "PAID" && !formData.receivedDate && (
                <span className="text-orange-500 text-xs ml-2">
                  (Será preenchida com hoje)
                </span>
              )}
            </label>
            <input
              type="date"
              value={formData.receivedDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  receivedDate: e.target.value,
                }))
              }
              className="w-full border rounded-md p-2"
              disabled={formData.status !== "PAID"}
            />
            {formData.status !== "PAID" && (
              <p className="text-xs text-gray-500 mt-1">
                Data de recebimento só é editável quando status é "Recebido"
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating || isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-smart-news-purple-one hover:bg-smart-news-purple-one/70"
            onClick={handleSave}
            disabled={isUpdating || isDeleting}
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Salvando...
              </div>
            ) : (
              "Salvar Alterações"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReceivableCardCompany;
