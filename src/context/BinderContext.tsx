import { createContext, useState } from "react";

export const BinderContext = createContext<{ currentBinder: string | null, setCurrentBinder: (b: string | null) => void } | null>(null);

export const BinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentBinder, setCurrentBinder] = useState<string | null>("All Cards");
    return (
        <BinderContext.Provider value={{ currentBinder, setCurrentBinder }}>
            {children}
        </BinderContext.Provider>
    );
};