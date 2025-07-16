"use client";
import { useState, useEffect, useContext } from "react";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, collection, addDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { BinderContext } from "@/context/BinderContext";
import { CardType } from "@/types/CardType";
import { createCard } from "@/utils/create-card";

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
            const card = createCard(data, currentBinder)
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
        <div className="bg-[#121519] w-3xs h-10 z-50 relative">
            <input 
                className="border border-[#5e5e5e] rounded px-2 py-1 w-full h-full"
                type="text"
                name="card-search"
                placeholder="Search for a card..."
                value={query}
                onChange={handleChange}
                autoComplete="off"
                onFocus={() => setShowSuggestions(results.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            />
            {!showSuggestions && loading && <div className="absolute left-0 top-full bg-gray-800 text-white px-4 py-2 z-50">Loading...</div>}
            {showSuggestions && results.length > 0 && (
                <div className="absolute left-0 top-full border rounded bg-gray-800 text-white h-64 overflow-y-auto z-50">
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