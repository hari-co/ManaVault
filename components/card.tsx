import { CardType } from "@/types/CardType";
import QuickMenu from "./quickMenu";
import { useState } from "react";
import CardProperties from "./cardProperties";

const Card: React.FC<{ card: CardType }> = ({ card }) => {
    const [propsOpen, setPropsOpen] = useState(false);
    const [fade, setFade] = useState(false);

    const fadeIn = () => {
        setPropsOpen(true);
        setTimeout(() => setFade(true), 10);
    }

    const fadeOut = () => {
        setFade(false);
        setTimeout(() => setPropsOpen(false), 400);
    }

    return (card.image_uris &&
        <div className="flex-1 min-w-55 max-w-65 relative group">
            <QuickMenu card={card}/>
            <img src={card.image_uris.large} alt={card.card_name} className="rounded-xl w-full" onClick={() => fadeIn()}/>
            <div className="bg-orange-500 w-full h-full flex justify-center cursor-default">
                {card.prices.usd && "$" + card.prices.usd}
                {!card.prices.usd && "N/A"}
            </div>
            {propsOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-50">
                    <div className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ${fade ? ' opacity-50' : ' opacity-0'}`} onClick={() => fadeOut()}/>
                    <div className={`relative z-50 transition-opacity duration-500 ${fade ? ' opacity-100' : ' opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                        <CardProperties card={card}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;