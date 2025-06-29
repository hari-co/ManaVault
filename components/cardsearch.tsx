"use client";
import React, { useState } from "react";

const CardSearch: React.FC = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value);

        if (value.length < 3) {
            setResults([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(value)}`);
        const data = await response.json();
        setResults(data.data || []);
        setLoading(false);
        setShowSuggestions(true)
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
    })

    return (
        <div>
            <input 
                className="border rounded px-2 py-1 flex-grow"
                type="text"
                name="card-search"
                placeholder="Search for a card..."
                value={query}
                onChange={handleChange}
                autoComplete="off"
                onFocus={() => setShowSuggestions(results.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            />
            {loading && <div>Loading...</div>}
            {showSuggestions && results.length > 0 && (
                <div className="bg-gray-800 text-white">
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