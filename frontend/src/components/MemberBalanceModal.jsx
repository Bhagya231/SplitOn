import { X, Wallet, Users, UserRound, TrendingUp, TrendingDown,Handshake, Lightbulb, Mail, Phone, Scale } from "lucide-react";
import { formatCurrency } from "../util/formatCurrency";
import Card from "./common/Card";

function MemberBalanceModal({show, member, onClose})
{

    if(!show || !member)
    {
        return null;
    }

    const owesTo = member.owesTo ?? [];
    const owedBy = member.owedBy ?? [];

    const netBalance = member.netBalance ?? 0;

    const pay = owesTo.reduce((total,value) => total + (value.amount ?? 0), 0);
    const receive = owedBy.reduce((total,value) => total +(value.amount ?? 0), 0);

    const isReceiver = netBalance > 0;
    const isOwing = netBalance < 0;


    const status = isReceiver ? "Can Receive" : isOwing ? "Needs To Pay " : "Settled";
    const initials = member.memberName?.charAt(0).toUpperCase() ?? "U";


    const cards = [
        {
            title: "Total Paid",
            amount: member.totalPaid ?? 0,
            icon: Wallet,
            background: "bg-success-subtle",
            iconBackground: "bg-success bg-opacity-10",
            color: "text-success"
        },
        {
            title: "Your Share",
            amount: member.totalShare ?? 0,
            icon: Users,
            background: "bg-primary-subtle",
            iconBackground: "bg-primary bg-opacity-10",
            color: "text-primary"
        },

        {
            title: "Net Balance",
            amount: netBalance,
            icon: Scale,
            background: "bg-purple-subtle",
            iconBackground: "bg-purple-soft",
            color: "text-purple",
            balance: true
        }
    ];


    return (
    <>

        <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={e => {if (e.target === e.currentTarget) onClose(); }}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", inset: 0,zIndex: 1055, overflowY: "auto"}}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 rounded-4 shadow">

                    {/* <div className="modal-header border-0 pb-0">
                        // <h5 className="modal-title fw-bold">
                        //     Member Balance Details
                        // </h5>

                        <button type="button" className="btn-close" onClick={onClose} />
                    </div> */}


                    <div className="modal-body ">

                        {/* <div className="">
                            <button type="button" className="btn-close" onClick={onClose} />
                        </div> */}

                        {/* <Card className="border-0 shadow-sm rounded-4 position-relative"
                            style={{
                                    background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
                                    border: "1px solid #bae6fd",
                                }}> */}


                                <button type="button" className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center shadow-sm"
                                    style={{ width: 36, height: 36 }} onClick={onClose} aria-label="Close"
                                >
                                    X
                                </button>
                            <div >

                                <div className="d-flex align-items-center gap-3  p-3">

                                    <div  className="rounded-circle bg-primary  text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{ width: 68, height: 68 }}>

                                        <span className="fw-bold fs-5 text-white">
                                            {initials || <UserRound size={27} />}
                                        </span>

                                    </div>

                                    <div className="flex-grow-1 ">

                                        <div className="d-flex align-items-center flex-wrap gap-2 mb-2">

                                            <h2 className="fw-bold mb-0">
                                                {member?.memberName}
                                            </h2>

                                        </div>

                                        <span
                                            className={`badge rounded-pill px-3 py-2 ${isReceiver ? "bg-success-subtle text-success"
                                                : isOwing ? "bg-danger-subtle text-danger" : "bg-secondary-subtle text-secondary" }`}>
                                            {status }
                                        </span>


                                        <div className="d-flex flex-wrap align-items-center gap-3 text-secondary mt-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <Mail size={16} />
                                                <span>{member.email || "No email available"}</span>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <Phone size={16} />
                                                <span>{member.phone || "No phone available"}</span>
                                            </div>
                                        </div>



                                    </div>

                                        {/* <button type="button" className="btn btn-light rounded-circle " onClick={onClose} aria-label="Close">
                                            <X size={20} />
                                        </button> */}


                                </div>

                            </div>
                        {/* </Card> */}

 <hr />


                        <div className="row g-3">
                            {cards.map((item) => {
                                const Icon = item.icon;


                                return (
                                    <div className="col-12 col-md-4" key={item.title}>
                                        <Card className={`border-0 rounded-4 shadow-sm h-100 overflow-hidden ${item.background}`} bodyClassName="p-1 p-md-1 position-relative">

                                            <div className="d-flex  align-items-center gap-2 position-relative " >

                                                <div className={`rounded-circle ${item.iconBackground} ${item.color} d-flex align-items-center justify-content-center flex-shrink-0`}
                                                    style={{ width: 66, height: 66 }}>
                                                    <Icon size={35} strokeWidth={2} />
                                                </div>

                                                <div className="min-w-0 ">
                                                    <p className="mb-0 small fw-medium">
                                                        {item.title}
                                                    </p>

                                                    <h3 className={`fw-bold mb-0 ${item.balance ? (netBalance >= 0 ? "text-success" : "text-danger") : "text-dark"}`}>
                                                        {formatCurrency(item.amount)}
                                                    </h3>

                                                    {item.balance && (
                                                        <span className={`badge rounded-pill  ${netBalance > 0 ? "bg-success-subtle text-success" : netBalance < 0 ? "bg-danger-subtle text-danger" : "bg-secondary-subtle text-secondary"}`}>
                                                            {netBalance > 0 ? " Should Receive" : netBalance < 0 ?  "Needs To Pay" : "Settled"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                    </Card>
                                </div>
                            );
                        })}
                    </div>



                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mt-4">


                        <div className="bg-danger-subtle p-3">
                            <div className="d-flex justify-content-between align-items-center">

                                <div>
                                    <h6 className="fw-bold text-danger mb-1">
                                        <TrendingUp size={19} className="me-2" />
                                        Payments to Make
                                    </h6>

                                    <small className="text-secondary">
                                        {member.memberName} needs to pay these members
                                    </small>
                                </div>

                                <h5 className="fw-bold text-danger mb-0">
                                    {formatCurrency(pay)}
                                </h5>

                            </div>
                        </div>


                            <div className="card-body p-3">

                                    {owesTo.length === 0 ? (

                                        <div className="text-center py-4">
                                            <Handshake size={32} className="text-success mb-2" />

                                            <h6 className="fw-semibold mb-1">
                                                No pending payments
                                            </h6>

                                            <small className="text-secondary">
                                                This member doesn't need to pay anyone.
                                            </small>
                                        </div>

                                    ) : (

                                        <div className="d-flex flex-column gap-3">

                                            {owesTo.map((person) => (

                                                <div key={person.memberId} className="border rounded-3 p-3"  >


                                                    <div className="d-flex align-items-center justify-content-between gap-2">

                                                        <div className="d-flex align-items-center gap-2 min-w-0">

                                                            <div  className="rounded-circle bg-danger-subtle text-danger fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                                                                style={{ width: 44, height: 44 }}
                                                            >
                                                                {person.memberName?.charAt(0).toUpperCase() || "U"}
                                                            </div>

                                                            <div className="min-w-0">

                                                                <div className="fw-bold text-truncate">
                                                                    {person.memberName}
                                                                </div>

                                                                <small className="text-secondary">
                                                                    Payment recipient
                                                                </small>

                                                            </div>
                                                            <div className="min-w-0 ">

                                                                <small className="text-secondary">
                                                                    <Mail size={14} className="me-1" />
                                                                    {person.email || "No email available"}
                                                                </small>

                                                                <small className="text-secondary">
                                                                    <Phone size={14} className="me-1" />
                                                                    {person.phone || "No phone available"}
                                                                </small>

                                                            </div>

                                                        </div>

                                                        <h5 className="fw-bold text-danger mb-0 text-nowrap">
                                                            {formatCurrency(person.amount)}
                                                        </h5>

                                                    </div>


                                                    <div className="mt-3 pt-2 border-top">

                                                        <div className="d-flex align-items-center gap-2 flex-wrap">

                                                            <span className="small fw-semibold">
                                                                {member.memberName}
                                                            </span>

                                                            <TrendingUp
                                                                size={16}
                                                                className="text-danger"
                                                            />

                                                            <span className="small fw-semibold">
                                                                {person.memberName}
                                                            </span>

                                                        </div>

                                                        <small className="text-danger fw-semibold d-block mt-2">
                                                            {member.memberName} needs to pay{" "}
                                                            {person.memberName}{" "}
                                                            {formatCurrency(person.amount)}
                                                        </small>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                                </div>
                            </div>









                    </div>

                </div>
            </div>
        </div>
    </>
);




}


export default MemberBalanceModal;