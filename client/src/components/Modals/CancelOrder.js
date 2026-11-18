
import {Button, Modal} from "react-bootstrap";


const CancelOrder = ({onConfirm, show, onHide, loading}) => {

    return (
        <Modal
        show={show}
        onHide={onHide}
        centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Cancel order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>Are you sure you want to cancel this order? This action cannot be undone.</div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide} variant='dark'>Keep order</Button>
                <Button onClick={onConfirm} disabled={loading} variant='danger'>{loading ? "Cancelling..." : "Cancel order"}</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default CancelOrder;