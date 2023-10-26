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
    <div>
      <div>
        <p>{firstName}'s Expense Tracker</p>
        <div>
          {profilePhoto && <img src={profilePhoto} alt='user'/>}
          <button onClick={signUserOut}>SignOut</button>
        </div>
        <div>
          <p>Your balance</p>
          {
            balance >= 0 ? <p className="text-green-500">₹ {balance}</p> : <p className="text-red-500">- ₹{balance*-1}</p>
          }
        </div>
        <div>
          <div>
            <p>Income</p>
            <p className='text-green-500'>₹ {income}</p>
          </div>
          <div>
            <p>Expenses</p>
            <p className='text-red-500'>₹ {expense}</p>
          </div>
        </div>
        <form onSubmit={submitHandler}>
          <input type="text" placeholder="description" required value={description} onChange={(e)=>setDescription(e.target.value)}/>
          <input type="number" placeholder="amount" required value={transactionAmount} onChange={(e)=>setTransactionAmount(e.target.value)}/>

          <input type="radio" id="expense" checked={transactionType === "expense"} onChange={()=>setTransactionType("expense")}/>
          <label htmlFor="expense">Expense</label>
          <input type="radio" id="income" checked={transactionType === "income"} onChange={()=>setTransactionType("income")}/>
          <label htmlFor="income">Income</label>

          <button>Add Transaction</button>
        </form>
      </div>
      <div>
        <p>Transactions</p>
        <ul>
          {transactions.map((transaction)=>{

            const { description, transactionAmount, transactionType, createdAt } = transaction;
            const time = new Date(createdAt?.seconds*1000).toDateString();

            return (
              <li key={transaction.id}>
                <p>{description}</p>
                <p>₹ {transactionAmount}</p>
                <p className={`${transactionType === "income" ? "text-green-500" : "text-red-500"}`}>{transactionType}</p>
                <p>{time}</p>
                <button onClick={()=>deleteTransaction(transaction.id)} className='bg-red-500'>Delete Transaction</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default ExpenseTracker