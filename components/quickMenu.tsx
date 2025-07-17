import { useState, useContext } from "react";
import { CardType } from "@/types/CardType";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import { BinderContext } from "@/context/BinderContext";

const QuickMenu: React.FC<{card: CardType, onFlip: () => void}> = ({ card, onFlip }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useFirebaseUser();
    const binderContext = useContext(BinderContext);
    const flippable = !!card.card_faces && card.card_faces.length > 1;
    
    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;



    const deleteCard = async (card: CardType, currentBinder: string | null) => {
        if (!user || !currentBinder) return;
        if (currentBinder != "all") {
            console.log("deleted from all")
            await deleteDoc(doc(db, "users", user.uid, "binders", "all", "cards", card.id));
        } else {
            if (!card.binder) return;
            await deleteDoc(doc(db, "users", user.uid, "binders", card.binder, "cards", card.id));
        }
        await deleteDoc(doc(db, "users", user.uid, "binders", currentBinder, "cards", card.id));
    }

    return (
        <>
            <div className={`absolute top-5 right-4 z-10 transition duration-500 ${menuOpen ? `opacity-100` : `opacity-0 group-hover:opacity-100`}`}>
                <button className="flex items-center justify-center p-1 w-10 h-8 rounded-xl bg-[#1a1b27d2] hover:bg-[#2b2c33c0]"
                        onClick={() => setMenuOpen(true)}>
                    <span className="mb-1 text-3xl font-sans font-semibold text-[#bebebe]">⋯</span>
                </button>
            </div>
            <div className={`absolute top-6 left-6 z-10 text-gray-300 bg-[#1a1b27d2] py-1 px-2 rounded-lg cursor-pointer transition duration-700 ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <p>{card.quantity}</p>
            </div>
            {menuOpen && <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
            />}
            {menuOpen && 
                <div className="w-40 h-30 bg-[#141823] absolute z-50 top-1 left-5 rounded-md pt-2 pb-2">
                <button className="bg-[#141823] hover:bg-[#3f475a] w-full h-10 text-gray-300"
                        onClick={() => deleteCard(card, currentBinder)}>
                    Delete
                </button>
            </div>}
            {flippable && 
            <div className={`absolute top-15 right-4 z-10 transition duration-500 ${menuOpen ? `opacity-100` : `opacity-0 group-hover:opacity-100`}`}>
                <button 
                className="flex items-center justify-center p-1 w-10 h-8 rounded-xl bg-[#1a1b27d2] hover:bg-[#2b2c33c0]"
                onClick={() => onFlip()}>
                    <img src={"/flip.svg"} style={{filter: "invert(1) brightness(0.70)"}}/>
                </button>
            </div>}
        </>
    )
}

export default QuickMenu;
