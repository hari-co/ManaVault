import { CardType } from "@/types/CardType";
import CardMenu from "./cardMenu";

const Card: React.FC<{ card: CardType }> = ({ card }) => {
    return (card.image_uris &&
        <div className="flex-1 min-w-55 max-w-65 relative group">
            <CardMenu card={card}/>
            <img src={card.image_uris.large} alt={card.card_name} className="rounded-xl w-full"/>
            <div className="bg-orange-500 w-full h-full flex justify-center">
                {card.prices.usd && "$" + card.prices.usd}
                {!card.prices.usd && "N/A"}
            </div>
        </div>
    );
};

export default Card;