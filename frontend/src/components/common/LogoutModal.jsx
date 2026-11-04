import { LogOut, X, ShieldAlert } from "lucide-react";
import Button from "./Button";

function LogoutModal({ show , onCancel, onConfirm,loading = false})
{
    if(!show)
    {
        return null;
    }

    return (
        <>

        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true"
                aria-labelledby="logoutModalTitle" style={{ zIndex: 1055 }}>
            
            <div  className="modal-dialog modal-dialog-centered">

                <div className="modal-content border-0 rounded-4 shadow-lg  overflow-hidden" >

                    <div className="modal-header   px-4 pt-4">
                        <h5 className="modal-title small text-uppercase" id="logoutModalTitle">
                            Confirm Logout
                        </h5>

                        <Button type="button"  className="btn-close btn-light rounded-circle" onClick={onCancel} disabled={loading} aria-label="Close">
                            
                        </Button>


                    </div>

                    <div className="modal-body text-center py-4 pb-4">

                        <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "76px", height: "76px" }}>
                            <LogOut size={34} className="text-danger" />
                        </div>


                        <p className="mt-3 mb-1 fw-semibold">Are you sure you want to log out?</p>
                        <p className="text-muted small mb-0">You will need to log in again to access your account.</p>

                             <div className="d-flex align-items-center justify-content-center gap-2 mt-3 small text-muted">
                                <ShieldAlert size={15} />
                                <span>Your account session will end.</span>
                            </div>

                        
                    </div>

               

                <div className="modal-footer border-0 bg-light px-4 py-3 gap-2">
                    <Button type="button" className="flex-fill" variant="secondary" onClick={onCancel} disabled={loading} >Cancel</Button>

                    
                    <Button type="button" className="flex-fill" variant="danger" onClick={onConfirm} loading={loading} disabled={loading}>Logout</Button>

                </div>

                </div>
               

            </div>

        </div>

        <div className="modal-backdrop fade show"  />
        </>
    )
}


export default LogoutModal;