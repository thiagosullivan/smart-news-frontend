import SearchComponent from "@/components/commons/Search";
import Accounts from "@/components/Home/Accounts";
import { usePdfExport } from "@/hooks/usePdfExport";
import type { SearchFilters } from "@/types/filters";
import { useState } from "react";

const HomePage = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: null,
    costCenter: null,
    emitidos: false,
  });

  const { pdfRef, generatePdf } = usePdfExport();

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: null,
      costCenter: null,
      emitidos: false,
    });
  };

  const handleGeneratePdf = () => {
    generatePdf(filters);
  };

  return (
    <section className="bg-white mt-4">
      <div className="centered-container py-4">
        <SearchComponent
          onSearch={handleSearch}
          onClear={handleClearFilters}
          currentFilters={filters}
          onGeneratePdf={handleGeneratePdf}
        />

        <div ref={pdfRef}>
          <Accounts filters={filters} />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
