import { formatToBRL } from "@/utils/formatToBRL";
import cardDate from "@/assets/icon-card-date.png";

type CardType = "upcomingAccounts" | "overdueAccounts";

interface CardsAccountsProps {
  type: CardType;
  amountToPay: number;
  amountToReceive: number;
}

const cardConfig = {
  overdueAccounts: {
    title: "Contas Vencidas:",
    icon: cardDate,
    borderColor: "#0da6e6",
  },
  upcomingAccounts: {
    title: "Contas A Vencer:",
    icon: cardDate,
    borderColor: "#0da6e6",
  },
};

const CardsAccounts = ({
  type,
  amountToPay,
  amountToReceive,
}: CardsAccountsProps) => {
  const config = cardConfig[type];

  return (
    <div className="border border-smart-news-gray-three rounded-md max-w-[300px] w-full overflow-hidden">
      <div
        className={`border-b-6 p-4 min-h-[115px] h-full`}
        style={{ borderBottomColor: config.borderColor }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="uppercase text-sm font-bold text-smart-news-gray-two">
            {config.title}
          </h3>
          <img src={config.icon} alt={config.title} />
        </div>
        <div className="flex items-center flex-wrap gap-x-3">
          <div className="">
            <h4 className="text-[10px] uppercase text-smart-news-gray-one">
              Receber:
            </h4>
            <div className="text-smart-news-gray-two">
              {amountToReceive <= 0 ? (
                <span>--</span>
              ) : (
                <span>{formatToBRL(amountToReceive)}</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] uppercase text-smart-news-gray-one">
              A Pagar:
            </h4>
            <div className="text-smart-news-gray-two">
              {amountToPay <= 0 ? (
                <span>--</span>
              ) : (
                <span>{formatToBRL(amountToPay)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsAccounts;
