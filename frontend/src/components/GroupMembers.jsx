
import { useState } from "react";
import { Card } from "react-bootstrap";
import { Users,UserRound,MoreVertical,Plus,ChevronRight } from "lucide-react";
import Button from "../components/common/Button";

export default function GroupMembers({members = [],  onAddMember, onRemoveMember,onViewAllMembers })
 {
    const [activeMenu, setActiveMenu] = useState(null);

    const formatAmount = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

    function getInitials(name = "") {
        return name.split(" ").filter(Boolean).map(part => part[0]).join("").slice(0, 2).toUpperCase();
    }

    const memberCount = members?.length ?? 0;

    return (
        <section className="bg-white rounded-4 shadow-sm p-3 p-md-4">

            
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">

                <div className="d-flex align-items-center gap-3">
                    <div  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 46, height: 46 }} >
                        <Users size={24} />
                    </div>

                    <div>
                        <h4 className="fw-bold mb-1">Group Members </h4>
                        <p className="text-secondary small mb-0">
                             <strong>{memberCount}</strong> Peoples in this group
                        </p>
                    </div>
                </div>

                <Button  type="button" className="btn btn-primary rounded-pill px-3 d-none d-md-inline-flex align-items-center gap-2" onClick={onAddMember} >
                    <Plus size={18} />
                    Add Member
                </Button>
            </div>

            
            <Button  type="button"  className="btn d-flex d-md-none align-items-center justify-content-between w-100 border rounded-4 p-3 text-start" onClick={onViewAllMembers} >
                <span className="d-flex align-items-center gap-2">
                    <Users size={20} className="text-primary" />
                    <span>
                        <span className="d-block fw-semibold">View Group Members (${})</span>
                        <small className="text-secondary">
                            {members.length} people in this group
                        </small>
                    </span>
                </span>
                <ChevronRight className="text-primary" size={22} />
            </Button>

           
            <div className="row g-3 d-none d-md-flex">
                {members.map((member) => {
                    const memberId = member.memberId;
                    const balance = Number(member.balance || 0);
                    const name = member.memberName || "Unknown Member";

                    
                    return (
                        <div className="col-6 col-sm-3 col-md-3 col-lg-2" key={memberId}>
                            <Card className="border rounded-4 h-100 position-relative">
                                <Card.Body className="p-3 text-center">

                                   
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <Button type="button" className="btn btn-sm btn-light rounded-circle border-0 "
                                            onClick={() => setActiveMenu(  activeMenu === memberId ? null : memberId)}>
                                            <MoreVertical size={19} />
                                        </Button>

                                        {activeMenu === memberId && (                                           

                                            <div className="position-absolute  end-0 mt-2 bg-white rounded-3 shadow border py-2"
                                                    style={{ width: "160px",zIndex: 10,}} onClick={e => e.stopPropagation()} >
                                                    

                                                        <Button variant="light"  className="btn btn-sm w-100 text-start btn-outline-danger px-3 py-2 border-0 rounded-0  group-menu-item"
                                                            onClick={() => { setActiveMenu(null); onRemoveMember?.(member);}}>
                                                            <i className="bi bi-trash me-2" />
                                                            Delete Member
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                  
                                    <div  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto mb-2 overflow-hidden"
                                        style={{ width: 68, height: 68 }}>
                                      
                                        <span className="fw-bold fs-5">
                                            {getInitials(name) || <UserRound size={27} />}
                                        </span>
                                       
                                    </div>

                                    <h6 className="fw-bold mb-1 text-truncate">
                                        {name}
                                    </h6>

                                    <small className="text-secondary d-block text-truncate">
                                        {member.email || ""}
                                    </small>

                                    <hr className="my-2" />

                                    <p className="small mb-2">
                                        Paid: <strong>{formatAmount(member.paidAmount)}</strong>
                                    </p>

                                    <p className="small mb-0">
                                        Share:{" "}
                                        <span className={`badge rounded-pill ${balance >= 0  ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger" }`}>
                                               
                                            {balance > 0 ? `+${formatAmount(balance)}` : balance === 0 ? `${formatAmount(balance)}` :  `-${formatAmount(Math.abs(balance))}` }
                                            
                                        </span>
                                    </p>

                                </Card.Body>
                            </Card>
                        </div>
                    );
                })}

                {members.length === 0 && (
                    <div className="col-12 text-center text-secondary py-4">
                        No members found in this group.
                    </div>
                )}
            </div>

        </section>
    );
}
