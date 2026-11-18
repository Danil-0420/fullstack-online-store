import {Toast, ToastContainer} from "react-bootstrap";


const NotificationToast = ({show, onClose, title, message, variant="success", delay= 4000}) => {
    return (
        <ToastContainer
            position="bottom-end"
            className="p-3"
            style={{position: "fixed", zIndex: 1055}}
        >
            <Toast
                show={show}
                onClose={onClose}
                delay={delay}
                autohide
                bg={variant}
            >
                <Toast.Header>
                    <strong className="me-auto">{title}</strong>
                </Toast.Header>
                <Toast.Body
                    className={
                        ["warning", "light", "info"].includes(variant)
                            ? "text-dark"
                            : "text-white"
                    }
                >
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default NotificationToast;