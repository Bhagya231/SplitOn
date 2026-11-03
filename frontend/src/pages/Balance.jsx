
import { useLoaderData } from "react-router-dom";
import Card from "../components/common/Card";
import {formatCurrency} from "../util/formatCurrency";
import Button from "../components/common/Button";



function BalancesPage() {
  const {balances,total } = useLoaderData();

  return (
    <div className="container py-4">


        <Card title="Total Summary">
            <Card  className="w-25 bg-primary-subtle">
                <div className="container">
                    <h4 className="mb-3">Total Expenses</h4>

                <h2 className="text-center">₹{total}</h2>
                </div>
            
        </Card>

        </Card>





      <Card className="shadow-lg rounded-3 border-0 overflow-hidden">
        <h4 className="mb-3">Member Balances</h4>

        {balances.length === 0 ? (
          <p className="text-muted">No balances available.</p>
        ) : (
          <div className="table-responsive   ">
            <table className="table  table-hover  align-middle">
              <thead className="table-secondary text-dark">
                <tr>
                  <th>#</th>
                  <th>Member</th>
                  <th className="text-end">Total Paid</th>
                  <th className="text-end">Total Share</th>
                  <th className="text-end">Net Balance</th>
                  <th className="text-end">Status</th>
                </tr>
              </thead>

              <tbody>
                {balances.map((member, index) => {
                  const balance = Number(member.balance ?? 0);

                  return (
                    <tr key={member.memberId}>
                      <td>{index + 1}</td>
                      <td>{member.memberName}</td>
                      <td className="text-end">
                        {formatCurrency(member.totalPaid)}
                      </td>
                      <td className="text-end">
                        {formatCurrency(member.totalShare)}
                      </td>
                      <td className={`text-end fw-semibold ${member.balance > 0 ? 'text-success' : member.balance < 0 ? 'text-danger' : ''}`}>
                        {balance > 0 ? "+" : ""}
                        {formatCurrency(member.balance)}
                      </td>

                      <td className="text-end fw-semibold">
                          <Button className={member.balance > 0 ? 'bg-success-subtle' : member.balance < 0 ? 'bg-danger-subtle' : 'bg-dark-subtle' }>
                            <span className={member.balance > 0 ? 'text-success' : member.balance < 0 ? 'text-danger' : '' }>
                                {member.status}
                            </span></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default BalancesPage;
