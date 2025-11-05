import SearchComponent from "@/components/commons/Search";
import Accounts from "@/components/Home/Accounts";
import type { SearchFilters } from "@/types/filters";
import { useState } from "react";

const HomePage = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: null,
    costCenter: null,
    emitidos: false,
  });

  const handleSearch = (newFilters: SearchFilters) => {
    // console.log("Filtrando com:", newFilters);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    // console.log("Limpando filtros");
    setFilters({
      dateRange: null,
      costCenter: null,
      emitidos: false,
    });
  };

  return (
    <section className="bg-white mt-4">
      <div className="centered-container py-4">
        <SearchComponent
          onSearch={handleSearch}
          onClear={handleClearFilters}
          currentFilters={filters}
        />
        <Accounts filters={filters} />
      </div>
    </section>
  );
};

export default HomePage;
