import { db } from "@/config/firebase-config";
import { BinderContext } from "@/context/BinderContext";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { collection, getDocs } from "firebase/firestore";
import { useContext, useState } from "react";

const BinderStats: React.FC = () => {
    const [rarityCount, setRarityCount] = useState<{ mythics: Number, rares: Number, uncommons: Number, commons: Number }>({
        mythics: 0,
        rares: 0,
        uncommons: 0,
        commons:0
        });
    const binderContext = useContext(BinderContext)
    const user = useFirebaseUser()

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    const fetchRarities = async (currentBinder: string | null) => {
        try {
            if (!user || !currentBinder) {
                console.error("user or binder not found");
                return;
            }

            let counts = { mythics: 0, rares: 0, uncommons: 0, commons: 0 };

            const binderSnapshot = await getDocs(collection(db, "users", user.uid, "binders", currentBinder, "cards"));
            binderSnapshot.forEach((doc) => {
                const card = doc.data();
                
                switch (card.rarity) {
                    case 'mythic':
                        counts.mythics++;
                        break;
                    case 'rare':
                        counts.rares++
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
            });

            setRarityCount(counts);
        } catch (e) {

        }
    }

    return (
        <div className="w-150 h-30">

        </div>
    );
}

export default BinderStats;