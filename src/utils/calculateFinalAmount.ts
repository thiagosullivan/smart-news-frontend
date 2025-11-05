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

  const { overdueReceivable, overduePayable } =
    calculateOverdueAmounts(company);
  const { upcomingReceivable, upcomingPayable } =
    calculateUpcomingAmounts(company);

  return {
    totalReceivable,
    totalPayable,
    balance: totalReceivable - totalPayable,
    overdueReceivable,
    pendingReceivable: upcomingReceivable,
  };
}

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

  const { totalOverdueReceivable, totalOverduePayable } =
    calculateTotalOverdueAmounts(companies);
  const { totalUpcomingReceivable, totalUpcomingPayable } =
    calculateTotalUpcomingAmounts(companies);

  return {
    totalReceivable,
    totalPayable,
    balance: totalReceivable - totalPayable,
    overdueReceivable: totalOverdueReceivable,
    pendingReceivable: totalUpcomingReceivable,
  };
}

export function calculateOverdueAmounts(company: Company) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueReceivable = company.accountsReceivable
    .filter((ar) => {
      const dueDate = new Date(ar.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    })
    .reduce((sum, ar) => sum + ar.amount, 0);

  const overduePayable = company.accountsPayable
    .filter((ap) => {
      const dueDate = new Date(ap.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    })
    .reduce((sum, ap) => sum + ap.amount, 0);

  return {
    overdueReceivable,
    overduePayable,
  };
}

export function calculateUpcomingAmounts(company: Company) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingReceivable = company.accountsReceivable
    .filter((ar) => {
      const dueDate = new Date(ar.dueDate);
      return dueDate >= today;
    })
    .reduce((sum, ar) => sum + ar.amount, 0);

  const upcomingPayable = company.accountsPayable
    .filter((ap) => {
      const dueDate = new Date(ap.dueDate);
      return dueDate >= today;
    })
    .reduce((sum, ap) => sum + ap.amount, 0);

  return {
    upcomingReceivable,
    upcomingPayable,
  };
}

export function calculateTotalOverdueAmounts(companies: Company[]) {
  let totalOverdueReceivable = 0;
  let totalOverduePayable = 0;

  companies.forEach((company) => {
    const { overdueReceivable, overduePayable } =
      calculateOverdueAmounts(company);
    totalOverdueReceivable += overdueReceivable;
    totalOverduePayable += overduePayable;
  });

  return {
    totalOverdueReceivable,
    totalOverduePayable,
  };
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

  return {
    totalUpcomingReceivable,
    totalUpcomingPayable,
  };
}

export function calculateAllUpcomingAmounts(company: Company) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allUpcomingReceivable = company.accountsReceivable
    .filter((ar) => {
      const dueDate = new Date(ar.dueDate);
      return dueDate >= today;
    })
    .reduce((sum, ar) => sum + ar.amount, 0);

  const allUpcomingPayable = company.accountsPayable
    .filter((ap) => {
      const dueDate = new Date(ap.dueDate);
      return dueDate >= today;
    })
    .reduce((sum, ap) => sum + ap.amount, 0);

  return {
    allUpcomingReceivable,
    allUpcomingPayable,
  };
}
