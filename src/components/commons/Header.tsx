import {
  ArrowDown,
  ArrowUp,
  ChartLine,
  Grid2x2,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
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
import InfiniteSelect from "./InfiniteSelect";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useCreateCompany } from "@/hooks/useCreateCompany";
import CurrencyInput from "react-currency-input-field";
import { useAddReceivable } from "@/hooks/useAddReceivable";
import { useAddPayable } from "@/hooks/useAddPayable";
import { useCompanies } from "@/hooks/useCompanies";
import { toast } from "sonner";

const Header = () => {
  const { mutate: createCompany, isPending: isCreatingCompany } =
    useCreateCompany();
  const { mutate: addReceivable, isPending: isAddingReceivable } =
    useAddReceivable();
  const { mutate: addPayable, isPending: isAddingPayable } = useAddPayable();
  const { data: companies = [] } = useCompanies();

  const isPending = isCreatingCompany || isAddingReceivable || isAddingPayable;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [costCenter, setCostCenter] = useState("");

  const [formData, setFormData] = useState({
    companyId: "",
    companyName: "",
    costCenterName: "Principal",
    description: "",
    amount: "",
    dueDate: "",
    status: "PENDING",
    paymentDate: "",
    accountType: "receive",
    mode: "create",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompanySelect = (companyId: string) => {
    const selectedCompany = companies?.find(
      (company) => company.id === companyId
    );

    setFormData((prev) => ({
      ...prev,
      companyId: companyId,
      companyName: selectedCompany?.name || "",
      mode: "select",
    }));
  };

  const handleCompanyNameInput = (companyName: string) => {
    setFormData((prev) => ({
      ...prev,
      companyId: "",
      companyName: companyName,
      mode: "create",
    }));
  };

  const handleSubmit = () => {
    if (!formData.companyName.trim()) {
      console.error("Selecione ou digite o nome da empresa");
      return;
    }

    if (formData.mode === "select" && formData.companyId) {
      const accountData = {
        description: formData.description || "Conta sem descrição",
        amount: formData.amount || "0.00",
        dueDate: formData.dueDate || new Date().toISOString().split("T")[0],
        status: formData.status,
        ...(formData.status === "PAID" && {
          [formData.accountType === "receive" ? "receivedDate" : "paidDate"]:
            formData.paymentDate || new Date().toISOString().split("T")[0],
        }),
      };

      if (formData.accountType === "receive") {
        addReceivable(
          {
            companyId: formData.companyId,
            data: accountData,
          },
          {
            onSuccess: () => {
              resetForm();
              setIsDialogOpen(false);
              toast.success("Item atualizado!", {
                style: {
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                },
              });
            },
            onError: (error) => {
              console.error(
                error.message || "Erro ao adicionar conta a receber"
              );
              toast.error("Item atualizado!", {
                style: {
                  backgroundColor: "#c74242",
                  color: "#fff",
                },
              });
            },
          }
        );
      } else {
        addPayable(
          {
            companyId: formData.companyId,
            data: accountData,
          },
          {
            onSuccess: () => {
              toast.success("Item atualizado!", {
                style: {
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                },
              });
              resetForm();
              setIsDialogOpen(false);
            },
            onError: (error) => {
              console.error(error.message || "Erro ao adicionar conta a pagar");
              toast.error("Item atualizado!", {
                style: {
                  backgroundColor: "#c74242",
                  color: "#fff",
                },
              });
            },
          }
        );
      }
    } else {
      const companyData = {
        name: formData.companyName,
        costCenters: [
          {
            name: "Principal",
            description: "Centro de custo principal",
          },
        ],
        accountsReceivable:
          formData.accountType === "receive"
            ? [
                {
                  description: formData.description || "Conta sem descrição",
                  amount: formData.amount || "0.00",
                  dueDate:
                    formData.dueDate || new Date().toISOString().split("T")[0],
                  status: formData.status,
                  receivedDate:
                    formData.status === "PAID"
                      ? formData.paymentDate ||
                        new Date().toISOString().split("T")[0]
                      : undefined,
                },
              ]
            : [],
        accountsPayable:
          formData.accountType === "pay"
            ? [
                {
                  description: formData.description || "Conta sem descrição",
                  amount: formData.amount || "0.00",
                  dueDate:
                    formData.dueDate || new Date().toISOString().split("T")[0],
                  status: formData.status,
                  paidDate:
                    formData.status === "PAID"
                      ? formData.paymentDate ||
                        new Date().toISOString().split("T")[0]
                      : undefined,
                },
              ]
            : [],
      };

      createCompany(companyData, {
        onSuccess: (data) => {
          toast.success("Item atualizado!", {
            style: {
              backgroundColor: "#4CAF50",
              color: "#fff",
            },
          });
          resetForm();
          setIsDialogOpen(false);
        },
        onError: (error) => {
          console.error(error.message || "Erro ao criar empresa");
          toast.error("Item atualizado!", {
            style: {
              backgroundColor: "#c74242",
              color: "#fff",
            },
          });
        },
      });
    }
  };

  const resetForm = () => {
    setFormData({
      companyId: "",
      companyName: "",
      costCenterName: "Principal",
      description: "",
      amount: "",
      dueDate: "",
      status: "PENDING",
      paymentDate: "",
      accountType: "receive",
      mode: "create",
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="centered-container p-4 flex justify-between flex-col md:flex-row">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="border-b border-gray-300 md:border-none">
            <AlertDialogTrigger asChild>
              <Button className="bg-white cursor-pointer text-smart-news-gray-one text-sm">
                <Plus />
                Cadastro
              </Button>
            </AlertDialogTrigger>
            <Button
              className="bg-white cursor-pointer text-smart-news-gray-one text-sm"
              asChild
            >
              <Link to="/pagaveis">
                <ArrowDown />
                Contas à Pagar
              </Link>
            </Button>
            <Button
              className="bg-white cursor-pointer text-smart-news-gray-one text-sm"
              asChild
            >
              <Link to="/recebiveis">
                <ArrowUp />
                Contas à Receber
              </Link>
            </Button>
            <Button
              className="bg-white cursor-pointer text-smart-news-gray-one text-sm"
              asChild
            >
              <Link to="/">
                <ChartLine />
                Relatórios
              </Link>
            </Button>
          </div>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader className="relative">
              <div className="mb-4 flex items-center justify-between">
                <AlertDialogTitle>Cadastrar novas informações</AlertDialogTitle>
              </div>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  {/* Seleção/Criação de Empresa */}
                  <div className="border-b border-gray-300 pb-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Empresa
                    </h3>
                    <Tabs
                      value={formData.mode}
                      onValueChange={(value) =>
                        handleInputChange("mode", value)
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="select">
                          Selecionar Empresa
                        </TabsTrigger>
                        <TabsTrigger value="create">
                          Criar Nova Empresa
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="select">
                        <InfiniteSelect
                          value={formData.companyId}
                          onChange={handleCompanySelect}
                          placeholder="Selecione uma empresa"
                          returnId={true}
                        />
                      </TabsContent>

                      <TabsContent value="create">
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInputChange("companyName", e.target.value)
                          }
                          className="border border-gray-300 rounded-md h-10 w-full px-3"
                          placeholder="Digite o nome da nova empresa"
                          disabled={isPending}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Tipo de Conta */}
                  <div className="border-b border-gray-300 pb-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Tipo de Conta
                    </h3>
                    <Tabs
                      value={formData.accountType}
                      onValueChange={(value) =>
                        handleInputChange("accountType", value)
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="receive">
                          Conta a Receber
                        </TabsTrigger>
                        <TabsTrigger value="pay">Conta a Pagar</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Dados da Conta */}
                  <div className="border-b border-gray-300 pb-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Dados da{" "}
                      {formData.accountType === "receive"
                        ? "Conta a Receber"
                        : "Conta a Pagar"}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Valor (R$)
                        </label>
                        <CurrencyInput
                          name="amount"
                          value={formData.amount}
                          onValueChange={(value) =>
                            handleInputChange("amount", value || "")
                          }
                          className="border border-gray-300 rounded-md h-9 w-full px-2"
                          placeholder="0,00"
                          decimalsLimit={2}
                          decimalScale={2}
                          decimalSeparator=","
                          groupSeparator="."
                          prefix="R$ "
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                          className="border border-gray-300 rounded-md h-9 w-full px-2"
                        >
                          <option value="PENDING">Pendente</option>
                          <option value="PAID">
                            {formData.accountType === "receive"
                              ? "Recebido"
                              : "Pago"}
                          </option>
                          <option value="OVERDUE">Vencido</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Data de Vencimento
                        </label>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) =>
                            handleInputChange("dueDate", e.target.value)
                          }
                          className="border border-gray-300 rounded-md h-9 w-full px-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Data de{" "}
                          {formData.accountType === "receive"
                            ? "Recebimento"
                            : "Pagamento"}
                        </label>
                        <input
                          type="date"
                          value={formData.paymentDate}
                          onChange={(e) =>
                            handleInputChange("paymentDate", e.target.value)
                          }
                          disabled={formData.status !== "PAID"}
                          className="border border-gray-300 rounded-md h-9 w-full px-2 disabled:bg-gray-100"
                        />
                        {formData.status !== "PAID" && (
                          <p className="text-xs text-gray-500 mt-1">
                            Disponível apenas quando status é "
                            {formData.accountType === "receive"
                              ? "Recebido"
                              : "Pago"}
                            "
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Descrição da Conta */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Descrição da Conta
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="border border-gray-300 rounded-md h-10 w-full px-3"
                      placeholder="Descreva a conta..."
                    />
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={resetForm}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-smart-news-purple-one hover:bg-smart-news-purple-one/70"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cadastrando...
                  </div>
                ) : (
                  "Cadastrar"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button className=" bg-white cursor-pointer text-smart-news-gray-one">
            <Search className="scale-125" />
          </Button>
          <Button className="bg-white cursor-pointer text-smart-news-gray-one text-sm">
            <Grid2x2 className="scale-125" />
          </Button>
          <div className="flex items-center">
            <div className="text-xs text-right mr-2.5">
              <p className="text-smart-news-gray-one">Admin</p>
              <p className="text-smart-news-gray-two font-bold">Financeiro</p>
            </div>
            <span className="w-7 h-7 flex justify-center items-center rounded-sm bg-smart-news-purple-two text-smart-news-purple-one font-bold">
              A
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
