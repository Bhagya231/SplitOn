
import { useNavigate, useLoaderData , Link} from "react-router-dom";
import { ArrowLeft, Home, ChevronRight, CalendarDays, Users, UserRound,Split,ReceiptText, Pencil,Trash2, } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import bg from "../assets/membersbg.png";
import DeleteConfirm from "../components/common/DeleteModal";
import ToastMessage from "../components/common/ToastMessage";
import  { useState } from "react"
import api from "../util/Api";


function ExpenseDetails()
{
    const navigate = useNavigate();
    const expense = useLoaderData();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState({show: false,message: "",type: "success"});


    const members = expense.splitMembers ?? [];
    const amount = Number(expense.amount) || 0;

    const formattedDate = expense.date ? new Date(expense.date).toLocaleDateString("en-GB", {day: "2-digit",month: "short",year: "numeric",}): "Not specified";

    const groupId = expense.groupId;

   function money(value)
    {
        return Number(value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2,});
    }


     function getMemberShare(member) {
        return Number(member.value) || 0;
    }


    function showToast(message, type = "success") 
    {

        setToast({ show: true, message,type });
        
    }
    
    function getMemberPercentage(member) 
    {
        if (member.percentage != null) 
        {
            return Number(member.percentage);
        }

        return amount > 0 ? (getMemberShare(member) / amount) * 100 : 0;
    }

   
    

    const splitTypeLabel = { EQUAL: "Equal Split", PERCENTAGE: "Percentage",};


     function handleDeleteClick() {
        setShowDeleteModal(true);
    }


   
    function handleCancelDelete() {
        if (!deleting) {
            setShowDeleteModal(false);
        }
    }

     async function handleConfirmDelete()
     {

        try {

            setDeleting(true);

            const response = await api.delete(`/groups/${groupId}/expenses/${expense.id}`);

            setShowDeleteModal(false);

            

             navigate(`/app/groups/${groupId}`, { state: { toast: { message: response?.data?.message || "Expense deleted successfully",  type: "success" } } });

        } catch (error) {

            console.error("Failed to delete expense:", error);
            const errorMessage = error.response?.data?.message || "Failed to delete expense. Please try again."; showToast(errorMessage, "danger");

        } finally {

            setDeleting(false);

        }
    }


       
    return (

         <div  className="container-fluid py-2 px-0"
                    style={{
                        backgroundImage: `url(${bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        minHeight: "100vh"
                    }}
                >
        <div className="container  px-md-4 py-3">


            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

               <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb align-items-center mb-0">

                        <li className="breadcrumb-item">
                            <Link
                                to="/app"
                                className="text-decoration-none text-muted d-inline-flex align-items-center gap-1"
                            >
                                <Home size={16}  />
                                Groups
                            </Link>
                        </li>

                        <li className="d-flex align-items-center mx-1">
                            <ChevronRight size={14} className="text-muted" />
                        </li>

                        <li className="breadcrumb-item">
                             <Link  to={`/app/groups/${groupId}`} className="text-decoration-none breadcrumb-link d-inline-flex align-items-center gap-1">
                                {expense.groupName}
                            </Link>

                        </li>

                        <li className="d-flex align-items-center mx-1">
                            <ChevronRight size={14} className="text-muted" />
                        </li>
                        <li className="breadcrumb-item active text-primary text-truncate">
                            {expense?.title}
                        </li>



                    </ol>
                </nav>

                
            </div>

           
            <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
                
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-secondary bg-opacity-10 text-primary rounded-4 p-3">
                        <ReceiptText size={36} />
                    </div>

                
                    <div>
                        <h2 className="fw-bold mb-1">Expense Details</h2>
                        <p className="text-secondary mb-0">
                            View complete information about this expense
                        </p>
                    </div> 
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2">

                        <Button type="button" variant="primary" onClick={() => navigate(`/app/groups/${groupId}/expenses/${expense.id}/edit`, {state: { expense }, }) }>
                            <Pencil size={18} className="me-2" />
                            <span className="d-none d-sm-inline">Edit Expense</span>
                        </Button>

                        <Button type="button" variant="danger" onClick={handleDeleteClick} >
                            <Trash2 size={18} className="me-2" />
                            <span className="d-none d-sm-inline">Delete Expense</span>
                            
                        </Button>
                </div>
            </div>


           
                
            

            
            <Card className="rounded-4  bg-opacity-10">

                <div className="row align-items-center g-4">
                    <div className="col-md-6">
                        <h3 className="fw-bold mb-2">
                            {expense.title}
                        </h3>

                        {/* <p className="text-secondary mb-3">
                            Expense summary and payment information
                        </p> */}

                        <div className="d-flex align-items-center gap-2">
                            {/* <div className="bg-primary bg-opacity-10  rounded-3 p-3">                               
                                <CalendarDays size={20} />
                            </div> */}
                            
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    <div className="col-md-6 text-md-end">
                        <p className="text-secondary mb-2">
                            Total Amount
                        </p>

                        <h1 className="display-5 fw-bold text-success mb-0">
                            ₹{money(amount)}
                        </h1>
                    </div>
                </div>
                


            </Card>
                    
           

        
            <div className="row g-3 mb-4">

                <div className="col-12 col-sm-6 col-xl-3">
                   <Card className="h-100 rounded-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3">
                                <UserRound size={26} />
                            </div>

                            <div>
                                <p className="text-secondary mb-1">Paid By</p>
                                <h5 className="fw-bold mb-0">
                                    {expense.payerName || "Unknown"}
                                </h5>
                            </div>
                        </div>
                   </Card>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <Card className="h-100 rounded-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-10  text-success rounded-3 p-3"> 
                                <Users size={26} />
                            </div>

                            <div>
                                <p className="text-secondary mb-1">
                                    Participants
                                </p>
                                <h5 className="fw-bold mb-0">
                                    {members.length} Members
                                </h5>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <Card className="h-100 rounded-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-warning bg-opacity-25 text-warning-emphasis rounded-3 p-3">
                                <Split size={26} />
                            </div>

                            <div>
                                <p className="text-secondary mb-1">Split Type</p>
                                <h5 className="fw-bold mb-0">
                                    {splitTypeLabel[expense.splitType] || expense.splitType || "Not specified"}  
                                               
                                </h5>
                            </div>
                        </div>
                    </Card>
                </div>

                 <div className="col-12 col-sm-6 col-xl-3">
                    <Card className="h-100 rounded-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-info bg-opacity-10 text-info rounded-3 p-3">                               
                                <CalendarDays size={26} />
                            </div>

                            <div>
                                <p className="text-secondary mb-1">
                                    Expense Date
                                </p>
                                <h6 className="fw-bold mb-0">
                                    {formattedDate}
                                </h6>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>


            
            <Card title={<span><Users size={23} className="text-primary me-2"/> Participant  </span>} className="rounded-4" >

                {members.length === 0 ? (
                    <div className="text-center text-secondary py-4">
                        No participants found for this expense.
                    </div>
                ) : (
                    <div className="list-group list-group-flush">
                        {members.map((member) => (
                            <div key={member.id} className="list-group-item px-0 py-3">
                                <div className="d-flex align-items-center gap-3">

                                    
                                    <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
  
                                        style={{ width: "48px",height: "48px",}}>
                                            
                                        {member.memberName?.charAt(0)?.toUpperCase() || "?"}    
                                    </div>

                                   
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <h6 className="fw-bold mb-0">
                                                {member.memberName || "Member"}
                                            </h6>

                                            {member.memberId === expense.payerId && (
                                                <span className="badge rounded-pill text-bg-primary">
                                                    Paid by
                                                </span>
                                            )}
                                        </div>

                                        <small className="text-secondary">
                                            {getMemberPercentage(member).toFixed(2)}%
                                            {" of total expense"}
                                        </small>
                                    </div>

                                    <div className="text-end">
                                        <h5 className="fw-bold mb-1">
                                            ₹{money(member.value)}
                                        </h5>

                                        <small className="text-secondary">
                                            Member's share
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

           
            {/* <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mb-4">

             

               
            </div> */}

            <DeleteConfirm
                show={showDeleteModal}
                title="Delete Expense"
                itemName={expense.title}
                message="This expense will be permanently deleted. "
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />

            <ToastMessage
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() =>
                    setToast(prev => ({
                        ...prev,
                        show: false
                    }))
                }
            />


        </div>
        </div>
    );
}

export default ExpenseDetails;
