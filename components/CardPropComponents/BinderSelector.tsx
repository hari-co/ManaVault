import { CardType } from "@/types/CardType";

interface BinderSelectorProps {
    card: CardType;
    binderName: string;
    showBinders: boolean;
    binderList: string[];
    onToggleShow: () => void;
    onBinderSelect: (card: CardType, binder: string) => void;
}

const BinderSelector: React.FC<BinderSelectorProps> = ({ 
    card, 
    binderName, 
    showBinders, 
    binderList, 
    onToggleShow, 
    onBinderSelect 
}) => {
    const handleBlur = () => {
        if (showBinders) {
            onToggleShow();
        }
    };

    return (
        <div>
            <h2>Binder</h2>
            <button
                className="bg-gray-700/40 border border-gray-600 h-10 w-60 rounded-md flex justify-between items-center pl-4"
                onClick={onToggleShow}
                onBlur={handleBlur}>
                <span>{binderName}</span>
                <span className="h-full flex justify-center items-center">
                    <img src={"/dropdown.svg"} className="w-7 filter invert" alt="dropdown" />
                </span>
            </button>
            {showBinders && (
                <ul className="bg-gray-700 absolute w-60 border border-gray-500 rounded-md">
                    {binderList.map(binder => (
                        <li
                            className={`z-50 flex items-center pl-4 h-8 hover:bg-gray-400 ${binderName == binder ? " bg-gray-400" : " bg-gray-700"}`}
                            key={binder}
                            onMouseDown={() => onBinderSelect(card, binder)}>
                            {binder}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BinderSelector;
