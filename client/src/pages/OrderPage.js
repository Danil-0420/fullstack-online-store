import {useEffect, useState} from "react";
import {fetchUserOrders} from "../http/orderAPI";
import {Button, Card, Col, Container, Row, Spinner, Form, Image, Badge} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const OrdersPage = () => {

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [status, setStatus] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        let cancelled = false;
        setLoading(true)
        setError('')
        fetchUserOrders().then((data) => {
            if(!cancelled){
                if(!Array.isArray(data)){
                    setError("Failed to load orders data")
                }else{
                    setOrders(data)
                }
            }
        }).catch((err) => {
            if(!cancelled){
                setError("Failed to load orders")
            }
        }).finally(()=>{
            if(!cancelled){
                setLoading(false)
            }
        })

        return () => {
            cancelled = true
        }
    }, [])

    if(loading){
        return(
            <Container>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        )
    }

    if(error){
        return(
            <Container>
                <p>An error has appeared: {error}</p>
            </Container>
        )
    }

    if(orders.length === 0){
        return(
            <Container>
                <p>You have not placed any orders yet</p>
            </Container>
        )
    }
    const filteredOrders = orders.filter(order => {
        return !status || order.status === status
    })

    const sortedOrders = [...filteredOrders].sort((a,b) => new Date(b.creation_date) - new Date(a.creation_date))



    return (
        <Container style={{maxWidth: "1100px"}} className="py-4">
            <div>
               <div className="text-muted small mb-2">
                   Home / Orders
               </div>
               <h2>Order history</h2>
            </div>

            <Row className="g-4">
                <Col lg={12}>
                    <Form.Group className="border-0 shadow-sm rounded-4 mb-4">
                        <Form.Label>Choose orders with status you want to see</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All</option>
                            <option value="Created">Created</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </Form.Select>
                    </Form.Group>
                    {sortedOrders.length === 0 && (
                        <p className="text-muted text-center py-4">
                            No orders with this status
                        </p>
                    )}
                    {sortedOrders.map(order => (
                        <Card
                            key={order.id}
                            className="mb-4 border-0 shadow-sm rounded-4"
                        >
                            <Card.Body className="p-4">


                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h5 className="fw-semibold mb-1">
                                            Order #{order.id}
                                        </h5>
                                        <small className="text-muted">
                                            {new Date(order.creation_date).toLocaleString("pl-PL")}
                                        </small>
                                    </div>

                                    <Badge bg={
                                        order.status === "Delivered" ? "success" :
                                            order.status === "Cancelled" ? "danger" :
                                                order.status === "Shipped" ? "info" :
                                                    order.status === "Processing" ? "primary" :
                                                        "warning"
                                    } text={order.status === "Created" ? "dark" : undefined}>
                                        {order.status}
                                    </Badge>
                                </div>


                                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                                    {order.order_items?.slice(0, 3).map(item => {
                                        const image = item.product?.product_imgs?.[0]?.img;

                                        return image && (
                                            <div
                                                key={item.id}
                                                className="border rounded-3 p-2 d-flex align-items-center justify-content-center"
                                                style={{width: "110px", height: "110px"}}
                                            >
                                                <Image
                                                    src={process.env.REACT_APP_API_URL + image}
                                                    alt={item.product?.name || "Product"}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain"
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}

                                    {order.order_items?.length > 3 && (
                                        <div className="text-muted small">
                                            +{order.order_items.length - 3} more
                                        </div>
                                    )}
                                </div>


                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 border-top pt-3">
                                    <div>
                                        <small className="text-muted d-block mb-1">
                                            Total amount
                                        </small>
                                        <h5 className="fw-semibold mb-0">
                                            {Number(order.total_price).toLocaleString("pl-PL", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })} PLN
                                        </h5>
                                    </div>

                                    <Button
                                        variant="dark"
                                        className="px-4 py-2"
                                        onClick={() => navigate(`/order/${order.id}`)}
                                    >
                                        View details
                                    </Button>
                                </div>

                            </Card.Body>
                        </Card>
                    ))}


                </Col>
            </Row>
        </Container>
    )
}

export default OrdersPage