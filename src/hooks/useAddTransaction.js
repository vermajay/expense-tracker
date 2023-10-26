import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-hot-toast'
import { useGetUserInfo } from './useGetUserInfo'
 
export const useAddTransaction = () => {
    
    const transactionCollectionRef = collection(db, "transactions");
    const { userId } = useGetUserInfo();

    const addTransaction = async({description, transactionAmount, transactionType}) => {
        try{
            await addDoc(transactionCollectionRef, {
                userId,
                description,
                transactionAmount,
                transactionType,
                createdAt: serverTimestamp(),
            })
            toast.success("Transaction Added Successfully")
        }
        catch(error){
            toast.error(error.message);
        }
    }
    
    return { addTransaction };
}