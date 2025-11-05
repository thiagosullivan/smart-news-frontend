import CardCompany from "@/components/Payables/PayableCardCompany";
import { useCompanies } from "@/hooks/useCompanies";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const PayablesPage = () => {
  const { data: companies } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState("");

  if (!companies) {
    return (
      <section className="bg-white mt-4">
        <div className="centered-container py-4 flex items-center justify-center">
          <Loader2 className="animte-spin" />
        </div>
      </section>
    );
  }

  const filteredCompanies = selectedCompany
    ? companies.filter((company) => company.name === selectedCompany)
    : companies;

  return (
    <section className="bg-white mt-4">
      <div className="centered-container py-4">
        <div className="border border-smart-news-gray-three rounded-md p-8">
          <h1 className="text-xl font-semibold text-smart-news-gray-two mb-8">
            Contas à Pagar
          </h1>
          <div className="w-full">
            <div className="mb-8 max-w-[900px] w-full">
              <h3 className="mb-3.5">Empresa</h3>

              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="border border-smart-news-gray-three w-full h-10 rounded-md p-2"
              >
                <option value="">Todas as empresas</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) =>
                company.accountsPayable.map((payable) => (
                  <CardCompany
                    key={payable.id}
                    payable={payable}
                    companyName={company.name}
                    companyId={company.id}
                  />
                ))
              )}
            </div>

            {filteredCompanies.every(
              (company) => company.accountsPayable.length === 0
            ) && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma conta a pagar encontrada
                {selectedCompany && ` para ${selectedCompany}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayablesPage;
