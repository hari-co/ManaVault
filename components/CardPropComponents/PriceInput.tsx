import { CardType } from "@/types/CardType";

interface PriceInputProps {
    card: CardType;
    buyPrice: string;
    onPriceChange: (value: string) => void;
    onPriceSubmit: (card: CardType, price: number, e: React.FormEvent) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ 
    card, 
    buyPrice, 
    onPriceChange, 
    onPriceSubmit 
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formatted = Number(buyPrice).toFixed(2);
        onPriceChange(formatted);
        onPriceSubmit(card, Number(formatted), e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const formatted = Number(buyPrice).toFixed(2);
        onPriceChange(formatted);
        onPriceSubmit(card, Number(formatted), e);
    };

    return (
        <div className="ml-4">
            <h2>Buy Price</h2>
            <form 
                className="flex bg-gray-700/40 border border-gray-600 w-23 h-10 rounded-md pl-3 items-center"
                onSubmit={handleSubmit}>
                <span className="mr-1">$</span>
                <input
                    className="w-16"
                    type="number"
                    step="0.01"
                    placeholder={card.buy_price}
                    value={buyPrice}
                    onChange={e => onPriceChange(e.target.value)}
                    onBlur={handleBlur}
                />
            </form>
        </div>
    );
};

export default PriceInput;
