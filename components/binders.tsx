"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, collection, addDoc, setDoc, getDocs, query, where } from "firebase/firestore";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { BinderContext } from "@/context/BinderContext";

const Binders: React.FC = () => {
    const [binders, setBinders] = useState<{ name: string; index: number; color: string }[]>([]);
    const [addingBinder, setAddingBinder] = useState(false);
    const [binderName, setBinderName] = useState("");
    const binderContext = useContext(BinderContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const user = useFirebaseUser();

    if (!binderContext) throw new Error("BinderContext not found.");
    const { currentBinder, setCurrentBinder } = binderContext;

    useEffect(() => {
        if (!user) return;
        setCurrentBinder("All Cards");
        getBinders();
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
                nameCheck = "New Binder";
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
        <div className='flex flex-col bg-gray-600 h-screen w-64'>
            Binders
            <ul>
                {binders
                    .slice()
                    .sort((a, b) => a.index - b.index)
                    .map(binder => {
                        return (<li
                        key= {binder.name}
                        className={"flex border h-10 w-full hover:bg-purple-600 items-center " 
                            + (binder.name === currentBinder ? "bg-purple-600" : "bg-purple-800")}
                        onClick={() => selectBinder(binder.name)}>
                        <span
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: binder.color }}>
                        </span>
                        {binder.name}
                        </li>
                    )})
                }
            </ul>
            {addingBinder && (
                <div className="border h-10 w-full bg-gray-900">
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
            className="border h-10 w-full bg-emerald-400 hover:bg-emerald-100"
            onClick={() => setAddingBinder(true)}>
                New Binder
            </button>
        </div>
    )
}

export default Binders;