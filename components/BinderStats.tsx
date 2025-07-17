import { db } from "@/config/firebase-config";
import { BinderContext } from "@/context/BinderContext";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

const BinderStats: React.FC = () => {
    const [rarityCount, setRarityCount] = useState<{ mythics: number, rares: number, uncommons: number, commons: number }>({
        mythics: 0,
        rares: 0,
        uncommons: 0,
        commons:0
        });
    const [cardCount, setCardCount] = useState<number>(0);
    const [priceCount, setPriceCount] = useState<number>(0);
    const binderContext = useContext(BinderContext);
    const user = useFirebaseUser();

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, cardsUpdated } = binderContext;

    useEffect(() => {
        if (!user) return;
        fetchRarities(currentBinder);
    }, [currentBinder, user, cardsUpdated]);

    const fetchRarities = async (currentBinder: string | null) => {
        try {
            if (!user || !currentBinder) {
                console.error("user or binder not found");
                return;
            }

            let counts = { mythics: 0, rares: 0, uncommons: 0, commons: 0 };
            let cardNum = 0;
            let priceTotal = 0;

            const binderSnapshot = await getDocs(collection(db, "users", user.uid, "binders", currentBinder, "cards"));
            binderSnapshot.forEach((doc) => {
                const card = doc.data();
                
                switch (card.rarity) {
                    case 'mythic':
                        counts.mythics++;
                        break;
                    case 'rare':
                        counts.rares++;
                        break;
                    case 'uncommon':
                        counts.uncommons++;
                        break;
                    case 'common':
                        counts.commons++;
                        break;
                    default:
                        console.warn(`Unknown rarity: ${card.card_name}`);
                }
                cardNum++;
                priceTotal += Number(card.prices.usd);
            });

            setPriceCount(priceTotal)
            setCardCount(cardNum);
            setRarityCount(counts);
        } catch (e) {
            console.error(`Couldn't get rarities: ${e}`);
        }
    }

    return (
        <div className="absolute bottom-7 right-14 z-10 font-normal">
            <div className="absolute right-3 -top-5 flex">
                <img src={"/tbgplayermono.svg"} className="relative -top-0.4 w-7"/>
                <p className="ml-0">${priceCount}</p>
                <p className="ml-6">{cardCount} cards</p>
            </div>
            <div className="flex text-gray-400">
                <p className="m-2">{rarityCount.mythics} mythics</p>
                <p className="m-2">{rarityCount.rares} rares</p>
                <p className="m-2">{rarityCount.uncommons} uncommons</p>
                <p className="m-2">{rarityCount.commons} commons</p>
            </div>
        </div>
    );
}

export default BinderStats;