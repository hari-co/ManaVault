import { CardType } from "@/types/CardType";

interface QuantityInputProps {
    card: CardType;
    cardQuantity: string;
    onQuantityChange: (value: string) => void;
    onQuantitySubmit: (card: CardType, quantity: number, e: React.FormEvent) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ 
    card, 
    cardQuantity, 
    onQuantityChange, 
    onQuantitySubmit 
}) => {
    return (
        <div className="ml-7">
            <p>Quantity</p>
            <form onSubmit={e => onQuantitySubmit(card, Number(cardQuantity), e)}>
                <input
                    type="number"
                    className="bg-gray-700/40 border border-gray-600 w-17 h-10 rounded-md pl-4"
                    placeholder={String(card.quantity)}
                    value={cardQuantity}
                    onChange={(e) => onQuantityChange(e.target.value)}
                    onBlur={e => onQuantitySubmit(card, Number(cardQuantity), e)}
                />
            </form>
        </div>
    );
};

export default QuantityInput;
