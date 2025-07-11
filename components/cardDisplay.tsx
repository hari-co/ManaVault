import { useContext, useEffect, useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { BinderContext } from "@/context/BinderContext";
import { CardType } from "@/types/CardType";
import { collection, getDocs, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import Card from "./Card";
import { User } from "firebase/auth";

const CardDisplay: React.FC = () => {
    const [cardList, setCardList] = useState<CardType[]>([])
    const user = useFirebaseUser()
    const binderContext = useContext(BinderContext)

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    const updatePrice = async (card: CardType, user: User, currentBinder: string) => {
        const now = Date.now()
        let lastUpdate;
        const updatePeriod = 24 * 60 * 60 * 1000;

         if (typeof(card.last_price_update as any).toDate() === "function") {
            lastUpdate = (card.last_price_update as any).toDate().getTime();
        } else if (card.last_price_update instanceof Date) {
            lastUpdate = card.last_price_update.getTime();
        }

        if (now - lastUpdate > updatePeriod) {
            const res = await fetch(`https://api.scryfall.com/cards/${card.scryfallId}`);
            if (!res.ok) return;
            const data = await res.json();
            await updateDoc(
                doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id),
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
        };
    }


    useEffect(() => {
        if (!user || !currentBinder) return;
        const unsubscribe = onSnapshot(
        collection(db, "users", user?.uid, "binders", currentBinder, "cards"),
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
            updatePrice(card, user, currentBinder);
        });
    }, [cardList, user, currentBinder]);

    return (
        <div className="flex flex-wrap gap-4 w-full bg-blue-300 p-5 items-start">
            {cardList.map((card) => (
                    <Card key={card.id} card={card}/>
                )
            )}
        </div>
    );
};

export default CardDisplay;