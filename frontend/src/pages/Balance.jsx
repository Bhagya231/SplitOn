
import { useLoaderData , Link,useParams } from "react-router-dom";
import Card from "../components/common/Card";
import {formatCurrency} from "../util/formatCurrency";

import BalanceChart from "../components/BalanceChart";
import { ChevronRight ,Wallet , TrendingUp, TrendingDown,CheckCircle } from "lucide-react"

import MemberBalanceCard from "../components/MemberBalanceCard"


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

        // const isReceiving = 0;
        //      const isOwing = -5;
            

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
            {/* <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <Card>
                <div className="bg-primary-subtle text-center rounded-3 p-3">
                  <h5 className="mb-3">Your Net Balance</h5>
                  <h2 className="text-primary fw-bold mb-0 ">
                    {formatCurrency(myNetBalance)}
                  
                  </h2>
                </div>
              </Card>
            </div> */}
            </div>

          
        </Card>


         <section className={`card border-0 shadow-sm mb-4 ${isReceiving ? "bg-success-subtle" : isOwing ? "bg-danger-subtle" : "bg-light"}`}>
          <div className="card-body p-3 p-md-4">
            <div className="row align-items-center g-3">

              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3">

                  <div className={`rounded-circle d-flex align-items-center justify-content-center  ${isReceiving ? "text-success  bg-success" : isOwing ? "text-danger  bg-danger" : "text-secondary bg-success"}`} style={{  width: "65px",height: "65px",flexShrink: 0,}}>
                    {isReceiving ? (
                      <TrendingUp size={28} color="white" />
                    ) : isOwing ? (
                      <TrendingDown size={28} color="white" />
                    ) : (
                      <CheckCircle size={28} color="white" />
                    )}
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">My Net Balance</h5>
                    <h2 className={`fw-bold mb-0 ${isReceiving ? "text-success" : isOwing ? "text-danger" : "text-secondary"}`}>
                      {isReceiving ? "+" : ""}
                      {formatCurrency(myNetBalance)}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 border-md-start">
                <div className="ps-md-4">
                  <h5 className="fw-bold mb-1">
                    {isReceiving ? "You should receive" : isOwing ? "You need to pay" : "You are settled"}
                  </h5>

                  <h3 className={`fw-bold mb-0 ${isReceiving ? "text-success" : isOwing ? "text-danger" : "text-secondary"}`}>
                    {formatCurrency(Math.abs(myNetBalance))}
                  </h3>
                </div>
              </div>

            </div>
          </div>
        </section>



         <section className="mb-4">
            <div className="row g-3">

              <div className="col-12 col-lg-6">
                <MemberBalanceCard
                  members={membersWhoWillGetBack}
                  type="receive"
                  
                />
              </div>

              <div className="col-12 col-lg-6">
                <MemberBalanceCard
                  members={membersWhoNeedToPay}
                  type="pay"
                />
              </div>

            </div>
        </section>



         <section className="card border-0 shadow-sm mb-4">
          <div className="card-body py-3">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <CheckCircle className="text-success" size={22} />

              <h6 className="fw-bold mb-0">Settled Members</h6>

              <span className="text-secondary small">
                {settledMembers.length === 0  ? "None at the moment" : `${settledMembers.length} members settled`}
       
              </span>
            </div>
          </div>
        </section>

                    



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
                            {member.balance > 0  ? "Should Receive"  : member.balance < 0 ? "Needs to Pay"  : "Settled" }      
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
