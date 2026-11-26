
import { useLoaderData , Link,useParams } from "react-router-dom";
import Card from "../components/common/Card";
import {formatCurrency} from "../util/formatCurrency";

import BalanceChart from "../components/BalanceChart";
import { ChevronRight ,Wallet } from "lucide-react"


import {  Home } from "lucide-react";



function BalancesPage() 
{

  const { balance, groupBalance } = useLoaderData();


   const { totalGroupExpenses = 0, totalExpenseInGroup = 0,totalGroupMembers = 0, totalGroupPaid = 0, myPaid = 0,  myShare = 0, myNetBalance = 0,
              membersWhoWillGetBack = [],
              membersWhoNeedToPay = [],
              settledMembers = []
            } = groupBalance || {};


            const isReceiving = myNetBalance > 0;
            const isOwing = myNetBalance < 0;

        
            

  const { groupId } = useParams();
  

  return (
    <div className="container py-4">

      <nav aria-label="breadcrumb" className="mb-4">

          <ol className="breadcrumb align-items-center mb-2">

              <li className="breadcrumb-item ">
                  <Link to="/app" className="text-decoration-none breadcrumb-link d-flex align-items-center gap-1" >
                      <Home size={16} />
                      Groups
                  </Link>
              </li>

              <li className="d-flex align-items-center mx-2">
                            <ChevronRight size={14} className="text-muted" />
                        </li>

              <li className="breadcrumb-item ">
                  <Link to={`/app/groups/${groupId}`} className="text-decoration-none breadcrumb-link" >
                      GroupDetails 
                  </Link>
              </li>

              <li className="d-flex align-items-center mx-2">
                            <ChevronRight size={14} className="text-muted" />
                        </li>

              <li className="breadcrumb-item active fw-bold" aria-current="page">
                  Balance Sheet
              </li>

          </ol>

          <h3 className="fw-bold mb-1">Balance Sheet</h3>

          <p className="text-secondary small mb-0">
              View group expenses and member balances
          </p>

      </nav>


        <Card title="Total Summary">
          <div className="row g-3">
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <Card>
                <div className="bg-primary-subtle text-center rounded-3 p-3">
                  {/* <Wallet size={14} /> */}
                  <h5 className="mb-3">Total Expenses</h5>
                  <h2 className="text-primary fw-bold mb-0">
                    {formatCurrency(totalGroupExpenses)}
                  
                  </h2>
                </div>
              </Card>
            </div>

            

            
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <Card>
                <div className="bg-primary-subtle text-center rounded-3 p-3">
                  <h5 className="mb-3"> Members</h5>
                  <h2 className="text-primary fw-bold mb-0">
                      {totalGroupMembers}
                  </h2>
                </div>
              </Card>
              
              
            </div>
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <Card>
                <div className="bg-primary-subtle text-center rounded-3 p-3">
                  <h5 className="mb-3"> Expenses</h5>
                  <h2 className="text-primary fw-bold mb-0">
                    {totalExpenseInGroup}
                  </h2>
                </div>
              </Card>
              
              
            </div>           
          

            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <Card>
                <div className="bg-primary-subtle text-center rounded-3 p-3">
                  <h5 className="mb-3">Your Total Paid</h5>
                  <h2 className="text-primary fw-bold mb-0">
                    {formatCurrency(myPaid)}
                  
                  </h2>
                </div>
              </Card>
            </div>

            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <Card>
                <div className="bg-primary-subtle text-center rounded-3 p-3">
                  <h5 className="mb-3">Your Total Share</h5>
                  <h2 className="text-primary fw-bold mb-0">
                    {formatCurrency(myShare)}
                  
                  </h2>
                </div>
              </Card>
            </div>
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <Card>
                <div className="bg-primary-subtle text-center rounded-3 p-3">
                  <h5 className="mb-3">Your Net Balance</h5>
                  <h2 className="text-primary fw-bold mb-0 ">
                    {formatCurrency(myNetBalance)}
                  
                  </h2>
                </div>
              </Card>
            </div>
            </div>

          
        </Card>









      <Card className="shadow-lg rounded-3 border-0 overflow-hidden">
        <h4 className="mb-3">Member Balances</h4>

        {balance.length === 0 ? (
          <p className="text-muted">No balances available.</p>
        ) : (
          <div className="table-responsive   ">
            <table className="table  table-hover  align-middle">
              <thead className="table-secondary text-dark">
                <tr>
                  <th>S.No</th>
                  <th>Member</th>
                  <th className="text-end">Total Paid</th>
                  <th className="text-end">Total Share</th>
                  <th className="text-end">Net Balance</th>
                  <th className="text-end">Status</th>
                </tr>
              </thead>

              <tbody>
                {balance.map((member, index) => {
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

                      <td className="text-end">
                        <span
                            className={`badge rounded-pill px-3 py-2 ${member.balance > 0 ? "bg-success-subtle text-success"
                                  : member.balance < 0 ? "bg-danger-subtle text-danger" : "bg-secondary-subtle text-secondary" }`}>
                            {member.balance > 0  ? " owed"  : member.balance < 0 ? "owe"  : "Settled" }      
                        </span>
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card  title="Net Balance per Member">
        <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <BalanceChart members= {balance} />
        </div>
      </div>
    </div>
      </Card>
    </div>
  );
}

export default BalancesPage;
