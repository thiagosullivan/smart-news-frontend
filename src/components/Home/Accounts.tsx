import { useCompanies } from "@/hooks/useCompanies";
import {
  calculateTotalAmountAllCompanies,
  calculateTotalOverdueAmounts,
  calculateTotalUpcomingAmounts,
} from "@/utils/calculateFinalAmount";
import CardsAmount from "./CardsAmount";
import CardsAccounts from "./CardsAccounts";
import { LoaderCircle } from "lucide-react";

const Accounts = () => {
  const { data: companies, isPending, error } = useCompanies();

  if (isPending)
    return (
      <div className="flex items-center justify-center h-80">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  if (error) return <div>Erro ao carregar empresas</div>;

  if (companies?.length === 0) return <div>Nenhuma empresa encontrada</div>;

  const totalSummary = calculateTotalAmountAllCompanies(companies);
  const { totalOverdueReceivable, totalOverduePayable } =
    calculateTotalOverdueAmounts(companies);
  const { totalUpcomingReceivable, totalUpcomingPayable } =
    calculateTotalUpcomingAmounts(companies);
  console.log(companies, "COMPANIES");
  return (
    <section className="my-4">
      <div className="flex items-center justify-between">
        <CardsAmount type="receivable" amount={totalSummary.totalReceivable} />
        <CardsAmount type="payable" amount={totalSummary.totalPayable} />
        <CardsAmount type="balance" amount={totalSummary.balance} />

        <CardsAccounts
          type="finalAccounts"
          amountToPay={totalOverduePayable}
          amountToReceive={totalOverdueReceivable}
        />
        <CardsAccounts
          type="endedAccounts"
          amountToPay={totalUpcomingPayable}
          amountToReceive={totalUpcomingReceivable}
        />
      </div>
    </section>
  );
};

export default Accounts;
