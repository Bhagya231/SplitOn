
import Button from './Button';
import { Modal } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react'; 

function DeleteConfirm({show, title = "Confirm delete ", itemName,message,onCancel,onConfirm,loading = false,})
{
    if (!show)
    {
        return null;
    }

    

    return (
        <Modal
            show={show}
            onHide={loading ? undefined : onCancel}
            centered
            backdrop={loading ? 'static' : true}
            keyboard={!loading}
            aria-labelledby="delete-modal-title">

            <Modal.Header closeButton={!loading}>
                <Modal.Title id="delete-modal-title">
                    {title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center px-4 py-4">
                <div className="mb-3">
                    <AlertTriangle
                        size={48}
                        className="text-danger"
                    />
                </div>

                <h6 className="fw-semibold mb-2">
                    Are you sure?
                </h6>

                <p className="text-muted mb-2">
                    {message || 'Are you sure you want to delete?'}
                </p>

                {itemName && (
                    <p className="fw-semibold mb-0">
                        {itemName}
                    </p>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
 

                <Button type="button" variant="danger" onClick={onConfirm} loading={loading}  disabled={loading}>Delete</Button>

            </Modal.Footer>
        </Modal>
    );


}


export default DeleteConfirm;