import { useCompanies } from "@/hooks/useCompanies";
import {
  calculateTotalAmountAllCompanies,
  calculateTotalOverdueAmounts,
  calculateTotalUpcomingAmounts,
} from "@/utils/calculateFinalAmount";
import CardsAmount from "./CardsAmount";
import CardsAccounts from "./CardsAccounts";
import { LoaderCircle } from "lucide-react";
import FinancialLineChart from "./LineCharts";
import type { SearchFilters } from "@/types/filters";
import CompaniesTable from "./CompaniesTable";

interface AccountsProps {
  filters: SearchFilters;
}

const Accounts = ({ filters }: AccountsProps) => {
  const { data: companies, isPending, error } = useCompanies();

  if (isPending)
    return (
      <div className="flex items-center justify-center h-80">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  if (error) return <div>Erro ao carregar empresas</div>;

  if (companies?.length === 0) return <div>Nenhuma empresa encontrada</div>;

  const filteredCompanies = companies.filter((company) => {
    if (!filters.costCenter || filters.costCenter === "") {
      return true;
    }

    return company.name === filters.costCenter;
  });

  const totalSummary = calculateTotalAmountAllCompanies(filteredCompanies);
  const { totalOverdueReceivable, totalOverduePayable } =
    calculateTotalOverdueAmounts(filteredCompanies);
  const { totalUpcomingReceivable, totalUpcomingPayable } =
    calculateTotalUpcomingAmounts(filteredCompanies);

  console.log(totalSummary, "TOTAL SUMARY");
  console.log(
    "CONTAS VENCIDAS - A Receber:",
    totalOverdueReceivable,
    "A Pagar:",
    totalOverduePayable
  );
  console.log(
    "CONTAS À VENCER - A Receber:",
    totalUpcomingReceivable,
    "A Pagar:",
    totalUpcomingPayable
  );

  return (
    <section className="my-4">
      <div className="flex items-center justify-between">
        <CardsAmount type="receivable" amount={totalSummary.totalReceivable} />
        <CardsAmount type="payable" amount={totalSummary.totalPayable} />
        <CardsAmount type="balance" amount={totalSummary.balance} />

        <CardsAccounts
          type="overdueAccounts"
          amountToPay={totalOverduePayable}
          amountToReceive={totalOverdueReceivable}
        />

        <CardsAccounts
          type="upcomingAccounts"
          amountToPay={totalUpcomingPayable}
          amountToReceive={totalUpcomingReceivable}
        />
      </div>
      <div className="my-4 flex items-center justify-between gap-2">
        <div className="my-4 max-w-[935px] w-full">
          <FinancialLineChart companies={filteredCompanies} filters={filters} />
        </div>
        <div>
          <CompaniesTable companies={companies} />
        </div>
      </div>
    </section>
  );
};

export default Accounts;
