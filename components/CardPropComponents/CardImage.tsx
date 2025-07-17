import { CardType } from "@/types/CardType";

interface CardImageProps {
    card: CardType;
}

const CardImage: React.FC<CardImageProps> = ({ card }) => {
    return (
        <div className="w-100">
            {card.image_uris ? (
                <img src={card.image_uris?.png} className="w-65 ml-10 mt-7" alt={card.card_name} />
            ) : (
                <img src={card.card_faces[0].image_uris?.png} className="w-65 ml-10 mt-7" alt={card.card_name} />
            )}
            <div className="flex ml-7 w-full h-8 justify-center items-center">
                <img src={"/tcgplayer.svg"} className="w-7" alt="TCGPlayer" />
                <p className="">${card.prices.usd}</p>
            </div>
            <a href={card.scryfallUri} target="_blank" className="ml-28 text-gray-400">
                View on Scryfall
            </a>
        </div>
    );
};

export default CardImage;
