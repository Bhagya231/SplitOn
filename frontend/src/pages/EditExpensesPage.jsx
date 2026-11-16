
import {useNavigate, useLoaderData} from "react-router-dom";

import ExpenseForm from "../components/ExpenseForm";
import api from "../util/Api";
import bg from "../assets/membersbg.png";

export default function EditExpensePage({  onExpenseSaved}) 
{

  const navigate = useNavigate();

  const { expense, members, groupId } = useLoaderData();


  console.log("expenses ", expense)
  async function handleEditExpense(expenseData) 
  {
    const response = await api.put(
      `/groups/${groupId}/expenses/${id}`,
      expenseData
    );

    const updatedExpense = response.data;

    onExpenseSaved?.({
      type: "EDIT",
      expense: updatedExpense,
    });

    navigate(`/app/groups/${groupId}`, { replace: true });

    return updatedExpense;
  }

  if (!expense) {
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
      <div className="container py-5">
        <div className="alert alert-warning">
          Expense details are not available. Please open the expense again.
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/app/groups/${groupId}`)}
        >
          Back to Group
        </button>
      </div>
      </div>
      </div>
    );
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
        expense={expense}
        members={members}
        onSubmit={handleEditExpense}
        onCancel={() => navigate(-1)}
      />
    </div>
                        </div>
                        </div>
    
  );
}
