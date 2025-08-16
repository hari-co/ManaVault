import { CardType } from "@/types/CardType";
import { createCard } from "@/utils/create-card";
import { BinderContext } from "@/context/BinderContext";
import { useState, useContext, useEffect, useRef } from "react";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { db } from "@/config/firebase-config";

import CardImage from "./CardPropComponents/CardImage";
import CardToggles from "./CardPropComponents/CardToggles";
import QuantityInput from "./CardPropComponents/QuantityInput";
import PriceInput from "./CardPropComponents/PriceInput";
import NotesSection from "./CardPropComponents/NotesSection";
import ConditionSelector from "./CardPropComponents/ConditionSelector";
import BinderSelector from "./CardPropComponents/BinderSelector";
import PrintSelector from "./CardPropComponents/PrintSelector";

const CardProperties: React.FC<{card: CardType}> = ({ card }) => {
    const [printOpen, setPrintOpen] = useState(false);
    const [prints, setPrints] = useState<CardType[]>([card]);
    const [showPreview, setShowPreview] = useState<CardType | null>(null);
    const [cardQuantity, setCardQuantity] = useState(String(card.quantity));
    const [buyPrice, setBuyPrice] = useState(card.buy_price ? String(Number(card.buy_price).toFixed(2)) : "0.00");
    const [binderName, setBinderName] = useState<string>("");
    const [showBinders, setShowBinders] = useState(false);
    const [binderList, setBinderList] = useState(["All Cards"]);
    const [showConditions, setShowConditions] = useState(false);
    const [notes, setNotes] = useState(card.notes || "");
    const [foil, setFoil] = useState(card.foil);
    const [favourite, setFavourite] = useState(card.favourite || false);
    const conditions = ["NM", "LP", "MP", "HP", "DMG"];
    const rarityFilter: { [key: string]: string } = {
        common: "black",
        uncommon: "radial-gradient(circle at 50% 75%, #ececec 0%, #737373 60%, #666666 100%)",
        rare: "radial-gradient(circle at 50% 75%, #fbeca8 0%, #967c03 60%, #c6a405 100%)",
        mythic: "radial-gradient(circle at 50% 75%, #fac438 0%, #d96421 60%, #c35008 100%)",
    };
    const binderMap = useRef(new Map());
    const binderContext = useContext(BinderContext);
    const user = useFirebaseUser();
    
    
    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, triggerCardsUpdate } = binderContext;

    const viewPrints = async (card: CardType) => {
        try {
            const url = card.prints_search_uri;
            const res = await fetch(url);
            const data = await res.json();
            let cardProcessList: CardType[] = [];
            data.data.forEach((scryCard: any) => {
                cardProcessList.push(createCard(scryCard, currentBinder));
            });
            setPrints(cardProcessList);
        } catch (e) {
            console.error(e);
        }
    }

    const updateCard = async (
        cardId: string,
        updates: Partial<CardType>,
        currentBinder: string | null
    ): Promise<boolean> => {
        try {
            if (!user || !user.uid || !currentBinder) {
                console.error("No user or binder found.");
                return false;
            }

            if (currentBinder != "all") {
                await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", cardId), {
                    ...updates
                })
            } else {
                const binderId = card.binder;
                if (binderId != "all" && binderId) {
                    await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", cardId), {
                        ...updates
                    })
                }
            }
            await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", cardId), {
                ...updates
            })

            return true;
        } catch (error) {
            console.error("Failed to update card: ", error);
            return false
        }
    }

    const changePrint = async (card: CardType, print: CardType) => {
        try {
            if (!user || !user.uid || !currentBinder) {
                console.log("Error");
                return;
            }
            if (currentBinder != "all") {
                await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id), {
                    collector_number: print.collector_number,
                    image_uris: print.image_uris,
                    prices: print.prices,
                    rarity: print.rarity,
                    scryfallId: print.scryfallId,
                    scryfallUri: print.scryfallUri,
                    set: print.set,
                    set_name: print.set_name,
                    set_uri: print.set_uri,
                    uri: print.uri,
                    ...(print.card_faces ? { card_faces: print.card_faces } : {})
                })
                if (print.flavor_name) {
                    await updateDoc(doc(db, "users", user.uid, "binders", currentBinder, "cards", card.id), {flavor_name: print.flavor_name})
                }
            } else {
                const binderId = card.binder;
                if (binderId != "all" && binderId) {
                    await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", card.id), {
                        collector_number: print.collector_number,
                        image_uris: print.image_uris,
                        prices: print.prices,
                        rarity: print.rarity,
                        scryfallId: print.scryfallId,
                        scryfallUri: print.scryfallUri,
                        set: print.set,
                        set_name: print.set_name,
                        set_uri: print.set_uri,
                        uri: print.uri,
                        ...(print.card_faces ? { card_faces: print.card_faces } : {})
                    })
                    if (print.flavor_name) {
                        await updateDoc(doc(db, "users", user.uid, "binders", binderId, "cards", card.id), {flavor_name: print.flavor_name})
                    }
                }
            }
            await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
                collector_number: print.collector_number,
                image_uris: print.image_uris,
                prices: print.prices,
                rarity: print.rarity,
                scryfallId: print.scryfallId,
                scryfallUri: print.scryfallUri,
                set: print.set,
                set_name: print.set_name,
                set_uri: print.set_uri,
                uri: print.uri,
                ...(print.card_faces ? { card_faces: print.card_faces } : {})
            })
            if (print.flavor_name) {
                await updateDoc(doc(db, "users", user.uid, "binders", "all", "cards", card.id), {flavor_name: print.flavor_name})
            }
            triggerCardsUpdate();
            setShowPreview(null);
        } catch (e) {
            console.error(e);
        }
    }

    const changeQuantity = async (card: CardType, cardQuantity: number, e: React.FormEvent) => {
        try {
            e.preventDefault();

            const success = await updateCard(card.id, { quantity: cardQuantity }, currentBinder);
            if (!success) {
                console.error("Failed to update quantity");
            }
            triggerCardsUpdate();
        } catch (e) {
            console.error(e);
        }
    }

    const changeBuyPrice = async (card: CardType, buyPrice: number, e: React.FormEvent) => {
        try {
            e.preventDefault();

            const success = await updateCard(card.id, { buy_price: String(buyPrice) }, currentBinder);
            if (!success) {
                console.error("Failed to update buy price");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const changeNotes = async (card: CardType, notes: string, e: React.FormEvent | React.FocusEvent<HTMLTextAreaElement>) => {
        try {
            if (e) e.preventDefault?.();

            const success = await updateCard(card.id, { notes: notes }, currentBinder);
            if (!success) {
                console.error("Failed to update notes");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const changeCondition = async (card: CardType, key: string) => {
        try {
            const success = await updateCard(card.id, { condition: key }, currentBinder);
            if (!success) {
                console.error("Failed to update condition");
            }
            setShowConditions(false);
        } catch (e) {
            console.error(e);
        }
    }

    const changeBinder = async (card: CardType, binder: string) => {
        try {
            if (!user || !user.uid || !currentBinder) {
                console.log("Error");
                return;
            }
            const binderNameToId = binderMap.current.get(binder);

            if (binderNameToId === card.binder) {
                setShowBinders(false);
                return;
            }

            if (!binderNameToId) {
                console.error("Invalid binder selected:", binder);
                return;
            }
            
            const sourceAllRef = doc(db, "users", user.uid, "binders", currentBinder, "cards", card.id);
            const targetAllRef = doc(db, "users", user.uid, "binders", binderNameToId, "cards", card.id);

            if (currentBinder != "all") {
                await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id), {
                    binder: binderNameToId,
                })
                const dataAll = (await getDoc(sourceAllRef)).data();
                await setDoc(targetAllRef, dataAll, { merge: true });
                await deleteDoc(sourceAllRef);
            } else {
                const binderId = card.binder;
                if (binderId != "all" && binderId) {
                    await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", card.id), {
                        binder: binderNameToId,
                    })
                    const sourceRef = doc(db, "users", user.uid, "binders", binderId, "cards", card.id);
                    const data = (await getDoc(sourceRef)).data();
                    await setDoc(targetAllRef, data, { merge: true });
                    await deleteDoc(sourceRef);
                } else {
                    await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
                        binder: binderNameToId,
                    })
                    const sourceRefNew = doc(db, "users", user.uid, "binders", "all", "cards", card.id);
                    const dataNew = (await getDoc(sourceRefNew)).data();
                    await setDoc(targetAllRef, dataNew, { merge: true });
                }
            }
            await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
                binder: binderNameToId,
            })
            triggerCardsUpdate();
            setShowBinders(false);
        } catch (e) {
            console.error(e);
        }
    }

    const changeFoil = async (card: CardType, newFoil: boolean) => {
        try {
            setFoil(newFoil);
            const success = await updateCard(card.id, { foil: newFoil }, currentBinder);

            if (!success) {
                console.error("Failed to update foil");
            }
        } catch (e) {
            console.error(e);
        }
        };

        const changeFavourite = async (card: CardType, newFavourite: boolean) => {
        try {
            setFavourite(newFavourite);
            const success = await updateCard(card.id, { favourite: newFavourite }, currentBinder);

            if (!success) {
                console.error("Failed to update favourite");
            }
        } catch (e) {
            console.error(e);
        }
        };

    useEffect(() => {
        const fetchBinderName = async () => {
            if (!user || !card.binder) return;
            try {
                const binderRef = doc(db, "users", user.uid, "binders", card.binder);
                const binderSnap = await (await import("firebase/firestore")).getDoc(binderRef);
                if (binderSnap.exists()) {
                    setBinderName(binderSnap.data().name || card.binder);
                } else {
                    setBinderName(card.binder);
                }
            } catch (e) {
                setBinderName(card.binder);
            }
        };
        fetchBinderName();
    }, [user, card.binder]);

    useEffect(() => {
        const fetchAllBinders = async () => {
            if (!user) return;
            try {
                let binderNames: { name: string; index: number}[] = [];
                const binderSnapshot = await getDocs(collection(db, "users", user.uid, "binders"));
                binderSnapshot.forEach((doc) => {
                    binderNames.push({ name: doc.data().name, index: doc.data().index });
                    binderMap.current.set(doc.data().name, doc.id);
                })
                binderNames.sort((a,b) => a.index - b.index);
                setBinderList(binderNames.map(b => b.name));
            } catch(e) {
                console.error(e);
            }
        }
        fetchAllBinders();
    }, [user, currentBinder]);

    return (
        <div className="flex flex-col w-200 h-140 bg-[#192131]/70 rounded-lg text-white">
            <div className="flex items-center pl-8 pt-6 w-full h-15">
                <h1 className="text-2xl">Card Properties</h1>
            </div>
            <hr className="m-2 text-white/25"></hr>
            <div className="flex w-full h-full">
                <CardImage card={card} />
                <div className="w-full">
                    <div className="flex w-100 justify-center mt-5 ml-15 break-words">
                        <h2 className="text-2xl">
                            {((card.flavor_name || card.card_name) || "").split("//").map((part, idx, arr) => (
                                <span key={idx}>
                                    {part}
                                    {idx < arr.length - 1 && <br />}
                                </span>
                            ))}
                        </h2>
                    </div>
                    <div className="flex w-full h-15 ml-15">
                        <PrintSelector
                            card={card}
                            printOpen={printOpen}
                            prints={prints}
                            showPreview={showPreview}
                            rarityFilter={rarityFilter}
                            onTogglePrintOpen={() => setPrintOpen(!printOpen)}
                            onViewPrints={viewPrints}
                            onPrintHover={setShowPreview}
                            onPrintLeave={() => setShowPreview(null)}
                            onPrintSelect={changePrint}
                        />
                        <QuantityInput
                            card={card}
                            cardQuantity={cardQuantity}
                            onQuantityChange={setCardQuantity}
                            onQuantitySubmit={changeQuantity}
                        />
                    </div>
                    <div className="flex w-full h-15 ml-15 mt-5">
                        <BinderSelector
                            card={card}
                            binderName={binderName}
                            showBinders={showBinders}
                            binderList={binderList}
                            onToggleShow={() => setShowBinders(!showBinders)}
                            onBinderSelect={changeBinder}
                        />
                        <ConditionSelector
                            card={card}
                            showConditions={showConditions}
                            conditions={conditions}
                            onToggleShow={() => setShowConditions(!showConditions)}
                            onConditionSelect={changeCondition}
                        />
                        <PriceInput
                            card={card}
                            buyPrice={buyPrice}
                            onPriceChange={setBuyPrice}
                            onPriceSubmit={changeBuyPrice}
                        />
                    </div>
                    <div className="flex w-auto h-50 ml-15 mt-5">
                        <NotesSection
                            card={card}
                            notes={notes}
                            onNotesChange={setNotes}
                            onNotesSubmit={changeNotes}
                        />
                        <CardToggles
                            card={card}
                            foil={foil}
                            favourite={favourite}
                            onFoilChange={changeFoil}
                            onFavouriteChange={changeFavourite}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

//remind me to name my foldesr right next time
export default CardProperties;