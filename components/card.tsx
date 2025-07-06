import { CardType } from "@/types/CardType";

const Card: React.FC<{ card: CardType }> = ({ card }) => {
    return (card.image_uris &&
        <div className="flex-1 min-w-55 max-w-65">
            <img src={card.image_uris.large} alt={card.card_name} className="rounded-xl w-full"/>
            <div className="bg-orange-500 w-full h-full flex justify-center">
                <h1>h</h1>
            </div>
        </div>
    );
};

export default Card;