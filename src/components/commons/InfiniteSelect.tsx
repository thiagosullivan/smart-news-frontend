import React, { useState, useRef, useEffect, useCallback } from "react";
import { useCompaniesSelect } from "@/hooks/useCompaniesSelect";
import { LoaderCircle } from "lucide-react";

interface InfiniteSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  returnId?: boolean;
}

const InfiniteSelect: React.FC<InfiniteSelectProps> = ({
  value,
  onChange,
  placeholder = "Selecione...",
  returnId = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const sentinelRef = useRef<HTMLLIElement>(null);

  const {
    data: companies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useCompaniesSelect(searchTerm);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage || !isOpen)
      return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isOpen) {
          console.log("Carregando mais empresas...");
          fetchNextPage();
        }
      },
      {
        root: listRef.current,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    isOpen,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    companies.length,
  ]);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);

  const handleSelect = (companyId: string, companyName: string) => {
    const returnValue = returnId ? companyId : companyName;
    onChange(returnValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const getDisplayValue = () => {
    if (isOpen) {
      return searchTerm;
    }

    if (returnId) {
      const selectedCompany = companies.find((company) => company.id === value);
      return selectedCompany?.name || "";
    } else {
      return value;
    }
  };

  const displayValue = getDisplayValue();

  return (
    <div ref={selectRef} className="relative w-full">
      <div
        className="border border-smart-news-gray-three rounded-md h-9 px-2.5 flex items-center cursor-pointer bg-white"
        onClick={handleInputClick}
      >
        <input
          type="text"
          className="w-full outline-none bg-transparent cursor-pointer"
          value={displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          readOnly={!isOpen}
        />
        <span className="transform rotate-90">›</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-smart-news-gray-three rounded-md shadow-lg">
          <ul
            ref={listRef}
            className="max-h-60 overflow-y-auto"
            style={{ maxHeight: "240px" }}
          >
            {isLoading && companies.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                Carregando empresas...
              </li>
            ) : companies.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                {searchTerm
                  ? "Nenhuma empresa encontrada"
                  : "Nenhuma empresa disponível"}
              </li>
            ) : (
              <>
                {companies.map((company) => (
                  <li
                    key={company.id}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      (returnId ? value === company.id : value === company.name)
                        ? "bg-smart-news-purple-two text-smart-news-purple-one"
                        : ""
                    }`}
                    onClick={() => handleSelect(company.id, company.name)}
                  >
                    {company.name}
                  </li>
                ))}

                {hasNextPage && (
                  <li
                    ref={sentinelRef}
                    className="px-3 py-2 text-sm text-center"
                  >
                    {isFetchingNextPage ? (
                      <div className="text-gray-500 flex items-center gap-x-2">
                        <LoaderCircle className="animate-spin" />
                        <p>Carregando mais empresas...</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        ↓ Role para carregar mais
                      </span>
                    )}
                  </li>
                )}

                {!hasNextPage && companies.length > 0 && (
                  <li className="px-3 py-2 text-sm text-gray-400 text-center border-t">
                    Todas as {companies.length} empresas foram carregadas.
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InfiniteSelect;
