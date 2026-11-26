
import { useState, useRef,useEffect } from "react";
import { Card } from "react-bootstrap";
import { Users,UserRound,MoreVertical,Plus,ChevronRight } from "lucide-react";
import Button from "../components/common/Button";

export default function GroupMembers({members = [],  onAddMember, onRemoveMember })
 {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);


    useEffect(() => {
        function handleOutsideClick(event)
        {
            if (menuRef.current && !menuRef.current.contains(event.target))
            {
                setActiveMenu(false);
            }

        }

            if (activeMenu) 
            {
                document.addEventListener("mousedown", handleOutsideClick);
            }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };

        }, [activeMenu]);


     function formatAmount(value)
    {
        return Number(value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2,});
    }

    function getInitials(name = "") 
    {
        return name.split(" ").filter(Boolean).map(part => part[0]).join("").slice(0, 2).toUpperCase();
    }

    const memberCount = members?.length ?? 0;

    return (
        <section className="bg-white rounded-4 shadow-sm p-3 p-md-4">

            
            <div className="d-flex align-items-center justify-content-between gap-2 mb-4">

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

                <Button className="btn btn-primary px-3 d-inline-flex align-items-center gap-2" onClick={onAddMember}>
                    <Plus size={18} />
                    <span className="d-none d-sm-inline">Add Member</span>
                    
                </Button>
            </div>

            
           

           
            <div className="row g-3 d-none d-md-flex">
                {members.map((member) => {
                    const memberId = member.memberId;
                    const balance = Number(member.balance || 0);
                    const share = Number(member.totalShare || 0);
                    const name = member.memberName || "Unknown Member";

                    
                    return (
                        <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-2" key={memberId}>
                            <Card className="border rounded-4 h-100 position-relative">
                                <Card.Body className="p-3 text-center">

                                   
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <Button type="button" className="btn btn-sm btn-light rounded-circle border-0 "
                                            onClick={() => setActiveMenu(  activeMenu === memberId ? null : memberId)}>
                                            <MoreVertical size={19} />
                                        </Button>

                                        {activeMenu === memberId && (                                           

                                            <div ref={menuRef}  data-no-card-navigation className="position-absolute  end-0 mt-2 bg-white rounded-3 shadow border py-2"
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

                                    

                                    <p className="small mb-2">
                                        Paid: <strong>{formatAmount(member.paidAmount)}</strong>
                                    </p>

                                    <hr className="my-2" />

                                    <p className="small mb-1 text-start ">
                                        Share:{" "}
                                        <span className={`badge rounded-pill ${share >= 0  ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger" }`}>
                                               
                                            {share > 0 ? `${formatAmount(share)}` : share === 0 ? `${formatAmount(share)}` :  `-${formatAmount(Math.abs(share))}` }
                                            
                                        </span>
                                    </p>

                                    <p className="small mb-0 text-start">
                                        Net Balance:{" "}
                                        <span className={`badge rounded-pill text-end ${balance >= 0  ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger" }`}>
                                               
                                            {balance > 0 ? `${formatAmount(balance)}` : balance === 0 ? `${formatAmount(balance)}` :  `-${formatAmount(Math.abs(balance))}` }
                                            
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

            
            <div className="d-md-none">
                <div className="d-flex flex-column gap-3">

                    {members.map((member) => {
                        const memberId = member.memberId;
                        const balance = Number(member.totalShare || 0);
                        const name = member.memberName || "Unknown Member";

                        return (
                            <Card key={memberId} className="border rounded-4" >
                                <Card.Body className="p-3">

                                    <div className="d-flex align-items-center gap-3">

                                        
                                        <div  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{ width: 52, height: 52 }}>
                                            <span className="fw-bold fs-5">
                                                {getInitials(name) || <UserRound size={24} />}
                                            </span>
                                        </div>

                                       
                                        <div className="flex-grow-1 overflow-hidden">

                                            <h6 className="fw-bold mb-1 text-truncate">
                                                {name}
                                            </h6>

                                            <small className="text-secondary text-truncate d-block">
                                                {member.email || ""}
                                            </small>

                                        </div>

                                       
                                        <div className="position-relative flex-shrink-0">

                                            <Button   className="btn btn-sm btn-light rounded-circle border-0"
                                                onClick={() => setActiveMenu(activeMenu === memberId ? null : memberId)} >
                                                <MoreVertical size={19} />
                                            </Button>

                                            {activeMenu === memberId && (
                                                <div  className="position-absolute end-0 mt-2 bg-white rounded-3 shadow border py-2"  style={{ width: "160px", zIndex: 10 }} >
                                                    <Button variant="light" className="btn btn-sm w-100 text-start btn-outline-danger px-3 py-2 border-0 rounded-0" 
                                                        onClick={() => { setActiveMenu(null); onRemoveMember?.(member); }}>
                                                        <i className="bi bi-trash me-2" />
                                                        Delete Member
                                                    </Button>
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <hr className="my-2" />

                                    <div className="d-flex align-items-center gap-5">

                                        <p className="small mb-0 mx-2">
                                            Paid: <strong>{formatAmount(member.paidAmount)}</strong>
                                        </p>

                                        <p className="small  mb-0">
                                            Share:{" "}
                                            <span className={`badge rounded-pill ${balance >= 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger" }`}>
                                                {balance   }
                                            </span>
                                        </p>

                                    </div>

                                    
                                    <div className="d-flex justify-content-center mt-3">
                                <Button variant="light" className="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                                            onClick={() => handleViewMember(member)}  >
                                            View Details
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>

                                </Card.Body>
                            </Card>
                        );
                    })}

                    {members.length === 0 && (
                        <div className="text-center text-secondary py-4">
                            No members found in this group.
                        </div>
                    )}

                </div>
            </div>

        </section>
    );
}
