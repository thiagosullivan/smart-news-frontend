export type AccountStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface AccountReceivable {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  receivedDate: string | null;
  status: AccountStatus;
  companyId: string;
  costCenterId: string | null;
}

export interface AccountPayable {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  paidDate: string | null;
  status: AccountStatus;
  companyId: string;
  costCenterId: string | null;
}

export interface CostCenter {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  costCenters: CostCenter[];
  accountsReceivable: AccountReceivable[];
  accountsPayable: AccountPayable[];
}

export interface CompanyCardData {
  company: Company;
}

export interface FinancialSummary {
  totalReceivable: number;
  totalPayable: number;
  balance: number;
  overdueReceivable: number;
  pendingReceivable: number;
}

export type CompanyCardDataArray = CompanyCardData[];
