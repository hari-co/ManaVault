import { createContext, useState } from "react";

export const BinderContext = createContext<{
    currentBinder: string | null, 
    setCurrentBinder: (b: string | null) => void,
    cardsUpdated: number,
    triggerCardsUpdate: () => void
} | null>(null);

export const BinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentBinder, setCurrentBinder] = useState<string | null>("All Cards");
    const [cardsUpdated, setCardsUpdated] = useState<number>(0);

    const triggerCardsUpdate = () => {
        setCardsUpdated(prev => prev + 1);
    };

    return (
        <BinderContext.Provider value={{ 
            currentBinder,
            setCurrentBinder,
            cardsUpdated,
            triggerCardsUpdate
        }}>
            {children}
        </BinderContext.Provider>
    );
};