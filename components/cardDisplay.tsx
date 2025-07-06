import { useContext, useEffect, useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { BinderContext } from "@/context/BinderContext";
import { CardType } from "@/types/CardType";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import Card from "./card";

const CardDisplay: React.FC = () => {
    const [cardList, setCardList] = useState<CardType[]>([])
    const user = useFirebaseUser()
    const binderContext = useContext(BinderContext)

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

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

    // const getCards = async () => {
    //     if (!user || !currentBinder) return;
    //     const cardsSnapshot = await getDocs(collection(db, "users", user.uid, "binders", currentBinder, "cards"));
    //     setCardList((cardsSnapshot).docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data()
    //     })) as CardType[]);
    // };

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