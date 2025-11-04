import {
  ArrowDown,
  ArrowUp,
  ChartLine,
  Grid2x2,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="centered-container p-4 flex justify-between">
        <div>
          <Button className="bg-white cursor-pointer text-smart-news-gray-one text-sm">
            <Plus />
            Cadastro
          </Button>
          <Button className="bg-white cursor-pointer text-smart-news-gray-one text-sm">
            <ArrowDown />
            Contas à Pagar
          </Button>
          <Button className="bg-white cursor-pointer text-smart-news-gray-one text-sm">
            <ArrowUp />
            Contas à Receber
          </Button>
          <Button className="bg-white cursor-pointer text-smart-news-gray-one text-sm">
            <ChartLine />
            Relatórios
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button className=" bg-white cursor-pointer text-smart-news-gray-one">
            <Search className="scale-125" />
          </Button>
          <Button className="bg-white cursor-pointer text-smart-news-gray-one text-sm">
            <Grid2x2 className="scale-125" />
          </Button>
          <div className="flex items-center">
            <div className="text-xs text-right mr-2.5">
              <p className="text-smart-news-gray-one">Admin</p>
              <p className="text-smart-news-gray-two font-bold">Financeiro</p>
            </div>
            <span className="w-7 h-7 flex justify-center items-center rounded-sm bg-smart-news-purple-two text-smart-news-purple-one font-bold">
              A
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
