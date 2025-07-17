import { db } from "@/config/firebase-config";
import { BinderContext } from "@/context/BinderContext";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useContext, useState } from "react";

interface Binder {
  binder: { id: string; name: string; index: number; color: string };
}

const BinderProperties: React.FC<Binder> = ({ binder }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const binderContext = useContext(BinderContext)
    const user = useFirebaseUser();

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    const deleteBinder = async () => {
        try {
            if (!user) return;
            const binderSnapshot = await getDocs(collection(db, "users", user.uid, "binders", binder.id, "cards"));
            for (const card of binderSnapshot.docs) {
                const target = doc(db, "users", user.uid, "binders", "all", "cards", card.data().id);
                await updateDoc(target, { binder: "all" });
                }
            await deleteDoc(doc(db, "users", user.uid, "binders", binder.id));
            setMenuOpen(false);
            setCurrentBinder("all");
        } catch(e) {
            console.error(e);
        }
    }

    return (<>
        <button
        onClick={() => setMenuOpen(true)}>
            <p className="text-2xl hover:text-white cursor-pointer font-sans font-black">⋮</p>
        </button>
        {menuOpen && <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
            />}
        {menuOpen && 
            <div className="w-40 h-30 bg-[#141823] absolute z-50 top-1 left-5 rounded-md pt-2 pb-2">
                <button className="bg-[#141823] hover:bg-[#3f475a] w-full h-10"
                        onClick={() => deleteBinder()}>
                    Delete
                </button>
            </div>}
    </>)
}

export default BinderProperties;