import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import FormInput from "./common/FormInput";

export default function EditGroupModal({show,group, onClose, onUpdate, loading = false, validateGroup})
{
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});

    
    useEffect(() => {
        if (show && group) {
            setName(group.name || "");
            setDescription(group.description || "");
            setErrors({});
        }
    }, [ group]);

    function handleClose() 
    {
        if (loading) return;

        setErrors({});
        onClose();
    }

    async function handleSubmit(e) 
    {
        e.preventDefault();

        
        const validationErrors = validateGroup({
            name,
            description
        });

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) 
        {
            return;
        }

        const request = {
            name: name.trim(),
            description: description.trim()
        };

        const success = await onUpdate(group.id, request);

        if (success) {
            setErrors({});
            onClose();
        }
    }

    return (
        <Modal  show={show} onHide={handleClose}  centered backdrop={loading ? "static" : true} keyboard={!loading}   >
            <Modal.Header closeButton={!loading}>
                <div>
                    <Modal.Title className="fw-bold">
                        Edit Group
                    </Modal.Title>

                    <small className="text-secondary">
                        Update your group information.
                    </small>
                </div>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
                <Modal.Body className="px-4 py-3">
                    <FormInput
                        label="Group Name"
                        name="name"
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                            setErrors(prev => ({
                                ...prev,
                                name: ""
                            }));
                        }}
                        placeholder="Enter group name"
                        error={errors.name}
                        required
                    />

                    <FormInput
                        label="Description"
                        name="description"
                        inputType="textarea"
                        value={description}
                        onChange={e => {
                            setDescription(e.target.value);
                            setErrors(prev => ({
                                ...prev,
                                description: ""
                            }));
                        }}
                        placeholder="Enter group description"
                        rows={3}
                        error={errors.description}
                        required
                    />
                </Modal.Body>

                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-light px-4"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn text-white px-4"
                        style={{ backgroundColor: "#244B9B" }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}