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

  return (
    <section className="my-4">
      <div className="grid grid-cols-1 2sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-1.5 w-full">
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
      <div className="my-5 flex flex-col lg:flex-row items-start justify-between gap-5 min-h-[500px]">
        <div className="max-w-[935px] w-full">
          <FinancialLineChart companies={filteredCompanies} filters={filters} />
        </div>
        <div className="w-full max-w-none lg:max-w-[620px]">
          <CompaniesTable companies={companies} />
        </div>
      </div>
    </section>
  );
};

export default Accounts;
