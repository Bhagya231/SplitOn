
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

export default function ToastMessage({
    show,
    message,
    type = "success",
    onClose
}) {
    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast
                show={show}
                onClose={onClose}
                delay={3000}
                autohide
                bg={type}
            >
                {/* <Toast.Header>
                    <strong className="me-auto">
                        {type === "success" ? "Success" : "Error"}
                    </strong>
                </Toast.Header> */}

                <Toast.Body className="text-white">
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}
