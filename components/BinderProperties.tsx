import { db } from "@/config/firebase-config";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useState } from "react";

interface Binder {
  binder: { id: string; name: string; index: number; color: string };
}

const BinderProperties: React.FC<Binder> = ({ binder }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useFirebaseUser();

    const deleteBinder = async () => {
        try {
            if (!user) return;
            const binderSnapshot = await getDocs(collection(db, "users", user.uid, "binders", binder.id, "cards"));
            for (const card of binderSnapshot.docs) {
                const target = doc(db, "users", user.uid, "binders", "all", "cards", card.data().id);
                await updateDoc(target, { binder: "all" });
                }
            await deleteDoc(doc(db, "users", user.uid, "binders", binder.id));
        } catch(e) {
            console.error(e);
        }
    }

    return (<>
        <button
        onClick={() => setMenuOpen(true)}>
            <p className="text-2xl hover:text-white cursor-pointer">⋮</p>
        </button>
        {menuOpen && <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
            />}
        {menuOpen && 
            <div className="w-40 h-30 bg-gray-200 absolute z-50 top-1 left-5 rounded-md pt-2 pb-2">
                <button className="bg-gray-200 hover:bg-gray-300 w-full h-10"
                        onClick={() => deleteBinder()}>
                    Delete
                </button>
            </div>}
    </>)
}

export default BinderProperties;