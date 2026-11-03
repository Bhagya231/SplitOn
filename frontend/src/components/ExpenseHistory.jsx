
import { useNavigate } from "react-router-dom";

import Button from "./common/Button";
import { Eye  } from 'lucide-react';
import img from "../assets/NoEx.png"

function ExpenseHistory({ expenses = []  }) 
{

    const navigate = useNavigate();
    


    if (expenses.length === 0) 
    {
        return (
            <>



                <div className="text-center py-4">
                    <img src={img} alt="No expense" className="empty-state-image " width="550" height="250"/>
       
        
                </div>
            
            </>
          
        );
    }

    return (

        <>
            
            <div className="table-responsive mx-4">

                <table className="table table-bordered table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="text-center">S.No</th>
                            <th className="text-center">Description</th>
                            <th className="text-center">Amount (₹)</th>
                            <th className="text-center">Paid By</th>
                            <th className="text-center">Split Type</th>
                            <th className="text-center">Date</th>
                            <th className="text-center">Participants</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expenses.map((expense, index) => (
                            <tr key={expense.id}>
                                <td className="text-center">{index + 1}</td>

                                <td className="text-center">
                                    {expense.title}
                                </td>

                                <td className="text-center">
                                    ₹{Number(expense.amount).toFixed(2)}
                                </td>

                                <td className="text-center">
                                    {expense.payerName}
                                </td>

                                <td className="text-center">
                                    {expense.splitType === "EQUAL" ? "Equal": "Percentage"}
                                
                                </td>

                                <td className="text-center">
                                    {expense.date}
                                </td>

                                <td>
                                    {expense.splitMembers ?.map((member) => member.memberName).join(', ')}
                                </td>

                                <td className="text-center">
                                     <Button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        aria-label={`View ${expense.title}`}
                                        onClick={() => navigate(`/expenses/${expense.id}`)}>
                                        <Eye size={18} />
                                        <span className="ms-1">View</span>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


             



        </>
    );
}

export default ExpenseHistory;
