
import { useNavigate } from "react-router-dom";
import { Eye, CalendarDays, Users, Wallet, UserRound } from "lucide-react";

import Button from "./common/Button";
import img from "../assets/NoEx.png";

function ExpenseHistory({ expenses = [], groupId, onAddExpense  }) {
    const navigate = useNavigate();

    function formatAmount(amount) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0
        }).format(Number(amount || 0));
    }

    function handleOpenCreateModal() {
    onAddExpense?.();
}

    function formatDate(date) {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function handleViewExpense(expenseId) {
        navigate(`/app/groups/${groupId}/expenses/${expenseId}`);
    }

    function getSplitType(splitType) {
        return splitType === "EQUAL" ? "Equal Split" : "Percentage";
    }

    if (expenses.length === 0) {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-2 py-md-3">

            <img src={img} alt="No expenses found"  
                style={{
                    width: "100%",
                    maxWidth: "480px",
                    height: "250px",
                    objectFit: "contain"
                }}
            />
{/* 
            <h6 className="fw-semibold mb-2">
                No expenses yet
            </h6>

            <p className="text-muted small mb-3">
                Add your first expense to start tracking group spending.
            </p> */}

            <Button type="button" className="btn text-white px-3 py-2" style={{ backgroundColor: "#244B9B" }}  onClick={handleOpenCreateModal} >
                <i className="bi bi-plus-lg "></i>  
                    <span> Create Your First Expense</span>
            </Button>

        </div>
    );
}

    return (
        <div className="px-2 px-md-3 pb-3">

            
            <div className="d-none d-md-block table-responsive">
                <table className="table align-middle mb-0 border">
                    <thead>
                        <tr className="text-muted small border-bottom">
                            <th className="py-3 ps-3">S.NO</th>
                            <th className="py-3">Expense</th>
                            <th className="py-3">Paid By</th>
                            <th className="py-3">Amount</th>
                            <th className="py-3">Split Type</th>
                            <th className="py-3">Date</th>
                            <th className="py-3">Participants</th>
                            <th className="py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expenses.map((expense, index) => (
                            <tr key={expense.id} className="border-bottom">

                                <td className="ps-3 text-muted">
                                    {index + 1}
                                </td>

                                <td>
                                    <div className="fw-semibold text-dark">
                                        {expense.title}
                                    </div>
                                    <small className="text-muted">
                                        {expense.splitMembers?.length || 0} participants
                                    </small>
                                </td>

                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                                            style={{ width: "32px", height: "32px" }}>
                                            <UserRound size={16} />
                                        </div>
                                        <span className="small fw-medium">
                                            {expense.payerName || "-"}
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    <span className="fw-semibold text-dark">
                                        {formatAmount(expense.amount)}
                                    </span>
                                </td>

                                <td>
                                    <span className={`badge rounded-pill ${
                                        expense.splitType === "EQUAL"
                                            ? "bg-primary-subtle text-primary"
                                            : "bg-warning-subtle text-warning-emphasis"
                                    }`}>
                                        {getSplitType(expense.splitType)}
                                    </span>
                                </td>

                                <td>
                                    <span className="text-muted small">
                                        {formatDate(expense.date)}
                                    </span>
                                </td>

                                <td>
                                    <div className="d-flex flex-wrap gap-1">
                                        {expense.splitMembers?.slice(0, 2).map(member => (
                                            <span
                                                key={member.id}
                                                className="badge bg-light text-secondary border fw-normal"
                                            >
                                                {member.memberName}
                                            </span>
                                        ))}

                                        {expense.splitMembers?.length > 2 && (
                                            <span className="badge bg-light text-secondary border fw-normal">
                                                +{expense.splitMembers.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="text-center">
                                    <Button  variant="light" className="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center gap-1"  onClick={() => handleViewExpense(expense.id)}>
                                        <Eye size={16} />
                                        <span className="ms-1">View</span>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            
            <div className="d-md-none">
                {expenses.map(expense => (
                    <div
                        key={expense.id}
                        className="card border-0 shadow-sm mb-3"
                    >
                        <div className="card-body p-3">

                            <div className="d-flex justify-content-between align-items-start gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-3 bg-primary-subtle text-primary p-2">
                                        <Wallet size={20} />
                                    </div>

                                    <div>
                                        <h6 className="fw-semibold mb-1">
                                            {expense.title}
                                        </h6>
                                        <small className="text-muted">
                                            Paid by {expense.payerName || "-"}
                                        </small>
                                    </div>
                                </div>

                                <span className="fw-bold text-dark text-nowrap">
                                    {formatAmount(expense.amount)}
                                </span>
                            </div>

                            <hr className="my-3" />

                            <div className="row g-3">

                                <div className="col-6">
                                    <small className="text-muted d-flex align-items-center gap-1 mb-1">
                                        <CalendarDays size={14} />
                                        Date
                                    </small>
                                    <span className="small fw-medium">
                                        {formatDate(expense.date)}
                                    </span>
                                </div>

                                <div className="col-6">
                                    <small className="text-muted d-flex align-items-center gap-1 mb-1">
                                        <Users size={14} />
                                        Participants
                                    </small>
                                    <span className="small fw-medium">
                                        {expense.splitMembers?.length || 0} members
                                    </span>
                                </div>

                                <div className="col-12">
                                    <span className={`badge rounded-pill ${
                                        expense.splitType === "EQUAL"
                                            ? "bg-primary-subtle text-primary"
                                            : "bg-warning-subtle text-warning-emphasis"
                                    }`}>
                                        {getSplitType(expense.splitType)}
                                    </span>
                                </div>

                                <div className="col-12">
                                    <small className="text-muted d-block mb-2">
                                        Split among
                                    </small>

                                    <div className="d-flex flex-wrap gap-1">
                                        {expense.splitMembers?.map(member => (
                                            <span
                                                key={member.id}
                                                className="badge bg-light text-secondary border fw-normal"
                                            >
                                                {member.memberName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-3">
                                <Button variant="light"   className="btn btn-sm btn-outline-primary" onClick={() => handleViewExpense(expense.id)} >
                                    <Eye size={16} />
                                    <span className="ms-1">View Details</span>
                                </Button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default ExpenseHistory;
