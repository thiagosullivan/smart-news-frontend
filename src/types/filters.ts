export interface DateFilter {
  start: string;
  end: string;
}

export interface SearchFilters {
  dateRange: DateFilter | null;
  costCenter: string | null;
  emitidos: boolean;
}
