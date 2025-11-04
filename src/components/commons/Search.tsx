import { Button } from "../ui/button";
import { ChevronDownIcon, ChevronLeft, FileText, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { Label } from "../ui/label";

const SearchComponent = () => {
  const [intialOpen, setInitialOpen] = useState(false);
  const [finalOpen, setFinalOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
  const [finalDate, setFinalDate] = useState<Date | undefined>(undefined);

  console.log(initialDate, "INITIAL DATE");
  console.log(finalDate, "FINAL DATE");
  return (
    <div className="border border-smart-news-gray-three p-4 rounded-md">
      <form className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Button className="w-[45px] h-[35px] bg-smart-news-purple-two text-smart-news-purple-one hover:bg-purple-300 cursor-pointer mr-3">
            <ChevronLeft className="scale-125" />
          </Button>
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
              className="border border-smart-news-gray-three rounded-md h-9 px-2.5"
              defaultValue={"Default"}
            >
              <option value="Default" disabled>
                Selecionar
              </option>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
          </div>
          <div className="flex flex-col gap-3 w-72">
            <Label
              htmlFor="initialDate"
              className="px-1 text-smart-news-gray-one text-xs"
            >
              Data inicial:
            </Label>
            <Popover open={intialOpen} onOpenChange={setInitialOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="initialDate"
                  className="w-72 justify-between font-normal"
                >
                  {initialDate
                    ? initialDate.toLocaleDateString()
                    : "Selecione uma data"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={initialDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setInitialDate(date);
                    setInitialOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3 w-72">
            <Label
              htmlFor="finalDate"
              className="px-1 text-smart-news-gray-one text-xs"
            >
              Data final:
            </Label>
            <Popover open={finalOpen} onOpenChange={setFinalOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="finalDate"
                  className="w-72 justify-between font-normal"
                >
                  {finalDate
                    ? finalDate.toLocaleDateString()
                    : "Selecione uma data"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={finalDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFinalDate(date);
                    setFinalOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-10">
            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" name="Emitidos" />
              Emitidos
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button className="bg-smart-news-purple-two hover:bg-smart-news-purple-two/80 text-smart-news-purple-one uppercase text-xs font-bold w-20 h-[45px] cursor-pointer">
            <FileText className="scale-90" />
            PDF
          </Button>
          <Button className="bg-smart-news-purple-one hover:bg-smart-news-purple-one/80 text-white uppercase text-xs font-bold w-[130px] h-[45px] cursor-pointer">
            <Search className="scale-90" />
            Pesquisar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
