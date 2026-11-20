
import { useNavigate, useLoaderData } from "react-router-dom";

import ExpenseForm from "../components/ExpenseForm";
import bg from "../assets/membersbg.png";

export default function AddExpensePage({ onExpenseSaved }) {
  const navigate = useNavigate();

  const { members, groupId } = useLoaderData();

  return (
    <div
      className="container-fluid py-2 px-0"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="container-fluid px-5 py-1 py-md-2">
        <div className="container py-4">
          <ExpenseForm
            members={members}
            groupId={groupId}   
            onExpenseSaved={onExpenseSaved}
            onCancel={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  );
}
