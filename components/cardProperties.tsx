import { CardType } from "@/types/CardType";
import { createCard } from "@/utils/create-card";
import { BinderContext } from "@/context/BinderContext";
import { useState, useContext } from "react";

const CardProperties: React.FC<{card: CardType}> = ({ card }) => {
    const [printOpen, setPrintOpen] = useState(false);
    const [prints, setPrints] = useState<CardType[]>([card]);
    const [cardQuantity, setCardQuantity] = useState(String(card.quantity))
    const binderContext = useContext(BinderContext)
    
    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    const viewPrints = async (card: CardType) => {
        const url = card.prints_search_uri;
        const res = await fetch(url);
        const data = await res.json();
        let cardProcessList: CardType[] = [];
        data.data.forEach((scryCard: any) => {
            cardProcessList.push(createCard(scryCard, currentBinder));
        });
        setPrints(cardProcessList);
    }

    return (
        <div className="flex flex-col w-200 h-140 bg-[#192131]/70 rounded-lg text-white">
            <div className="flex items-center pl-8 pt-6 w-full h-15">
                <h1 className="text-2xl">Card Properties</h1>
            </div>
            <hr className="m-2 text-white/25"></hr>
            <div className="flex w-full h-full">
                <div className="w-100">
                    <img src={card.image_uris?.png} className="w-65 ml-10 mt-7"/>
                    <div className="flex ml-5 w-full h-8 justify-center">
                         <p className="ml-5">${card.prices.usd}</p>
                    </div>
                    <a href={card.scryfallUri} target="_blank" className="ml-28">View on Scryfall</a>
                </div>
                <div className="w-full">
                    <div className="flex w-full justify-center mt-5">
                        <h2 className="text-2xl">{card.flavor_name || card.card_name}</h2>
                    </div>
                    <div className="flex w-full h-15 ml-15">
                        <div>
                            <p>Printing</p>
                            <button
                                className="bg-gray-700 h-10 w-70 rounded-md"
                                onClick={() => {
                                    if (!printOpen) {
                                        viewPrints(card);
                                    }
                                    setPrintOpen(!printOpen);
                                }}
                                onBlur={() => setPrintOpen(false)}>
                                <img src={`/set_icons/${card.set}.svg`} className="inline max-h-7 max-w-7 mr-2"></img>
                                {card.set_name + " " + card.collector_number}
                            </button>
                            {printOpen && (
                                <div className="absolute border border-gray-500 bg-gray-600 max-h-70 w-100 overflow-y-auto rounded-sm">
                                    <ul>
                                        {prints.map(print => (
                                            <li
                                            key={print.set_name + print.collector_number}
                                            className="hover:bg-gray-500">
                                                <div>
                                                    <img src={`/set_icons/${print.set}.svg`} className="inline max-h-7 max-w-6 mr-2"></img>
                                                    {`${print.set_name} ${print.collector_number}`}
                                                </div>
                                                <div className="flex justify-between text-gray-400">
                                                    <p>{print.flavor_name || print.card_name}</p>
                                                    <p>{`${print.prices.usd ? `$${print.prices.usd}` : "N/A"}`}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="ml-10">
                            <p>Quantity</p>
                            <form>
                                <input
                                 type="text"
                                 className="bg-gray-700 w-17 h-10 rounded-md pl-4"
                                 placeholder={String(card.quantity)}
                                 value={cardQuantity}
                                 onChange={() => console.log("Change Quantity")}
                                 />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardProperties;