// import { Card } from "./common/Card";



// function MemberBalanceCard({members, type})
// {

//     const isReceiver = type === "receive";

//      return (        


    // <div className={`card border-0 shadow-sm h-100 ${isReceiver ? "border-start border-success border-3" : "border-start border-danger border-3"}`}>
    //   <div className={`card-header border-0 py-3 ${isReceiver ? "bg-success-subtle" : "bg-danger-subtle"}`}>
    //     <div className="d-flex align-items-center gap-2">
    //       {isReceiver ? (
    //         <TrendingDown className="text-success" size={23} />
    //       ) : (
    //         <TrendingUp className="text-danger" size={23} />
    //       )}

    //       <div>
    //         <h6 className="fw-bold mb-0">
    //           {isReceiver ? "Members Who Should Receive" : "Members Who Need to Pay"}
    //         </h6>
    //         <small className="text-secondary">
    //           {isReceiver
    //             ? "Paid more than their share"
    //             : "Paid less than their share"}
    //         </small>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="card-body p-0">
    //     {members.length === 0 ? (
    //       <p className="text-secondary text-center py-4 mb-0">
    //         No members available.
    //       </p>
    //     ) : (
    //       members.map((member) => (
    //         <div
    //           key={member.memberId}
    //           className="d-flex align-items-center justify-content-between gap-2 p-3 border-bottom"
    //         >
    //           <div className="d-flex align-items-center gap-2 min-w-0">
    //             <div className="member-avatar">
    //               {member.memberName?.charAt(0).toUpperCase()}
    //             </div>

    //             <div className="min-w-0">
    //               <div className="fw-semibold text-truncate">
    //                 {member.memberName}
    //               </div>
    //               <small className="text-secondary">
    //                 Paid: {formatCurrency(member.totalPaid)}
    //                 {" "} | Share: {formatCurrency(member.totalShare)}
    //               </small>
    //             </div>
    //           </div>

    //           <span className={`fw-bold text-nowrap ${isReceiver ? "text-success" : "text-danger"}`}>
    //             {isReceiver ? "+" : ""}
    //             {formatCurrency(member.netBalance)}
    //           </span>
    //         </div>
    //       ))
    //     )}
    //   </div>
    // </div>
//   );
// }

import {TrendingDown,TrendingUp} from "lucide-react"
import Card from "./common/Card";
import {formatCurrency} from "../util/formatCurrency";


export default function MemberBalanceCard({ type, members=[] }) 
{

    const isReceiver = type === "receive";

  const style = isReceiver
    ? {
        border: "border-success",
        headerBg: "bg-success-subtle",
        text: "text-success",
        icon: <TrendingDown className="text-success" size={23} />,
        title: "Members Who Should Receive",
        subtitle: "Paid more than their share",
        prefix: "+",
      }
    : {
        border: "border-danger",
        headerBg: "bg-danger-subtle",
        text: "text-danger",
        icon: <TrendingUp className="text-danger" size={23} />,
        title: "Members Who Need to Pay",
        subtitle: "Paid less than their share",
        prefix: "",
      };

  return (
    <Card  className={`h-100 border-start border-3 ${style.border}`} headerClassName={style.headerBg}  bodyClassName="p-0"
      header={
        <div className="d-flex align-items-center gap-2">
          {style.icon}
          <div>
            <h6 className="fw-bold mb-0">{style.title}</h6>
            <small className="text-secondary">{style.subtitle}</small>
          </div>
        </div>
      } >


        <div  className="d-flex align-items-center justify-content-between gap-2 p-3 border-bottom" >

            <div className={`card border-0 shadow-sm h-100 ${isReceiver ? "border-start border-success border-3" : "border-start border-danger border-3"}`}>
            <div className={`card-header border-0 py-3 ${isReceiver ? "bg-success-subtle" : "bg-danger-subtle"}`}>
                <div className="d-flex  gap-2 mx-2 ">
                   
                   <div className="bg-white d-flex align-items-center rounded-circle  justify-content-center flex-shrink-0" style={{ width: "38px", height: "38px" }}>
                        {isReceiver ? (
                            <TrendingDown className="text-success" size={23} />
                        ) : (
                            <TrendingUp className="text-danger" size={23} />
                        )}
                   </div>


                    <div> 
                        <h6 className="fw-bold mb-0 mx-4">
                        {isReceiver ? "Members Who Should Receive" : "Members Who Need to Pay"}
                        </h6>
                        <small className="text-secondary mx-4">
                        {isReceiver ? "Paid more than their share" : "Paid less than their share"}
                            
                        </small>
                    </div>
               
                </div>
            </div> 
                    
                    {members.length === 0 ? (
                        <p className="text-secondary text-center py-4 mb-0">
                        No members available.
                        </p>
                    ) : ( members.map((member) => (
                        

                    <div className="d-flex align-items-center mt-2 gap-2 min-w-0 mx-3 my-3">
                        <div className="rounded-circle  bg-secondary-subtle text-secondary fw-semibold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "38px", height: "38px" }}>
                            {member.memberName?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 gap-3">
                            <div className="fw-semibold text-truncate">
                                {member.memberName}
                            </div>
                            <small className="text-secondary">
                                Paid: {formatCurrency(member.totalPaid)}
                                {" "} | Share: {formatCurrency(member.totalShare)}
                            </small>
                        </div>

                        <div className="min-w-0 mx-5 ">
                             <span className={`fw-bold text-nowrap ${isReceiver ? "text-success" : "text-danger"}`}>
                        {isReceiver ? "+" : ""}
                        {formatCurrency(member.netBalance)}
                    </span>
                        </div>

                    </div>

                   

      
            
        ))
      )}

      
                    </div>
                    </div>
               
             
            
    </Card>
  );
}
