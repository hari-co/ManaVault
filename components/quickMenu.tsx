import { useState, useContext } from "react";
import { CardType } from "@/types/CardType";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import { BinderContext } from "@/context/BinderContext";

const QuickMenu: React.FC<{card: CardType}> = ({ card }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const user = useFirebaseUser()
    const binderContext = useContext(BinderContext)
    
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
                <button className="flex items-center justify-center p-1 w-10 h-8 rounded-xl bg-gray-200 hover:bg-gray-400"
                        onClick={() => setMenuOpen(true)}>
                    <span className="text-3xl">⋯</span>
                </button>
            </div>
            {menuOpen && <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
            />}
            {menuOpen && 
                <div className="w-40 h-30 bg-gray-200 absolute z-50 top-13 right-4 rounded-md pt-2 pb-2">
                    <button className="bg-gray-200 hover:bg-gray-300 w-full h-10"
                            onClick={() => deleteCard(card, currentBinder)}>
                        Delete
                    </button>
                </div>}
        </>
    )
}

export default QuickMenu;
