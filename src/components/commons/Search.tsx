import { ChevronLeft, FileText, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";
import type { SearchFilters } from "@/types/filters";
import { useCompanies } from "@/hooks/useCompanies";
import InfiniteSelect from "./InfiniteSelect";

interface SearchComponentProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  currentFilters: SearchFilters;
  dateBounds?: { min: string; max: string };
}

const SearchComponent = ({
  onSearch,
  onClear,
  currentFilters,
}: SearchComponentProps) => {
  const { data: companies } = useCompanies();

  const [initialDate, setInitialDate] = useState<string>(
    currentFilters.dateRange?.start || ""
  );
  const [finalDate, setFinalDate] = useState<string>(
    currentFilters.dateRange?.end || ""
  );
  const [costCenter, setCostCenter] = useState(currentFilters.costCenter || "");
  const [emitidos, setEmitidos] = useState(currentFilters.emitidos);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: SearchFilters = {
      dateRange:
        initialDate && finalDate
          ? {
              start: initialDate,
              end: finalDate,
            }
          : null,
      costCenter: costCenter || null,
      emitidos,
    };

    onSearch(filters);
  };

  const handleClear = () => {
    setInitialDate("");
    setFinalDate("");
    setCostCenter("");
    setEmitidos(false);
    onClear();
  };

  return (
    <div className="border border-smart-news-gray-three p-4 rounded-md">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-x-2"
      >
        <div className="flex items-center gap-2.5 ml-2">
          <Button
            type="button"
            onClick={handleClear}
            className="w-[45px] h-[35px] bg-smart-news-purple-two text-smart-news-purple-one hover:bg-purple-300 cursor-pointer mr-3"
          >
            <ChevronLeft className="scale-125" />
          </Button>

          {/* Centro de Custo
          <div className="flex flex-col w-72">
            <label
              htmlFor="cost"
              className="text-xs mb-2.5 text-smart-news-gray-one"
            >
              Centro de Custo:
            </label>
            <select
              name="cost"
              id="cost"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              className="border border-smart-news-gray-three rounded-md h-9 px-2.5"
            >
              <option value="">Todas</option>
              {companies?.map((company) => {
                return (
                  <option value={company.name} key={company.id}>
                    {company.name}
                  </option>
                );
              })}
            </select>
          </div> */}
          {/* Centro de Custo com Infinite Scroll */}
          <div className="flex flex-col w-72">
            <label
              htmlFor="cost"
              className="text-xs mb-2.5 text-smart-news-gray-one"
            >
              Centro de Custo:
            </label>
            <InfiniteSelect
              value={costCenter}
              onChange={setCostCenter}
              placeholder="Todas as empresas"
            />
          </div>

          {/* Data Inicial */}
          <div className="flex flex-col gap-3 w-72">
            <Label
              htmlFor="initialDate"
              className="px-1 text-smart-news-gray-one text-xs"
            >
              Data inicial:
            </Label>
            <input
              type="date"
              id="initialDate"
              value={initialDate}
              placeholder="Data inicial"
              className="border p-2 rounded text-sm"
              onChange={(e) => setInitialDate(e.target.value)}
            />
          </div>

          {/* Data Final */}
          <div className="flex flex-col gap-3 w-72">
            <Label
              htmlFor="finalDate"
              className="px-1 text-smart-news-gray-one text-xs"
            >
              Data final:
            </Label>
            <input
              id="finalDate"
              type="date"
              value={finalDate}
              placeholder="Data final"
              className="border p-2 rounded text-sm"
              onChange={(e) => setFinalDate(e.target.value)}
            />
          </div>

          {/* Checkbox */}
          <div className="mt-10">
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                name="Emitidos"
                checked={emitidos}
                onChange={(e) => setEmitidos(e.target.checked)}
              />
              Emitidos
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            className="bg-smart-news-purple-two hover:bg-smart-news-purple-two/80 text-smart-news-purple-one uppercase text-xs font-bold w-20 h-[45px] cursor-pointer"
          >
            <FileText className="scale-90" />
            PDF
          </Button>
          <Button
            type="submit"
            className="bg-smart-news-purple-one hover:bg-smart-news-purple-one/80 text-white uppercase text-xs font-bold w-[130px] h-[45px] cursor-pointer"
          >
            <Search className="scale-90" />
            Pesquisar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
