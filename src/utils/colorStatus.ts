import type { AccountStatus } from "@/types/company";

export function getAccountStatusColor(status: AccountStatus): string {
  const colors = {
    PENDING: "text-yellow-500",
    PAID: "text-green-500",
    OVERDUE: "text-red-500",
    CANCELLED: "text-gray-500",
  };
  return colors[status];
}
