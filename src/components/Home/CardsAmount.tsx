import { formatToBRL } from "@/utils/formatToBRL";

type CardType = "receivable" | "payable" | "balance";

interface CardsAmountProps {
  type: CardType;
  amount: number;
}

const cardConfig = {
  receivable: {
    title: "Total Receita",
    icon: "/src/assets/icon-card-receivable.png",
    borderColor: "#23c560",
  },
  payable: {
    title: "Total Despesas",
    icon: "/src/assets/icon-card-payable.png",
    borderColor: "#ed4343",
  },
  balance: {
    title: "Lucro Líquido",
    icon: "/src/assets/icon-card-balance.png",
    borderColor: "#e9b308",
  },
};

const CardsAmount = ({ type, amount }: CardsAmountProps) => {
  const config = cardConfig[type];

  return (
    <div className="border border-smart-news-gray-three rounded-md w-full max-w-[300px] overflow-hidden h-full">
      <div
        className="border-b-6 p-4 h-full min-h-[115px]"
        style={{ borderBottomColor: config.borderColor }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="uppercase text-sm font-bold text-smart-news-gray-two">
            {config.title}
          </h3>
          <img src={config.icon} alt={config.title} />
        </div>
        <p className="text-smart-news-gray-two">{formatToBRL(amount)}</p>
      </div>
    </div>
  );
};

export default CardsAmount;
