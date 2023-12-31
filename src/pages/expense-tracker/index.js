import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAddTransaction } from '../../hooks/useAddTransaction'
import { useGetTransactions } from '../../hooks/useGetTransactions'
import { useGetUserInfo } from '../../hooks/useGetUserInfo'
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import toast from 'react-hot-toast';

const ExpenseTracker = () => {

  const { addTransaction } = useAddTransaction();
  const { transactions } = useGetTransactions();

  let balance, income=0, expense=0;
  transactions.forEach((transaction)=>{
    if(transaction.transactionType === "income") income += Number(transaction.transactionAmount);
    else expense += Number(transaction.transactionAmount);
  })
  balance = income - expense;

  const { name, profilePhoto } = useGetUserInfo();
  const firstName = name.split(" ").at(0);

  const navigate = useNavigate();

  //form states
  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");

  const submitHandler = (e) => {
    e.preventDefault();
    addTransaction({
      description,
      transactionAmount,
      transactionType
    });
    setDescription("");
    setTransactionAmount("");
    setTransactionType("expense");
  }

  const signUserOut = async() => {
    try{
      await signOut(auth);
      localStorage.clear();
      navigate("/");
      
      toast.success("Signed out successfully")
    }
    catch(error){
      toast.error(error.message);
    }
  }

  const deleteTransaction = async(id) => {
    try{
      const transactionDoc = doc(db, "transactions", id);

      const transaction = await getDoc(transactionDoc);
      const data = transaction.data();

      await deleteDoc(transactionDoc);
      toast.success(`Transaction '${data.description}' deleted successfully`);
    }
    catch(error){
      toast.error(error.message);
    }
  }

  return (
<div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 md:px-24 md:py-8">

<div className="w-full md:w-1/2">
  <h1 className="text-3xl mb-4">{firstName}'s Expense Tracker</h1>
  <div className="flex items-center">
    {profilePhoto && <img src={profilePhoto} alt='user' className="w-10 h-10 rounded-full mr-2" />}
    <button onClick={signUserOut} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Out</button>
  </div>
  <div className="mt-4">
    <p className="text-lg">Your balance</p>
    {balance >= 0 ? <p className="text-green-500 text-xl">₹ {balance}</p> : <p className="text-red-500 text-xl">- ₹{balance * -1}</p>}
  </div>
  <div className="mt-4 flex justify-start gap-10">
    <div>
      <p className="text-lg">Income</p>
      <p className="text-xl">₹ {income}</p>
    </div>
    <div>
      <p className="text-lg">Expenses</p>
      <p className="text-xl">₹ {expense}</p>
    </div>
  </div>
  <form onSubmit={submitHandler} className="mt-4">
    <input type="text" placeholder="Description" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-2 p-2 border border-gray-300 rounded" />
    <input type="number" placeholder="Amount" required value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} className="w-full mb-2 p-2 border border-gray-300 rounded" />

    <div className="flex items-center mb-4">
      <input type="radio" id="expense" checked={transactionType === "expense"} onChange={() => setTransactionType("expense")} className="mr-2" />
      <label htmlFor="expense">Expense</label>
      <input type="radio" id="income" checked={transactionType === "income"} onChange={() => setTransactionType("income")} className="ml-4 mr-2" />
      <label htmlFor="income">Income</label>
    </div>

    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Transaction</button>
  </form>
</div>

<div className="w-full md:w-1/2 mt-4 md:mt-0">
  <h1 className="text-3xl">Transactions</h1>
  <div className="mt-4 max-h-[35rem] overflow-y-auto">
    <ul className="space-y-4">
      {transactions.map((transaction) => {

        const { description, transactionAmount, transactionType, createdAt } = transaction;
        const time = new Date(createdAt?.seconds * 1000).toDateString();

        return (
          <li key={transaction.id} className="border-b pb-2 flex justify-between items-center">
            <div>
              <p className="truncate">{description}</p>
              <p>₹ {transactionAmount}</p>
              <p className={`${transactionType === "income" ? "text-green-500" : "text-red-500"}`}>{transactionType}</p>
              <p>{time}</p>
            </div>
            <button onClick={() => deleteTransaction(transaction.id)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Delete Transaction</button>
          </li>
        )
      })}
    </ul>
  </div>
</div>
</div>

  )
}

export default ExpenseTracker