import { CardType } from "@/types/CardType";

const Card: React.FC<{ card: CardType }> = ({ card }) => {
    return (card.image_uris &&
        <div className="flex-1 min-w-55 max-w-65 bg-amber-50">
            <img src={card.image_uris.large} alt={card.card_name} className="rounded-xl w-full"/>
            {card.card_name}
        </div>
    );
};

export default Card;