
import { useNavigate, useLoaderData } from "react-router-dom";

import ExpenseForm from "../components/ExpenseForm";
import api from "../util/Api";
import bg from "../assets/membersbg.png";

export default function AddExpensePage({onExpenseSaved,})
 {
  const navigate = useNavigate();
  
  const { members, groupId } = useLoaderData();
  

 

  async function handleAddExpense(expenseData) 
  {
    const response = await api.post( `/groups/${groupId}/expenses/add`, expenseData );

    const createdExpense = response.data;

    onExpenseSaved?.({ type: "ADD",  expense: createdExpense,});

    navigate(`/app/groups/${groupId}`, { replace: true });

    return createdExpense;
  }

  return (

    <div className="container-fluid py-2 px-0"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minHeight: "100vh"
                }}
            >
                <div className="container-fluid px-5 py-1 py-md-3">
    <div className="container py-4">
      <ExpenseForm
        members={members}
        onSubmit={handleAddExpense}
        onCancel={() => navigate(-1)}
      />
    </div>
    </div>
    </div>
    
  );
}
