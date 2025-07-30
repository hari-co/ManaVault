import { CardType } from "@/types/CardType";
import QuickMenu from "./QuickMenu";
import { useState } from "react";
import CardProperties from "./CardProperties";

const Card: React.FC<{ card: CardType, viewOnly?: boolean }> = ({ card, viewOnly }) => {
    const [propsOpen, setPropsOpen] = useState(false);
    const [fade, setFade] = useState(false);
    const [flipped, setFlipped] = useState(false);

    const fadeIn = () => {
        setPropsOpen(true);
        setTimeout(() => setFade(true), 10);
    }

    const fadeOut = () => {
        setFade(false);
        setTimeout(() => setPropsOpen(false), 400);
    }

    const handleFlip = () => {
        setFlipped(!flipped);
    }

    return (
        <>
            {card.image_uris && card.card_faces.length < 2 ? (
                <div className="flex-1 min-w-56 max-w-60 relative group">
                    <QuickMenu card={card} onFlip={handleFlip} viewOnly={viewOnly}/>
                    <img src={card.image_uris.large} alt={card.card_name} className="rounded-xl w-full cursor-pointer" onClick={() => fadeIn()}/>
                    <div className="w-full h-full flex justify-center cursor-default text-[#7d80ef]">
                        <img src={"/tcgplayer.svg"} className="w-7"/>
                        {card.prices.usd && "$" + card.prices.usd}
                        {!card.prices.usd && "N/A"}
                    </div>
                    {propsOpen && !viewOnly && (
                        <div className="fixed inset-0 z-50 flex items-start justify-center pt-50">
                            <div className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ${fade ? ' opacity-50' : ' opacity-0'}`} onClick={() => fadeOut()}/>
                            <div className={`relative z-50 backdrop-blur-md transition-opacity duration-500 ${fade ? ' opacity-100' : ' opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                                <CardProperties card={card}/>
                            </div>
                        </div>
                    )}
                </div>
            ) : card.card_faces ? (
                <div className="flex-1 min-w-55 max-w-60 relative group">
                    <QuickMenu card={card} onFlip={handleFlip} viewOnly={viewOnly}/>
                    <div className="flip-container">
                        <div className={`flip-card ${flipped ? "flipped" : ""}`}>
                            <img src={card.card_faces?.[0]?.image_uris?.large} alt={card.card_name} className="rounded-xl w-full cursor-pointer absolute card-front" onClick={() => fadeIn()}/>
                            <img src={card.card_faces?.[1]?.image_uris?.large} alt={card.card_name} className="rounded-xl w-full cursor-pointer card-back" onClick={() => fadeIn()}/>
                        </div>
                    </div>
                    <div className="w-full h-full flex justify-center cursor-default text-[#7d80ef]">
                        <img src={"/tcgplayer.svg"} className="w-7"/>
                        {card.prices.usd && "$" + card.prices.usd}
                        {!card.prices.usd && "N/A"}
                    </div>
                    {propsOpen && !viewOnly && (
                        <div className="fixed inset-0 z-50 flex items-start justify-center pt-50">
                            <div className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ${fade ? ' opacity-50' : ' opacity-0'}`} onClick={() => fadeOut()}/>
                            <div className={`relative z-50 backdrop-blur-md transition-opacity duration-500 ${fade ? ' opacity-100' : ' opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                                <CardProperties card={card}/>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </>
    );
};

export default Card;