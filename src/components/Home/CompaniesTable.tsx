import React from "react";
import { formatToBRL } from "@/utils/formatToBRL";
import type { Company } from "@/types/company";
import resultDown from "@/assets/icon-result-down.png";
import resultUp from "@/assets/icon-result-up.png";

interface CompaniesTableProps {
  companies: Company[];
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({ companies }) => {
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
    <div className="rounded-md overflow-hidden border border-gray-300 h-full ">
      <table className="w-full ">
        <thead>
          <tr className="bg-gray-300 text-left text-xs">
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="font-medium">Despesa</th>
            <th className="font-medium">Receita</th>
            <th className="font-medium">Resultado</th>
          </tr>
        </thead>
        <tbody className="h-[415px]">
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

            return (
              <tr
                key={company.id}
                className="text-[10px] 2sm:text-xs uppercase"
              >
                <td className="border-b border-gray-300 sm:py-5 sm:pl-4 sm:pr-1.5 max-w-[225px] p-1">
                  {company.name}
                </td>
                <td className="border-b border-gray-300 sm:py-5 sm:pr-1.5 max-w-[225px] p-1">
                  {formatToBRL(companyPayable)}
                </td>
                <td className="border-b border-gray-300 sm:py-5 sm:pr-1.5 max-w-[225px] p-1">
                  {formatToBRL(companyReceivable)}
                </td>
                <td className="border-b border-gray-300 sm:py-5 sm:pr-4 max-w-[225px] p-1">
                  <div className="flex items-center justify-between sm:gap-2 gap-1 flex-col sm:flex-row">
                    {formatToBRL(companyResult)}
                    {companyResult < 0 ? (
                      <img src={resultDown} className="sm:ml-2.5" />
                    ) : (
                      <img src={resultUp} className="sm:ml-2.5" />
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
