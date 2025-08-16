"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, collection, addDoc, setDoc, getDocs, query, where } from "firebase/firestore";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { BinderContext } from "@/context/BinderContext";
import BinderProperties from "./BinderProperties";

interface BindersProps {
    viewOnly?: boolean,
    paramID?: string
}

const Binders: React.FC<BindersProps> = ({viewOnly, paramID}) => {
    const [binders, setBinders] = useState<{ id: string, name: string; index: number; color: string }[]>([]);
    const [addingBinder, setAddingBinder] = useState(false);
    const [binderName, setBinderName] = useState("");
    const [hoveredBinderId, setHoveredBinderId] = useState<string | null>(null);
    const binderContext = useContext(BinderContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const user = useFirebaseUser();

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    useEffect(() => {
        if (!user && !paramID) return;
        selectBinder("all")
    }, [user]);

    useEffect(() => {
        setBinderName("New Binder");
        inputRef.current?.select();
    }, [addingBinder]);

    useEffect(() => {
        getBinders();
    }, [currentBinder]);

    const getBinders = async () => {
        try {
            const targetUserID = paramID || (user ? user.uid : null);
            if (!targetUserID) return;
            
            const binderSnapshot = await getDocs(collection(db, "users", targetUserID, "binders"));
            const binderList = binderSnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                index: doc.data().index,
                color: doc.data().color,
            }));
            setBinders(binderList);
        } catch (error) {
            console.error("Error fetching binders:", error);
        }
    }

    const createBinder = async (name: string, color: string, e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user) return;
            let nameCheck = name.trim();
            let q = await query(collection(db, "users", user.uid, "binders"), where("name", "==", nameCheck));
            let querySnapshot = await getDocs(q);

             if (!nameCheck) {
                nameCheck = "New binder";
            }
            
            if (!querySnapshot.empty) {
                let index = 1;
                const originalName = nameCheck;
                while (!querySnapshot.empty) {
                    nameCheck = originalName + `(${index})`;
                    q = await query(collection(db, "users", user.uid, "binders"), where("name", "==", nameCheck));
                    querySnapshot = await getDocs(q);
                    index++;
                }
            } 

            await addDoc(collection(db, "users", user.uid, "binders"), {
                name: nameCheck,
                index: binders.length,
                color: color
            })
            setAddingBinder(false)
            getBinders();
        } catch (error) {
            console.error("Error creating binder:", error);
        }
    }

    const selectBinder = async (binderName: string) => {
        setCurrentBinder(binderName);
        console.log("Selected binder:", binderName);
        getBinders();
    }

    return (
        <div className='flex flex-col bg-[#141822] h-full w-64 text-[#a9a9ab] font-sans font-medium p-1 rounded-tr-3xl rounded-br-3xl relative border-r border-t border-b border-gray-600'>
            <div className="absolute top-0 left-0 w-full h-full z-1 overflow-x-hidden"
            style={{
                backgroundImage: `
                repeating-linear-gradient(0deg, rgba(36, 40, 61, 0.8) 0px, rgba(36, 40, 61, 0.8) 1px, transparent 1px, transparent 20px),
                repeating-linear-gradient(90deg, rgba(36, 40, 61, 0.8) 0px, rgba(36, 40, 61, 0.8) 1px, transparent 1px, transparent 20px)
                `,
                WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 40%, white 100%)`,
                maskImage: 'radial-gradient(circle at 50% 50%, transparent 40%, white 100%)'
            }}>
            </div>
            <div className="flex items-center ml-2 z-10">
                 <span>
                    <img src={"/box.svg"} className="w-6" style={{filter: "invert(62%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%)"}}/>
                </span>     
                <h1 className="m-2 text-[#cbcbcd] text-lg">Binders</h1>
            </div>
            <hr className="text-[#373739] z-10"></hr>
            <ul className="p-3 z-40">
                {binders
                    .slice()
                    .sort((a, b) => a.index - b.index)
                    .map(binder => {
                        return (
                            <li
                                key={binder.name}
                                className={"cursor-pointer flex rounded-md h-9 w-full z-10 hover:bg-[#343a4ab6] items-center justify-between "
                                    + (binder.id === currentBinder ? "bg-[#343a4aad] text-white" : "bg-[#14182200]")}
                                onClick={() => selectBinder(binder.id)}
                                onMouseEnter={() => setHoveredBinderId(binder.id)}
                                onMouseLeave={() => setHoveredBinderId(null)}
                            >
                                <p className="ml-4">{binder.name}</p>
                                <span className="mr-3 text-[#a9a9ab] relative">
                                    {hoveredBinderId === binder.id && binder.id != "all" && !viewOnly ? <BinderProperties binder={binder}/> : null}
                                </span>
                            </li>
                        )
                    })
                }
            </ul>
            {addingBinder && (
                <div className="border h-10 w-full bg-[#141822] z-10">
                    <form className="flex items-center h-10 w-full bg-[#141822]"
                    onSubmit={(e) => createBinder(binderName, "#92acb5", e)}>
                        <input
                        className="outline-none"
                        type="text"
                        value={binderName}
                        ref={inputRef}
                        autoFocus
                        onBlur={(e) => createBinder(binderName, "#92acb5", e)}
                        onChange={e => setBinderName(e.target.value)}>
                        </input>
                    </form>
                </div>
            )}
            {!viewOnly && <button 
            className="rounded-lg group flex items-center pl-15 h-10 z-10 w-full bg-[#141822b2] hover:bg-[#343a4ab2] hover:text-white"
            onClick={() => setAddingBinder(true)}>
                <img src={"/plus.svg"} className="w-6 filter group-hover:brightness-200"/>
                <p>
                    New binder
                </p>
            </button>}
        </div>
    )
}

export default Binders;
