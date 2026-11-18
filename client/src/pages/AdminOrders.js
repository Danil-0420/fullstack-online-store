import React, {useEffect, useState} from 'react';
import {fetchAllOrders} from "../http/orderAPI";
import {Badge, Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const AdminOrders = () => {

    const navigate = useNavigate();
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchAllOrders().then((data) => {
            setLoading(true)
            setOrders(data)
        }).catch(() => {setError("Failed to fetch orders!")}).finally(()=>{
            setLoading(false)
        })
    },[orders])

    return (
        <Container>
            {error &&
            <div className='alert-danger'>{error}</div>
            }
            {!loading && !error && orders.length === 0 && (
                <div className='alert-warning'>There are no orders in the system</div>
            )}
            <Row className="d-flex justify-content-center align-items-center mb-4 fw-bold fs-5">
                <Col md={2}>Order</Col>
                <Col md={2}>Customer</Col>
                <Col md={2}>Status</Col>
                <Col md={2}>Total</Col>
                <Col md={4}>Details</Col>
            </Row>
            {orders.map(order => (
                <Row className="border rounded-4 mb-5 p-3" key={order.id}>
                    <Col md={2}>{order.id}</Col>
                    <Col md={2}>{order.first_name} {order.last_name}</Col>
                    <Col md={2}>
                        <Badge bg={
                            order.status === "Delivered" ? "success" :
                                order.status === "Cancelled" ? "danger" :
                                    order.status === "Shipped" ? "info" :
                                        order.status === "Processing" ? "primary" :
                                            "warning"
                        } text={order.status === "Created" ? "dark" : undefined}>
                            {order.status}
                        </Badge>
                    </Col>
                    <Col md={2}>{order.total_price}</Col>
                    <Col md={4}>

                        <Button onClick={()=> {
                            navigate(`/admin/orders/${order.id}`)
                        }}
                        >
                            View Details
                        </Button>
                    </Col>
                </Row>
            ))}
        </Container>
    );
};

export default AdminOrders;