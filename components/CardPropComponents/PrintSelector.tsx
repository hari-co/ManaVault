import { CardType } from "@/types/CardType";

interface PrintSelectorProps {
    card: CardType;
    printOpen: boolean;
    prints: CardType[];
    showPreview: CardType | null;
    rarityFilter: { [key: string]: string };
    onTogglePrintOpen: () => void;
    onViewPrints: (card: CardType) => void;
    onPrintHover: (print: CardType) => void;
    onPrintLeave: () => void;
    onPrintSelect: (card: CardType, print: CardType) => void;
}

const PrintSelector: React.FC<PrintSelectorProps> = ({ 
    card, 
    printOpen, 
    prints, 
    showPreview, 
    rarityFilter, 
    onTogglePrintOpen, 
    onViewPrints, 
    onPrintHover, 
    onPrintLeave, 
    onPrintSelect 
}) => {
    const handlePrintHover = (print: CardType) => {
        if (print.image_uris) {
            onPrintHover(print);
        } else {
            onPrintHover(print.card_faces[0]);
        }
    };

    const handleToggleOpen = () => {
        if (!printOpen) {
            onViewPrints(card);
        }
        onTogglePrintOpen();
    };

    const handleBlur = () => {
        if (printOpen) {
            onTogglePrintOpen();
        }
    };

    return (
        <div>
            <p>Printing</p>
            <button
                className="bg-gray-700/40 border border-gray-600 h-10 w-85 rounded-md flex justify-between items-center overflow-hidden"
                onClick={handleToggleOpen}
                onBlur={handleBlur}>
                <span className="flex ml-4">
                    <div 
                        className={`h-6 w-6 mr-2`}
                        style={{
                            WebkitMaskImage: `url(/set_icons/${card.set}.svg)`,
                            maskImage: `url(/set_icons/${card.set}.svg)`,
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskPosition: "center",
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            background: `${rarityFilter[card.rarity]}`
                        }}>
                    </div>
                    <span className="whitespace-nowrap overflow-hidden max-w-65">
                        {card.set_name + " " + card.collector_number}
                    </span>
                </span>
                <span className="h-full flex justify-center items-center">
                    <img src={"/dropdown.svg"} className="w-7 filter invert" alt="dropdown" />
                </span>
            </button>
            {printOpen && (
                <div className="absolute border border-gray-500 bg-gray-600 max-h-70 w-90 overflow-y-auto rounded-sm z-50">
                    <ul>
                        {prints.map(print => (
                            <li
                                key={print.set_name + print.collector_number}
                                className={`hover:bg-gray-500 px-3 py-1 ${print.set_name == card.set_name && print.collector_number == card.collector_number ? " bg-gray-500" : ""}`}
                                onMouseEnter={() => handlePrintHover(print)}
                                onMouseLeave={onPrintLeave}
                                onMouseDown={() => onPrintSelect(card, print)}>
                                <div className="flex">
                                    <div 
                                        className={`h-5.5 w-5.5 mr-2`}
                                        style={{
                                            WebkitMaskImage: `url(/set_icons/${print.set}.svg)`,
                                            maskImage: `url(/set_icons/${print.set}.svg)`,
                                            WebkitMaskRepeat: "no-repeat",
                                            maskRepeat: "no-repeat",
                                            WebkitMaskPosition: "center",
                                            maskPosition: "center",
                                            WebkitMaskSize: "contain",
                                            maskSize: "contain",
                                            background: `${rarityFilter[print.rarity]}`
                                        }}>
                                    </div>
                                    {`${print.set_name} ${print.collector_number}`}
                                </div>
                                <div className="flex justify-between text-gray-400 ml-8">
                                    <p>{print.flavor_name || print.card_name}</p>
                                    <p>{`${print.prices.usd ? `$${print.prices.usd}` : "N/A"}`}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {showPreview && (
                <div className="fixed -right-22 ml-10">
                    <img src={showPreview.image_uris?.normal} className="w-50 rounded-lg" alt="card preview" />
                </div>
            )}
        </div>
    );
};

export default PrintSelector;
