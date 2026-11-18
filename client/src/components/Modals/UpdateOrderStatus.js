import React from 'react';
import {Button, Modal, Form} from "react-bootstrap";

const UpdateOrderStatus = ({onConfirm, show, onHide, loading, order, selectedStatus, onStatusChange, changeError}) => {

    const allowedStatuses = {
        Created: ['Processing', 'Cancelled'],
        Processing: ['Shipped', 'Cancelled'],
        Shipped: ['Delivered'],
        Delivered: [],
        Cancelled: []
    }



    return (
        <Modal
        show={show}
        onHide={onHide}
        centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Do you want to change order status?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Current status: {order.status}</Form.Label>
                    {changeError && (
                        <p className='text-danger'>Failed to change order status</p>
                    )}
                    <Form.Select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    >
                        <option value=''>Select status</option>
                        {allowedStatuses[order.status]?.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </Form.Select>


                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Cancel</Button>
                <Button onClick={onConfirm} disabled={loading}>{loading ? "Saving" : "Save"}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateOrderStatus;