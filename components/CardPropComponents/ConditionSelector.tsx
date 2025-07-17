import { CardType } from "@/types/CardType";

interface ConditionSelectorProps {
    card: CardType;
    showConditions: boolean;
    conditions: string[];
    onToggleShow: () => void;
    onConditionSelect: (card: CardType, condition: string) => void;
}

const ConditionSelector: React.FC<ConditionSelectorProps> = ({ 
    card, 
    showConditions, 
    conditions, 
    onToggleShow, 
    onConditionSelect 
}) => {
    return (
        <div className="ml-4">
            <h2>Condition</h2>
            <button
                className="bg-gray-700/40 border border-gray-600 h-10 w-18 rounded-md flex justify-between items-center pl-4"
                onClick={onToggleShow}>
                <span>{card.condition}</span>
                <span className="h-full flex justify-center items-center">
                    <img src={"/dropdown.svg"} className="w-7 filter invert" alt="dropdown" />
                </span>
            </button>
            {showConditions && (
                <ul className="bg-gray-700 absolute w-18 border border-gray-500 rounded-md">
                    {conditions.map(condition => (
                        <li
                            className={`z-50 flex justify-center items-center h-8 hover:bg-gray-400 ${card.condition == condition ? " bg-gray-400" : " bg-gray-700"}`}
                            key={condition}
                            onClick={() => onConditionSelect(card, condition)}>
                            {condition}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ConditionSelector;
