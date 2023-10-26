import { Route, Routes } from 'react-router-dom'
import Auth from './pages/auth';
import ExpenseTracker from './pages/expense-tracker'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Auth/>} />
        <Route path='track' element={<ExpenseTracker/>} />
      </Routes>
    </div>
  );
}

export default App;