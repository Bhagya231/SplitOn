
import { TrendingDown, TrendingUp } from "lucide-react";
import Card from "./common/Card";
import { formatCurrency } from "../util/formatCurrency";
import Pic from "../assets/NoM.png"
import Button from "./common/Button";

export default function MemberBalanceCard({ type, members = [], onMemberClick }) {

    const isReceiver = type === "receive";

    const style = isReceiver
        ? {
            headerBg: "bg-success-subtle",
            text: "text-success",
            icon: <TrendingDown size={23} />,
            title: "Members Who Should Receive",
            subtitle: "Paid more than their share",
            prefix: "+"
        }
        : {
            headerBg: "bg-danger-subtle",
            text: "text-danger",
            icon: <TrendingUp size={23} />,
            title: "Members Who Need to Pay",
            subtitle: "Paid less than their share",
            prefix: ""
        };

    return (
        <Card  className={`h-100 border-start border-3 ${ isReceiver ? "border-success" : "border-danger" }`} headerClassName={`${style.headerBg} py-3`}
            bodyClassName="p-0 d-flex flex-column"
            header={
                <div className="d-flex align-items-center mt-1 gap-3">

                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: "40px", height: "40px" }} >
                        <span className={style.text}>
                            {style.icon}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h6 className="fw-bold mb-1">
                            {style.title}
                        </h6>

                        <small className="text-secondary">
                            {style.subtitle}
                        </small>
                    </div>

                </div>
            }
        >

            {members.length === 0 ? (

                    <div className="text-center py-5">

                        <img src={Pic} alt="No Member found"
                                style={{
                                    width: "100%",
                                    maxWidth: "380px",
                                    height: " 100px",
                                    objectFit: "contain"
                                }}
                            />

                            <h6 className="fw-semibold">
                                No available members
                            </h6>


                        </div>


                // <p className="text-secondary text-center py-4 mb-0">
                //     No members available.
                // </p>

            ) : (

            <div style={{height: "260px", overflowY: "auto",overflowX: "hidden"}}>


               { members.map((member) => (

                    // <div key={member.memberId} className="d-flex align-items-center justify-content-between gap-2  px-3 py-3 border-bottom"  >

                        <button type="button" key={member.memberId} onClick={() => onMemberClick(member.memberId)}
                                        className="btn btn-light w-100 text-start border-0 rounded-0 d-flex align-items-center justify-content-between gap-2 px-3 py-3 border-bottom">



                            <div className="d-flex align-items-center gap-2 min-w-0 flex-grow-1">

                                <div  className="rounded-circle bg-primary-subtle text-secondary fw-semibold d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ width: "38px", height: "38px" }}
                                >
                                    {member.memberName?.charAt(0).toUpperCase()}
                                </div>

                                <div className="min-w-0">

                                    <div className="fw-semibold text-truncate">
                                        {member.memberName}
                                    </div>

                                    <small className="text-secondary">
                                        Paid: {formatCurrency(member.totalPaid)}
                                        {" | "}
                                        Share: {formatCurrency(member.totalShare)}
                                    </small>

                                </div>

                            </div>


                            <div className="flex-shrink-0 text-end">

                                <span className={`fw-bold text-nowrap ${style.text}`}>
                                    {style.prefix}
                                    {formatCurrency(member.netBalance)}
                                </span>

                            </div>

                    </button>

                    //  </div>

                ))}
            </div>

            )}


        </Card>
    );
}
