import { CardType } from "@/types/CardType";

interface CardTogglesProps {
    card: CardType;
    foil: boolean;
    favourite: boolean;
    onFoilChange: (card: CardType, newFoil: boolean) => void;
    onFavouriteChange: (card: CardType, newFavourite: boolean) => void;
}

const CardToggles: React.FC<CardTogglesProps> = ({ 
    card, 
    foil, 
    favourite, 
    onFoilChange, 
    onFavouriteChange 
}) => {
    return (
        <div className="ml-8">
            <h2 className="mt-5">Foil</h2>
            <button
                className={`bg-gray-700/40 border border-gray-600 h-10 w-18 rounded-md flex justify-center items-center text-2xl ${foil ? 'ring-2 ring-[#7d80ef]' : ''}`}
                onClick={() => onFoilChange(card, !foil)}>
                {foil ? '★' : '☆'}
            </button>
            <h2 className="mt-6">Favourite</h2>
            <button
                className={`bg-gray-700/40 border border-gray-600 h-10 w-18 rounded-md flex justify-center items-center text-2xl ${favourite ? 'ring-2 ring-[#7d80ef]' : ''}`}
                onClick={() => onFavouriteChange(card, !favourite)}>
                {favourite ? '★' : '☆'}
            </button>
        </div>
    );
};

export default CardToggles;
