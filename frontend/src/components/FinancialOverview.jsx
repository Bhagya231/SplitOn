
import { Card } from "react-bootstrap";
import { Wallet,HandCoins,Scale,ChartNoAxesColumn,Plus} from "lucide-react";

export default function FinancialOverview({ totalExpenses = 0,yourContribution = 0,yourBalance = 0,onViewBalance,onAddExpense }) 
{
    const formatAmount = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

    const cards = [
        {
            title: "Total Group Expenses",
            amount: totalExpenses,
            icon: Wallet,
            decoration: Wallet,
            background: "bg-primary-subtle",
            iconBackground: "bg-primary bg-opacity-10",
            color: "text-primary"
        },
        {
            title: "Your Total Contribution",
            amount: yourContribution,
            icon: HandCoins,
            decoration: HandCoins,
            background: "bg-success-subtle",
            iconBackground: "bg-success bg-opacity-10",
            color: "text-success"
        },
        {
            title: "Your Share",
            amount: Math.abs(yourBalance),
            icon: Scale,
            decoration: Scale,
            background: "bg-purple-subtle",
            iconBackground: "bg-purple-soft",
            color: "text-purple",
            balance: true
        }
    ];



    return (
        <section className="bg-white rounded-4 shadow-sm p-3 p-md-4">

            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">

                <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 48, height: 48 }}>
                        <ChartNoAxesColumn size={25} />
                    </div>

                    <div>
                        <h4 className="fw-bold mb-1">Financial Overview</h4>
                        <p className="text-secondary small mb-0">
                            Quick summary of your group expenses
                        </p>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-primary rounded-4 flex-fill d-flex align-items-center justify-content-center gap-2 py-2" onClick={onViewBalance} >
                        <ChartNoAxesColumn size={20} />
                        <span className="text-start">
                            <span className="d-block fw-semibold small">
                                View Balance Sheet
                            </span>
                            <span className="d-none d-sm-block small">
                                See settlements
                            </span>
                        </span>
                    </button>

                    <button type="button" className="btn btn-primary rounded-4 flex-fill d-flex align-items-center justify-content-center gap-2 py-2"
                        onClick={onAddExpense} >
                        <Plus size={22} />
                        <span className="text-start">
                            <span className="d-block fw-semibold small">
                                Add Expense
                            </span>
                            <span className="d-none d-sm-block small">
                                Record expense
                            </span>
                        </span>
                    </button>
                </div>
            </div>

            
            <div className="row g-3">
                {cards.map((item) => {
                    const Icon = item.icon;
                    const Decoration = item.decoration;

                    return (
                        <div className="col-12 col-md-4" key={item.title}>
                            <Card className={`border-0 rounded-4 h-100 overflow-hidden ${item.background}`}>
                                <Card.Body className="p-3 p-md-4 position-relative">

                                    <div className="d-flex align-items-center gap-3 position-relative"
                                        style={{ zIndex: 1 }}>

                                        <div className={`rounded-circle ${item.iconBackground} ${item.color} d-flex align-items-center justify-content-center flex-shrink-0`}
                                            style={{ width: 66, height: 66 }}>
                                            <Icon size={35} strokeWidth={2} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="mb-1 small fw-medium">
                                                {item.title}
                                            </p>

                                            <h3 className={`fw-bold mb-0 ${item.balance ? (yourBalance >= 0 ? "text-success" : "text-danger") : "text-dark"}`}>
                                                {formatAmount(item.amount)}
                                            </h3>

                                            {item.balance && (
                                                <span className={`badge rounded-pill mt-2 ${yourBalance >= 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                                                    {yourBalance > 0 ? " Should Receive" : yourBalance === 0 ? "Settled" : "You owe"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                  
                                    <Decoration
                                        className="position-absolute end-0 bottom-0 opacity-50"
                                        size={85}
                                        strokeWidth={1.5}
                                    />

                                </Card.Body>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
