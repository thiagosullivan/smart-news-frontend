import React from "react";
import { formatToBRL } from "@/utils/formatToBRL";
import type { Company } from "@/types/company";

interface CompaniesTableProps {
  companies: Company[];
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({ companies }) => {
  console.log(companies, "COMP TAB");
  // Calcula totais gerais
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

  const totalResult = totalReceivable - totalPayable;

  return (
    <div className="rounded-md overflow-hidden border border-gray-300">
      <table className="w-full max-w-[620px] min-h-[500px]">
        <thead>
          <tr className="bg-gray-300 text-left text-xs">
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="font-medium">Despesa</th>
            <th className="font-medium">Receita</th>
            <th className="font-medium">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => {
            const companyReceivable = company.accountsReceivable.reduce(
              (sum, ar) => sum + ar.amount,
              0
            );
            const companyPayable = company.accountsPayable.reduce(
              (sum, ap) => sum + ap.amount,
              0
            );
            const companyResult = companyReceivable - companyPayable;

            console.log(companyResult, "RESULT TABLE");

            return (
              <tr key={company.id} className="text-xs uppercase">
                <td className="border-b border-gray-300 py-5 pl-4 pr-1.5 max-w-[225px]">
                  {company.name}
                </td>
                <td className="border-b border-gray-300 py-5 pr-1.5 max-w-[225px]">
                  {formatToBRL(companyPayable)}
                </td>
                <td className="border-b border-gray-300 py-5 pr-1.5 max-w-[225px]">
                  {formatToBRL(companyReceivable)}
                </td>
                <td className="border-b border-gray-300 py-5 pr-1.5 max-w-[225px]">
                  <div className="flex items-center gap-2">
                    {formatToBRL(companyResult)}
                    {companyResult < 0 ? (
                      <img
                        src="/src/assets/icon-result-down.png"
                        className="ml-2.5"
                      />
                    ) : (
                      <img
                        src="/src/assets/icon-result-up.png"
                        className="ml-2.5"
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-smart-news-purple-one text-left text-xs text-white">
          <tr>
            <td className="px-4 py-3">Total</td>
            <td className="px-1">{formatToBRL(totalReceivable)}</td>
            <td className="px-1">{formatToBRL(totalPayable)}</td>
            <td className="pr-4">{formatToBRL(totalResult)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CompaniesTable;
