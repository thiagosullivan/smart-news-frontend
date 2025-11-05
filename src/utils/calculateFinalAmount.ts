import type { Company, FinancialSummary } from "@/types/company";

export function calculateFinalAmountSingleCompany(
  company: Company
): FinancialSummary {
  const totalReceivable = company.accountsReceivable.reduce(
    (sum, ar) => sum + ar.amount,
    0
  );
  const totalPayable = company.accountsPayable.reduce(
    (sum, ap) => sum + ap.amount,
    0
  );
  const overdueReceivable = company.accountsReceivable
    .filter((ar) => ar.status === "OVERDUE")
    .reduce((sum, ar) => sum + ar.amount, 0);
  const pendingReceivable = company.accountsReceivable
    .filter((ar) => ar.status === "PENDING")
    .reduce((sum, ar) => sum + ar.amount, 0);

  return {
    totalReceivable,
    totalPayable,
    balance: totalReceivable - totalPayable,
    overdueReceivable,
    pendingReceivable,
  };
}

// No seu arquivo de tipos ou utils
export function calculateTotalAmountAllCompanies(
  companies: Company[]
): FinancialSummary {
  const totalReceivable = companies.reduce(
    (sum, company) =>
      sum + company.accountsReceivable.reduce((acc, ar) => acc + ar.amount, 0),
    0
  );

  const totalPayable = companies.reduce(
    (sum, company) =>
      sum + company.accountsPayable.reduce((acc, ap) => acc + ap.amount, 0),
    0
  );

  const overdueReceivable = companies.reduce(
    (sum, company) =>
      sum +
      company.accountsReceivable
        .filter((ar) => ar.status === "OVERDUE")
        .reduce((acc, ar) => acc + ar.amount, 0),
    0
  );

  const pendingReceivable = companies.reduce(
    (sum, company) =>
      sum +
      company.accountsReceivable
        .filter((ar) => ar.status === "PENDING")
        .reduce((acc, ar) => acc + ar.amount, 0),
    0
  );

  return {
    totalReceivable,
    totalPayable,
    balance: totalReceivable - totalPayable,
    overdueReceivable,
    pendingReceivable,
  };
}

export function calculateOverdueAmounts(company: Company) {
  const today = new Date();

  const overdueReceivable = company.accountsReceivable
    .filter((ar) => ar.status === "OVERDUE" || new Date(ar.dueDate) < today)
    .reduce((sum, ar) => sum + ar.amount, 0);

  const overduePayable = company.accountsPayable
    .filter((ap) => ap.status === "OVERDUE" || new Date(ap.dueDate) < today)
    .reduce((sum, ap) => sum + ap.amount, 0);

  return { overdueReceivable, overduePayable };
}

export function calculateUpcomingAmounts(company: Company) {
  const today = new Date();
  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);

  const upcomingReceivable = company.accountsReceivable
    .filter(
      (ar) =>
        ar.status === "PENDING" &&
        new Date(ar.dueDate) > today &&
        new Date(ar.dueDate) <= next30Days
    )
    .reduce((sum, ar) => sum + ar.amount, 0);

  const upcomingPayable = company.accountsPayable
    .filter(
      (ap) =>
        ap.status === "PENDING" &&
        new Date(ap.dueDate) > today &&
        new Date(ap.dueDate) <= next30Days
    )
    .reduce((sum, ap) => sum + ap.amount, 0);

  return { upcomingReceivable, upcomingPayable };
}

// Para o total de todas as empresas
export function calculateTotalOverdueAmounts(companies: Company[]) {
  let totalOverdueReceivable = 0;
  let totalOverduePayable = 0;

  companies.forEach((company) => {
    const { overdueReceivable, overduePayable } =
      calculateOverdueAmounts(company);
    totalOverdueReceivable += overdueReceivable;
    totalOverduePayable += overduePayable;
  });

  return { totalOverdueReceivable, totalOverduePayable };
}

export function calculateTotalUpcomingAmounts(companies: Company[]) {
  let totalUpcomingReceivable = 0;
  let totalUpcomingPayable = 0;

  companies.forEach((company) => {
    const { upcomingReceivable, upcomingPayable } =
      calculateUpcomingAmounts(company);
    totalUpcomingReceivable += upcomingReceivable;
    totalUpcomingPayable += upcomingPayable;
  });

  return { totalUpcomingReceivable, totalUpcomingPayable };
}
