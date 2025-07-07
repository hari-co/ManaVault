"use client";
import { useState, useEffect, useContext } from "react";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, collection, addDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { BinderContext } from "@/context/BinderContext";
import { CardType } from "@/types/CardType";

const CardSearch: React.FC = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const user = useFirebaseUser();
    const binderContext = useContext(BinderContext);

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    const handleChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value);

        if (value.length < 3) {
            setResults([]);
            setShowSuggestions(false);
            return;
        } else {
            setLoading(true);
            const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(value)}`);
            const data = await response.json();
            setResults(data.data || []);
            setLoading(false);
            setShowSuggestions(true)
        }
    };

    const fetchCard = async (cardName: string): Promise<CardType | null> => {
        try {
            const res = await fetch (`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`);
            if (!res.ok) throw new Error("Card not found");
            const data = await res.json();
            const card: CardType = {
                id: 'N/A',
                card_name: data.name,
                image_uris: data.image_uris,
                add_date: new Date,
                last_price_update: new Date,
                binder: currentBinder,
                scryfallId: data.id,
                tcgplayerId: data.tcgplayer_id,
                tcgplayerEtchedId: data.tcgplayer_etched_id,
                cardMarketId: data.card_market_id,
                lang: data.lang,
                layout: data.layout,
                uri: data.uri,
                scryfallUri: data.scryfall_uri,
                prints_search_uri: data.prints_search_uri,
                collector_number: data.collector_number,
                all_parts: data.all_parts ? data.all_parts.map((part: any) => ({
                    name: part.name,
                })) : [],
                card_faces: data.card_faces ? data.card_faces.map((face: any) => ({
                    name: face.name,
                })) : [],
                cmc: data.cmc,
                color_identity: data.color_identity,
                color_indicator: data.color_indicator,
                colors: data.colors,
                defense: data.defense,
                edhrank: data.edhrec_rank,
                game_changer: data.game_changer,
                keywords: data.keywords,
                legality: data.legalities,
                loyalty: data.loyalty,
                mana_cost: data.mana_cost,
                oracle_text: data.oracle_text,
                power: data.power,
                produced_mana: data.produced_mana,
                reserved: data.reserved,
                toughness: data.toughness,
                type_line: data.type_line,
                artist: data.artist,
                frame: data.frame,
                frame_effects: data.frame_effects,
                full_art: data.full_art,
                oversized: data.oversized,
                prices: data.prices,
                promo: data.promo,
                rarity: data.rarity,
                reprint: data.reprint,
                scryfall_set: data.set,
                set_name: data.set_name,
                set: data.set,
                variation: data.variation,
                variation_of: data.variation_of,
            }
            for (const key in card) {
                if ((card as any)[key] === undefined) {
                    (card as any)[key] = null;
                }
            }
            return card;
        } catch (error) {
            console.error("Error fetching card:", error);
            return null;
        }
    };

    const handleSuggestionClick = async (suggestion: string) => {
        setQuery('');
        setShowSuggestions(false);

        try {
            if (!user || !user.uid) {
                console.log("No user logged in");
                return;
            }
            const saveData = await fetchCard(suggestion);
            const docRefAll = await addDoc(collection(db, "users", user.uid, "binders", "all", "cards"), saveData);
            await updateDoc(docRefAll, { id: docRefAll.id })
            if (currentBinder && currentBinder != "all") {
                await setDoc(doc(db, "users", user.uid, "binders", currentBinder, "cards", docRefAll.id), {...saveData, id: docRefAll.id});
            }
            setResults([]);
        } catch (error) {
            console.error("Error adding card to binder:", error);
        }
    };

    return (
        <div className="bg-amber-700 w-3xs h-10 z-50">
            <input 
                className="border rounded px-2 py-1 w-full h-full"
                type="text"
                name="card-search"
                placeholder="Search for a card..."
                value={query}
                onChange={handleChange}
                autoComplete="off"
                onFocus={() => setShowSuggestions(results.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            />
            {!showSuggestions && loading && <div className="bg-gray-800 text-white px-4 py-2">Loading...</div>}
            {showSuggestions && results.length > 0 && (
                <div className="border rounded bg-gray-800 text-white h-64 overflow-y-auto z-50">
                    <ul>
                        {results.map((suggestion) => (
                            <li
                                key={suggestion}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onMouseDown={() => handleSuggestionClick(suggestion)}
                                >
                                {suggestion}
                                </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CardSearch;