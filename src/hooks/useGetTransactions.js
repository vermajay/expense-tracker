import { useEffect, useState } from "react"
import { query, collection, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useGetUserInfo } from './useGetUserInfo'
import toast from "react-hot-toast";

export const useGetTransactions = () => {

    const [transactions, setTransactions] = useState([]);

    const transactionCollectionRef = collection(db, "transactions");
    const {userId} = useGetUserInfo();

    const getTransactions = async() => {
        let unsubscribe;
        try{
            const queryTransactions = query(transactionCollectionRef, where("userId", "==", userId), orderBy("createdAt"));

            unsubscribe = onSnapshot(queryTransactions, (snapshot)=>{
                let docs = [];
                snapshot.forEach((doc)=>{
                    const data = doc.data();
                    const id = doc.id;

                    docs.push({...data, id});
                })
                setTransactions(docs);
            })
        }
        catch(error){
            toast.error(error.message);
        } 
        return () => unsubscribe();
    }

    useEffect(()=>{
        getTransactions();
    }, [])

    return { transactions };
}