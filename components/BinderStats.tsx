import { BinderContext } from "@/context/BinderContext";
import { useContext } from "react";

const BinderStats: React.FC = () => {
    const binderContext = useContext(BinderContext)

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    return (

    )
}

export default BinderStats;