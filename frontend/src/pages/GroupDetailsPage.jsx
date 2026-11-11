import { useLoaderData , Link  } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import Card from "../components/common/Card";

export default function GroupDetailsPage() {

    const { group, expenses, expensePage } = useLoaderData();

    return (
        <div className="container py-4">


             <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb align-items-center mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/app" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1">
                            <Home size={16} />
                            Groups
                        </Link>
                    </li>
                    <li className="d-flex align-items-center mx-2">
                        <ChevronRight size={14} className="text-muted" />
                    </li>

                    <li className="breadcrumb-item">
                        <Link
                            to={`/app/groups/${group.id}`}
                            className="text-decoration-none text-muted"
                        >
                            GroupDetails
                        </Link>
                    </li>
                </ol>
            </nav>

            <div>



            </div>

            <h2 className="fw-bold">{group.name}</h2>

            <p className="text-secondary">
                {group.description}
            </p>

            <h5>Group Members</h5>

            {group.groupMembers?.map(member => (
                <div key={member.memberId}>
                    {member.memberName}
                </div>
            ))}

            <hr />

            <h5>Expense History</h5>

            {expenses.length > 0 ? (
                expenses.map(expense => (
                    <div key={expense.id}>
                        {expense.title} - {expense.amount}
                    </div>
                ))
            ) : (
                <p className="text-secondary">
                    No expenses found.
                </p>
            )}

        </div>
    );
}