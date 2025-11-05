import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import type { Company } from "@/types/company";
import { formatToBRL } from "@/utils/formatToBRL";
import type { SearchFilters } from "@/types/filters";

interface FinancialLineChartProps {
  companies: Company[];
  filters: SearchFilters;
}

interface ChartDataPoint {
  period: string;
  receber: number;
  pagar: number;
  periodDisplay: string;
  date: Date;
}

const FinancialLineChart = ({
  companies,
  filters,
}: FinancialLineChartProps) => {
  const chartData = useMemo(() => {
    const dataMap: {
      [key: string]: { receber: number; pagar: number; date: Date };
    } = {};

    const filteredCompanies = companies.filter((company) => {
      if (!filters.costCenter || filters.costCenter === "") {
        return true;
      }

      return company.name === filters.costCenter;
    });

    filteredCompanies.forEach((company) => {
      company.accountsReceivable.forEach((account) => {
        const date = new Date(account.dueDate);

        if (filters.dateRange) {
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          if (date < startDate || date > endDate) {
            return;
          }
        }

        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!dataMap[monthKey]) {
          dataMap[monthKey] = { receber: 0, pagar: 0, date };
        }
        dataMap[monthKey].receber += account.amount;
      });

      company.accountsPayable.forEach((account) => {
        const date = new Date(account.dueDate);

        if (filters.dateRange) {
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          if (date < startDate || date > endDate) {
            return;
          }
        }

        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!dataMap[monthKey]) {
          dataMap[monthKey] = { receber: 0, pagar: 0, date };
        }
        dataMap[monthKey].pagar += account.amount;
      });
    });

    const chartData: ChartDataPoint[] = Object.entries(dataMap)
      .map(([period, values]) => ({
        period,
        receber: values.receber,
        pagar: values.pagar,
        periodDisplay: formatPeriod(period),
        date: values.date,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return chartData;
  }, [companies, filters]);

  const hasReceivableData = useMemo(
    () => chartData.some((item) => item.receber > 0),
    [chartData]
  );

  const hasPayableData = useMemo(
    () => chartData.some((item) => item.pagar > 0),
    [chartData]
  );

  const hasAnyData = hasReceivableData || hasPayableData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{`Período: ${label}`}</p>
          {hasReceivableData && (
            <p className="text-[#A296C8]">
              Receber:{" "}
              {formatToBRL(
                payload.find((p: any) => p.dataKey === "receber")?.value || 0
              )}
            </p>
          )}
          {hasPayableData && (
            <p className="text-[#A0DBED]">
              Pagar:{" "}
              {formatToBRL(
                payload.find((p: any) => p.dataKey === "pagar")?.value || 0
              )}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`;
    }
    return formatToBRL(value);
  };

  const getEmptyMessage = () => {
    if (filters.costCenter && filters.dateRange) {
      return `Não constam dados da empresa "${
        filters.costCenter
      }" no período de ${new Date(filters.dateRange.start).toLocaleDateString(
        "pt-BR"
      )} a ${new Date(filters.dateRange.end).toLocaleDateString("pt-BR")}`;
    } else if (filters.costCenter) {
      return `Não constam dados da empresa "${filters.costCenter}"`;
    } else if (filters.dateRange) {
      return `Não constam dados no período de ${new Date(
        filters.dateRange.start
      ).toLocaleDateString("pt-BR")} a ${new Date(
        filters.dateRange.end
      ).toLocaleDateString("pt-BR")}`;
    }
    return "Nenhum dado disponível para o gráfico";
  };

  if (!hasAnyData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center border rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">📊</p>
          <p className="text-gray-500">{getEmptyMessage()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-semibold text-smart-news-gray-one uppercase">
          Resultados por períodos
        </h3>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodDisplay" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {hasReceivableData && (
              <Line
                type="monotone"
                dataKey="receber"
                name="Contas a Receber"
                stroke="#A296C8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {hasPayableData && (
              <Line
                type="monotone"
                dataKey="pagar"
                name="Contas a Pagar"
                stroke="#A0DBED"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-600 mt-2">
        {filters.dateRange ? (
          <p>
            Período:{" "}
            {new Date(filters.dateRange.start).toLocaleDateString("pt-BR")} até{" "}
            {new Date(filters.dateRange.end).toLocaleDateString("pt-BR")}
            {filters.costCenter && ` • Empresa: ${filters.costCenter}`}
            {!hasReceivableData && hasPayableData && " • Sem contas a receber"}
            {hasReceivableData && !hasPayableData && " • Sem contas a pagar"}
          </p>
        ) : (
          <p>
            Mostrando todo o período disponível
            {filters.costCenter && ` • Empresa: ${filters.costCenter}`}
            {!hasReceivableData && hasPayableData && " • Sem contas a receber"}
            {hasReceivableData && !hasPayableData && " • Sem contas a pagar"}
          </p>
        )}
      </div>
    </div>
  );
};

const formatPeriod = (period: string): string => {
  const [year, month] = period.split("-");
  return `${month}/${year}`;
};

export default FinancialLineChart;
