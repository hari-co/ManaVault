import { CardType } from "@/types/CardType";
import { createCard } from "@/utils/create-card";
import { BinderContext } from "@/context/BinderContext";
import { useState, useContext, useEffect, useRef } from "react";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { db } from "@/config/firebase-config";

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
    const { currentBinder, setCurrentBinder } = binderContext;

    const viewPrints = async (card: CardType) => {
        const url = card.prints_search_uri;
        const res = await fetch(url);
        const data = await res.json();
        let cardProcessList: CardType[] = [];
        data.data.forEach((scryCard: any) => {
            cardProcessList.push(createCard(scryCard, currentBinder));
        });
        setPrints(cardProcessList);
    }

    const changePrint = async (card: CardType, print: CardType) => {
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
                uri: print.uri
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
                uri: print.uri
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
                uri: print.uri
            })
        if (print.flavor_name) {
                await updateDoc(doc(db, "users", user.uid, "binders", "all", "cards", card.id), {flavor_name: print.flavor_name})
            }
        setShowPreview(null);
    }

    const changeQuantity = async (card: CardType, cardQuantity: number, e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !user.uid || !currentBinder) {
                console.log("Error");
                return;
            }
        if (currentBinder != "all") {
            await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id), {
                quantity: cardQuantity,
            })
        } else {
            const binderId = card.binder;
            if (binderId != "all" && binderId) {
                 await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", card.id), {
                quantity: cardQuantity,
            })
            }
        }
        await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
                quantity: cardQuantity,
            })
    }

    const changeBuyPrice = async (card: CardType, buyPrice: number, e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.uid || !currentBinder) {
            console.log("Error");
            return;
        }
        if (currentBinder != "all") {
            await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id), {
                buy_price: buyPrice,
            });
        } else {
            const binderId = card.binder;
            if (binderId != "all" && binderId) {
                await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", card.id), {
                    buy_price: buyPrice,
                });
            }
        }
        await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
            buy_price: buyPrice,
        });
    };

    const changeNotes = async (card: CardType, notes: string, e: React.FormEvent | React.FocusEvent<HTMLTextAreaElement>) => {
        if (e) e.preventDefault?.();
        if (!user || !user.uid || !currentBinder) {
            console.log("Error");
            return;
        }
        if (currentBinder != "all") {
            await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id), {
                notes: notes,
            });
        } else {
            const binderId = card.binder;
            if (binderId != "all" && binderId) {
                await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", card.id), {
                    notes: notes,
                });
            }
        }
        await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
            notes: notes,
        });
    };

    const changeCondition = async (card: CardType, key: string) => {
        if (!user || !user.uid || !currentBinder) {
                console.log("Error");
                return;
            }
        if (currentBinder != "all") {
            await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id), {
                condition: key,
            })
        } else {
            const binderId = card.binder;
            if (binderId != "all" && binderId) {
                 await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", card.id), {
                condition: key,
            })
            }
        }
        await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
                condition: key,
            })
        setShowConditions(false);
    }

    const changeBinder = async (card: CardType, binder: string) => {
        if (!user || !user.uid || !currentBinder) {
            console.log("Error");
            return;
        }
        const binderNameToId = binderMap.current.get(binder);
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
        setShowBinders(false);
    }

    const changeFoil = async (card: CardType, newFoil: boolean) => {
            setFoil(newFoil);
            if (!user || !user.uid || !currentBinder) {
                console.log("Error");
                return;
            }
            if (currentBinder != "all") {
                await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id), {
                    foil: newFoil,
                });
            } else {
                const binderId = card.binder;
                if (binderId != "all" && binderId) {
                    await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", card.id), {
                        foil: newFoil,
                    });
                }
            }
            await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
                foil: newFoil,
            });
        };

        const changeFavourite = async (card: CardType, newFavourite: boolean) => {
            setFavourite(newFavourite);
            if (!user || !user.uid || !currentBinder) {
                console.log("Error");
                return;
            }
            if (currentBinder != "all") {
                await updateDoc(doc(db, "users", user?.uid, "binders", currentBinder, "cards", card.id), {
                    favourite: newFavourite,
                });
            } else {
                const binderId = card.binder;
                if (binderId != "all" && binderId) {
                    await updateDoc(doc(db, "users", user?.uid, "binders", binderId, "cards", card.id), {
                        favourite: newFavourite,
                    });
                }
            }
            await updateDoc(doc(db, "users", user?.uid, "binders", "all", "cards", card.id), {
                favourite: newFavourite,
            });
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
                <div className="w-100">
                    {card.image_uris ? (
                        <img src={card.image_uris?.png} className="w-65 ml-10 mt-7"/>) :
                        <img src={card.card_faces[0].image_uris?.png} className="w-65 ml-10 mt-7"/>}
                    <div className="flex ml-5 w-full h-8 justify-center">
                         <p className="ml-5">${card.prices.usd}</p>
                    </div>
                    <a href={card.scryfallUri} target="_blank" className="ml-28 text-gray-400">View on Scryfall</a>
                </div>
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
                        <div>
                            <p>Printing</p>
                            <button
                                className="bg-gray-700/40 border border-gray-600 h-10 w-85 rounded-md flex justify-between items-center overflow-hidden"
                                onClick={() => {
                                    if (!printOpen) {
                                        viewPrints(card);
                                    }
                                    setPrintOpen(!printOpen);
                                }}
                                onBlur={() => setPrintOpen(false)}>
                                <span className="flex ml-4">
                                    <div 
                                    className={`h-6 w-6 mr-2`}
                                    style={{
                                        WebkitMaskImage: `url(/set_icons/${card.set}.svg)`,
                                        maskImage: `url(/set_icons/${card.set}.svg)`,
                                        WebkitMaskRepeat: "no-repeat",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskPosition: "center",
                                        maskPosition: "center",
                                        WebkitMaskSize: "contain",
                                        maskSize: "contain",
                                        background: `${rarityFilter[card.rarity]}`
                                }}></div>
                                <span className="whitespace-nowrap overflow-hidden max-w-65">{card.set_name + " " + card.collector_number}</span>
                                </span>
                                <span className="h-full flex justify-center items-center">
                                    <img src={"/dropdown.svg"} className="w-7 filter invert"/>
                                </span>
                            </button>
                            {printOpen && (
                                <div className="absolute border border-gray-500 bg-gray-600 max-h-70 w-90 overflow-y-auto rounded-sm z-50">
                                    <ul>
                                        {prints.map(print => (
                                            <li
                                            key={print.set_name + print.collector_number}
                                            className={`hover:bg-gray-500 px-3 py-1 ${print.set_name == card.set_name && print.collector_number == card.collector_number ? " bg-gray-500" : ""}`}
                                            onMouseEnter={() => {
                                                if (print.image_uris) {
                                                    setShowPreview(print)
                                                } else {
                                                    setShowPreview(print.card_faces[0])
                                                }
                                            }}
                                            onMouseLeave={() => setShowPreview(null)}
                                            onMouseDown={() => changePrint(card, print)}>
                                                <div className="flex">
                                                    <div 
                                                    className={`h-5.5 w-5.5 mr-2`}
                                                    style={{
                                                        WebkitMaskImage: `url(/set_icons/${print.set}.svg)`,
                                                        maskImage: `url(/set_icons/${print.set}.svg)`,
                                                        WebkitMaskRepeat: "no-repeat",
                                                        maskRepeat: "no-repeat",
                                                        WebkitMaskPosition: "center",
                                                        maskPosition: "center",
                                                        WebkitMaskSize: "contain",
                                                        maskSize: "contain",
                                                        background: `${rarityFilter[print.rarity]}`
                                                    }}></div>
                                                    {`${print.set_name} ${print.collector_number}`}
                                                </div>
                                                <div className="flex justify-between text-gray-400 ml-8">
                                                    <p>{print.flavor_name || print.card_name}</p>
                                                    <p>{`${print.prices.usd ? `$${print.prices.usd}` : "N/A"}`}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {showPreview && (
                                        <div className="fixed -right-22 ml-10">
                                            <img src={showPreview.image_uris?.normal} className="w-50 rounded-lg"/>
                                        </div>
                                    )}
                        </div>
                        <div className="ml-7">
                            <p>Quantity</p>
                            <form
                            onSubmit={e => changeQuantity(card, Number(cardQuantity), e)}>
                                <input
                                 type="number"
                                 className="bg-gray-700/40 border border-gray-600 w-17 h-10 rounded-md pl-4"
                                 placeholder={String(card.quantity)}
                                 value={cardQuantity}
                                 onChange={(e) => setCardQuantity(e.target.value)}
                                 onBlur={e => changeQuantity(card, Number(cardQuantity), e)}
                                 />
                            </form>
                        </div>
                    </div>
                    <div className="flex w-full h-15 ml-15 mt-5">
                        <div>
                            <h2>Binder</h2>
                            <button
                                className="bg-gray-700/40 border border-gray-600 h-10 w-60 rounded-md flex justify-between items-center pl-4"
                                onClick={() => setShowBinders(!showBinders)}>
                                <span>{binderName}</span>
                                <span className="h-full flex justify-center items-center">
                                    <img src={"/dropdown.svg"} className="w-7 filter invert"/>
                                </span>
                            </button>
                             {showBinders &&
                                <ul className="bg-gray-700 absolute w-60 border border-gray-500 rounded-md">
                                    {binderList.map(binder => (
                                        <li
                                        className={`z-50 flex items-center pl-4 h-8 hover:bg-gray-400 ${binderName == binder ? " bg-gray-400" : " bg-gray-700"}`}
                                        key={binder}
                                        onClick={() => changeBinder(card, binder)}>
                                            {binder}
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                        <div className="ml-4">
                            <h2>Condition</h2>
                            <button
                                className="bg-gray-700/40 border border-gray-600 h-10 w-18 rounded-md flex justify-between items-center pl-4"
                                onClick={() => setShowConditions(!showConditions)}>
                                <span>{card.condition}</span>
                                <span className="h-full flex justify-center items-center">
                                    <img src={"/dropdown.svg"} className="w-7 filter invert"/>
                                </span>
                            </button>
                            {showConditions &&
                                <ul className="bg-gray-700 absolute w-18 border border-gray-500 rounded-md">
                                    {conditions.map(condition => (
                                        <li
                                        className={`z-50 flex justify-center items-center h-8 hover:bg-gray-400 ${card.condition == condition ? " bg-gray-400" : " bg-gray-700"}`}
                                        key={condition}
                                        onClick={() => changeCondition(card, condition)}>
                                            {condition}
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                        <div className="ml-4">
                            <h2>Buy Price</h2>
                            <form className="flex bg-gray-700/40 border border-gray-600 w-23 h-10 rounded-md pl-3 items-center"
                                onSubmit={e => {
                                    e.preventDefault();
                                    const formatted = Number(buyPrice).toFixed(2);
                                    setBuyPrice(formatted);
                                    changeBuyPrice(card, Number(formatted), e);
                                }}>
                                <span className="mr-1">$</span>
                                <input
                                    className="w-16"
                                    type="number"
                                    step="0.01"
                                    placeholder={card.buy_price}
                                    value={buyPrice}
                                    onChange={e => setBuyPrice(e.target.value)}
                                    onBlur={e => {
                                        const formatted = Number(buyPrice).toFixed(2);
                                        setBuyPrice(formatted);
                                        changeBuyPrice(card, Number(formatted), e);
                                    }}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="flex w-full h-50 ml-15 mt-5">
                        <div>
                            <h2>Notes</h2>
                            <form
                                className="flex w-83 h-45 rounded-xl items-center"
                                onSubmit={e => {
                                    e.preventDefault();
                                    changeNotes(card, notes, e);
                                }}>
                                <textarea
                                    className="w-full h-full bg-gray-700/40 border border-gray-600 rounded-xl p-2 resize-none text-white"
                                    value={notes}
                                    placeholder="Type notes here..."
                                    onChange={e => setNotes(e.target.value)}
                                    onBlur={e => changeNotes(card, e.target.value, e)}
                                />
                            </form>
                        </div>
                        <div className="ml-8">
                            <h2 className="mt-5">Foil</h2>
                            <button
                                className={`bg-gray-700/40 border border-gray-600 h-10 w-18 rounded-md flex justify-center items-center text-2xl ${foil ? 'ring-2 ring-purple-400' : ''}`}
                                onClick={() => changeFoil(card, !foil)}>
                                {foil ? '★' : '☆'}
                            </button>
                            <h2 className="mt-6">Favourite</h2>
                            <button
                                className={`bg-gray-700/40 border border-gray-600 h-10 w-18 rounded-md flex justify-center items-center text-2xl ${favourite ? 'ring-2 ring-purple-400' : ''}`}
                                onClick={() => changeFavourite(card, !favourite)}>
                                {favourite ? '★' : '☆'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardProperties;