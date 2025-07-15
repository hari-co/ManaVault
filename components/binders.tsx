"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, collection, addDoc, setDoc, getDocs, query, where } from "firebase/firestore";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { BinderContext } from "@/context/BinderContext";

const Binders: React.FC = () => {
    const [binders, setBinders] = useState<{ id: string, name: string; index: number; color: string }[]>([]);
    const [addingBinder, setAddingBinder] = useState(false);
    const [binderName, setBinderName] = useState("");
    const binderContext = useContext(BinderContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const user = useFirebaseUser();

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    useEffect(() => {
        if (!user) return;
        selectBinder("all")
    }, [user]);

    useEffect(() => {
        setBinderName("New Binder");
        inputRef.current?.select();
    }, [addingBinder])

     if (!user) {
        return <div className='flex bg-gray-600 h-screen w-64'>Loading...</div>;
    }

    const getBinders = async () => {
        try {
            const binderSnapshot = await getDocs(collection(db, "users", user.uid, "binders"));
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

    const createBinder = async (name: string, color: string) => {
        try {
            let nameCheck = name.trim();
            let q = await query(collection(db, "users", user.uid, "binders"), where("name", "==", nameCheck));
            let querySnapshot = await getDocs(q);

             if (!nameCheck) {
                nameCheck = "New binder";
            }
            
            if (!querySnapshot.empty) {
                // If a binder with the same name exists, itemize the name
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
        <div className='flex flex-col bg-[#1f1f21] h-full w-64 text-[#a9a9ab] font-sans font-medium p-1'>
            <div className="flex items-center ml-2">
                 <span>
                    <img src={"/box.svg"} className="w-6" style={{filter: "invert(62%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%)"}}/>
                </span>     
            <h1 className="m-2 text-[#cbcbcd] text-lg">Binders</h1>
            </div>
            <hr className="text-[#373739]"></hr>
            <ul className="p-3">
                {binders
                    .slice()
                    .sort((a, b) => a.index - b.index)
                    .map(binder => {
                        return (<li
                        key= {binder.name}
                        className={"cursor-pointer flex rounded-md h-9 w-full hover:bg-[#373739] items-center " 
                            + (binder.id === currentBinder ? "bg-[#373739] text-white" : "bg-[#1f1f21")}
                        onClick={() => selectBinder(binder.id)}>
                        <p className="ml-4">{binder.name}</p>
                        </li>
                    )})
                }
            </ul>
            {addingBinder && (
                <div className="border h-10 w-full bg-[#1f1f21]">
                    <form className="flex items-center h-10 w-full bg-amber-50">
                        <input
                        className="outline-none"
                        type="text"
                        value={binderName}
                        ref={inputRef}
                        autoFocus
                        onBlur={() => createBinder(binderName, "#92acb5")}
                        onChange={e => setBinderName(e.target.value)}>
                        </input>
                    </form>
                </div>
            )}
            <button 
            className="rounded-lg group flex items-center pl-12 h-10 w-full bg-[#1f1f21] hover:bg-[#373739] hover:text-white"
            onClick={() => setAddingBinder(true)}>
                <img src={"/plus.svg"} className="w-6 filter group-hover:brightness-200"/>
                <p>
                    New binder
                </p>
            </button>
        </div>
    )
}

export default Binders;