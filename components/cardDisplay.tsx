import { useContext, useEffect, useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { BinderContext } from "@/context/BinderContext";
import { CardType } from "@/types/CardType";
import { collection, getDocs, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import Card from "./Card";

interface CardDisplayProps {
    viewOnly?: boolean;
    paramID?: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({viewOnly, paramID}) => {
    const [cardList, setCardList] = useState<CardType[]>([])
    const [viewID, setViewID] = useState<string>("")
    const user = useFirebaseUser()
    const binderContext = useContext(BinderContext)

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    const updatePrice = async (card: CardType, currentBinder: string) => {
        try {
            if (!user || !paramID) {
                console.log("how did this happen");
                return;
            }

            const now = Date.now();
            let lastUpdate: number | undefined;
            const updatePeriod = 24 * 60 * 60 * 1000;

            if (card.last_price_update) {
                if (
                    typeof card.last_price_update === "object" &&
                    card.last_price_update !== null &&
                    "toDate" in card.last_price_update &&
                    typeof (card.last_price_update as any).toDate === "function"
                ) {
                    lastUpdate = (card.last_price_update as any).toDate().getTime();
                } else if (card.last_price_update instanceof Date) {
                    lastUpdate = card.last_price_update.getTime();
                } else if (
                    typeof card.last_price_update === "string" ||
                    typeof card.last_price_update === "number"
                ) {
                    lastUpdate = new Date(card.last_price_update).getTime();
                }
            }

            if (lastUpdate === undefined || now - lastUpdate > updatePeriod) {
                const res = await fetch(`https://api.scryfall.com/cards/${card.scryfallId}`);
                if (!res.ok) return;
                const data = await res.json();
                await updateDoc(
                    doc(db, "users", viewID, "binders", currentBinder, "cards", card.id),
                    {
                        prices: data.prices,
                        last_price_update: new Date()
                    }
                );
                setCardList(prev =>
                    prev.map(c =>
                        c.id === card.id
                            ? { ...c, prices: data.prices, last_price_update: new Date() }
                            : c
                    )
                );
            }
        } catch (e) {
            console.error(e);
        }
    }


    useEffect(() => {
        if (!user || !currentBinder) return;
        
        const targetUserID = paramID || user.uid;
        setViewID(targetUserID);
        
        const unsubscribe = onSnapshot(
        collection(db, "users", targetUserID, "binders", currentBinder, "cards"),
            (snapshot) => {
                setCardList(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as CardType[]
                );
            }
        );
        return () => unsubscribe();
    }, [currentBinder, user])

    useEffect(() => {
        if (!user || !currentBinder) return;
        cardList.forEach(card => {
            updatePrice(card, currentBinder);
        });
    }, [cardList, user, currentBinder]);

    return (
        <div className="flex flex-wrap gap-4 w-full pt-5 pl-13 items-start bg-[#181e2b]">
            {cardList.map((card) => (
                    <Card key={card.id} card={card} viewOnly={viewOnly}/>
                )
            )}
        </div>
    );
};

export default CardDisplay;