
import { useLoaderData, useRevalidator,useNavigate } from "react-router-dom";

import api from "../util/Api";
import Card from "../components/common/Card";
import AddMember from "../components/AddMembers";
import MemberList from "../components/MemberList";
import AddExpense from "../components/AddExpense";
import Button from "../components/common/Button";
import ExpenseHistory from "../components/ExpenseHistory";
import Img from "../assets/membersbg.png"


function MembersPage() 
{

    const {members, expenses} = useLoaderData();
    const revalidator = useRevalidator();
    const navigate = useNavigate();



     async function handleAddMember({name,email}) 
    {
        try {
        const res =  await api.post("/members/add", {name , email });

         await revalidator.revalidate();

        console.log("Member added successfully:", res.data);

        return true;
        } catch (error) {
        console.error( "Failed to add member:",  error.response?.data || error.message || 500);
  
        return false;
        }
    };


    async function handleDeleteMember(memberId)
     {
        try {
            await api.delete(`/members/delete/${memberId}`);

            await revalidator.revalidate();

            console.log("Member deleted successfully");
            return true;

        } catch (error) {
            console.error("Failed to delete member:",error.response?.data || error.message);

            return false;
        }
    }

    


    async function handleAddExpense(expenseData) 
    {
        try {
            const response = await api.post("/expense/add", expenseData);

            await revalidator.revalidate();

            console.log("Expense added successfully:", response.data);

            return true;

        } catch (error) {
            console.error( "Failed to add expense:",error.response?.data || error.message );
            return false;
        }
    }


    async function handleDeleteExpense(expenseId) 
    {
        try {
            await api.delete(`/expense/delete/${expenseId}`);

            await revalidator.revalidate();

            console.log("Expense deleted successfully");
            return true;
        } catch (error) {
            console.error(  "Failed to delete expense:",error.response?.data || error.message);
            return false;
        }
    }
  


  return (
    <div className="container-fluid py-3  bg-light" 
          style={{
            backgroundImage: `url(${Img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
      <div className="row g-3 mx-5  mt-2">
        <div className="col-12">
          <Card title="Add Member">
            <AddMember onAddMember={handleAddMember} />
          </Card>
        </div>

        <div className="col-12">
            <div className="d-flex justify-content-end mx-4 mb-3">
              <Button type="button" variant="primary" onClick={() => navigate("/members/add")}>
                + Add Members
            </Button>
            </div>
          <Card title={`Members (${members ? members.length : 0})`}>
            <MemberList members={members}  onDeleteMember={handleDeleteMember} />
          </Card>
        </div>

        <div className="col-12">
          <Card title="Add Expense">
            <AddExpense members={members} onAddExpense={handleAddExpense}/>
          </Card>
        </div>

        <div className="col-12">

          <div className="d-flex justify-content-end mx-4 mb-3">
                <Button
                    type="button"
                    variant="primary"
                    onClick={() => navigate("/expenses/add")}
                >
                    + Add Expense
                </Button>
            </div>
          <Card title={`Expense History (${expenses ? expenses.length : 0})`}>
            
            <ExpenseHistory expenses={expenses} onDeleteExpense={handleDeleteExpense}/>
          </Card>
        </div>
      </div>

    </div>

  );
}

export default MembersPage;