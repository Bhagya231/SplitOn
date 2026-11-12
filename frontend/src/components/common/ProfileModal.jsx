import { Modal, Button, Badge } from "react-bootstrap";

import { Mail,CalendarDays, Clock, ShieldCheck} from "lucide-react";

export default function ProfileModal({ show, onClose, member }) 
{

    if (!member) return null;

    const memberInitial = member.name?.charAt(0).toUpperCase() || "U";

    function formatDate(date) 
    {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
    }

    return (
        <Modal  show={show}  onHide={onClose}  centered size="md" backdrop="static" contentClassName="border-0 rounded-4 overflow-hidden shadow">           

           
            <div className=" text-white text-center p-4 position-relative" style={{ backgroundColor: "#062169" }}>

                <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" onClick={onClose}/>

                <div  className="rounded-circle bg-primary border border-3 border-light  d-flex align-items-center justify-content-center  mx-auto mb-3 fw-bold shadow"
                    style={{  width: "85px", height: "85px",fontSize: "32px"}}>
 
                    {memberInitial}
                </div>

                <h4 className="fw-bold mb-1">
                    {member.name}
                </h4>

                <Badge bg="primary" className="px-3 py-2 rounded-pill">
                    <ShieldCheck size={14} className="me-1" />
                    {member.role || "MEMBER"}
                </Badge>

                <p className="text-white-50 small mt-2 mb-0">
                    Your SplitExpense account
                </p>

            </div>

           
            <Modal.Body className="p-4 bg-light">

                <h6 className="fw-bold text-secondary mb-3">
                    PERSONAL INFORMATION
                </h6>

            
                <div className="bg-white rounded-3 border p-3 mb-3">

                    <div className="d-flex align-items-center gap-3">

                        <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3">
                            <Mail size={21} />
                        </div>

                        <div className="flex-grow-1">
                            <small className="text-muted">
                                Email Address
                            </small>

                            <p className="fw-semibold mb-0 text-break">
                                {member.email || "-"}
                            </p>
                        </div>

                    </div>

                </div>

                <h6 className="fw-bold text-secondary mb-3 mt-4">
                    ACCOUNT INFORMATION
                </h6>

                <div className="row g-3">

                    
                    <div className="col-6">

                        <div className="bg-white border rounded-3 p-3 h-100">

                            <CalendarDays size={20} className="text-primary mb-2"/>

                            <small className="text-muted d-block">
                                Created On
                            </small>

                            <span className="fw-semibold small">
                                {formatDate(member.createdAt)}
                            </span>

                        </div>

                    </div>

                
                    <div className="col-6">

                        <div className="bg-white border rounded-3 p-3 h-100">

                            <Clock size={20} className="text-primary mb-2"/>
  
                            <small className="text-muted d-block">
                                Last Updated
                            </small>

                            <span className="fw-semibold small">
                                {formatDate(member.updatedAt)}
                            </span>

                        </div>

                    </div>

                </div>

            </Modal.Body>

            <Modal.Footer className="bg-white border-0 px-4 pb-4">

                <Button  variant="primary" className="rounded-3 px-4 w-100 fw-semibold" onClick={onClose} >
                    Close
                </Button>

            </Modal.Footer>

        </Modal>
    );
}