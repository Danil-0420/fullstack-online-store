import React, {useEffect, useState} from 'react';
import {fetchAdminOrder, updateOrder} from "../http/orderAPI";
import {useNavigate, useParams} from "react-router-dom";
import {Badge, Button, Card, Col, Container, Image, OverlayTrigger, Row, Spinner, Tooltip} from "react-bootstrap";
import {PRODUCT_ROUTE} from "../utils/const";
import info from "../assets/info.png";
import UpdateOrderStatus from "../components/Modals/UpdateOrderStatus";
import NotificationToast from "../components/UI/NotificationToast";
import CancelOrder from "../components/Modals/CancelOrder";


const AdminOneOrderPage = () => {

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const [changeVisible, setChangeVisible] = useState(false);
    const [changeError, setChangeError] = useState(null)
    const [changeLoading, setChangeLoading] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastVisible, setToastVisible] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('')

    const {id} = useParams()

    useEffect(()=> {
        let cancelled = false
        setLoading(true)
        setError("")
        setOrder(null)

        fetchAdminOrder(id).then((data) =>
        {
            if(!cancelled){
                if(!data){
                    setError("Error getting order data")
                }else{
                    setOrder(data)
                }
            }

        }).catch(err => {
            if(!cancelled){
                setError("Error getting order data")
            }
        }).finally(()=>
        {
            if(!cancelled){
                setLoading(false)
            }
        }
        )

        return () => {
            cancelled = true
        }
    }, [id])


    if(error){
        return (
            <Container>
                <p className='text-danger'>{error}</p>
            </Container>
        )
    }

    if(loading){
        return (
            <Container>
                <Spinner animation="border"></Spinner>
            </Container>
        )
    }

    if(!order){
        return (
            <Container>
                <p className="text-warning">Order not found</p>
            </Container>
        )
    }

    const deliveryWebsites = {
        Inpost: {
            website: 'https://inpost.pl/sledzenie-przesylek/'
        },
        DHL: {
            website: 'https://www.dhl.com/pl-pl/home/sledzenie-przesylek.html'
        },
        "Poczta Polska": {
            website: 'https://www.poczta-polska.pl/sledzenie-przesylek/'
        }
    }

    const productsTotal = order.order_items?.reduce((total, item) => {
        return total + Number(item.price) * item.quantity
    }, 0) ?? 0

    const deliveryCompany = order.delivery?.company_name

    const trackingWebsites = deliveryWebsites[deliveryCompany]?.website

    // const updateOrderStatus = async () => {
    //     if(changeLoading) return
    //
    //     try{
    //         setChangeLoading(true)
    //         setChangeError('')
    //
    //         const data = await updateOrder(order.id, selectedStatus)
    //         setOrder((prevOrder) => ({
    //             ...prevOrder,
    //             status: data.status
    //         }))
    //
    //         setChangeVisible(false)
    //
    //         setToastMessage('Order status has been updated successfully.')
    //         setToastVisible(true)
    //
    //     }catch(err){
    //         setChangeError(
    //             err.response?.data?.message || "Failed to update order status"
    //         )
    //     } finally {
    //         setChangeLoading(false)
    //     }
    // }

    return (
        <Container>
            <Row>
                <div>
                    <div className="text-muted small mb-2">
                        Home/orders/order #{order.id}
                    </div>
                    <h4 className='ms-1'>Items ordered & Delivery details</h4>
                </div>
            </Row>
            <Row>
                <Col md={8}>
                    {order.order_items.map(item =>{
                            const image = item.product?.product_imgs?.[0]?.img
                            return (
                                <Card className='border-0 shadow-sm rounded-4 mb-4 p-4' key={item.id}>
                                    <Row className="d-flex justify-content-center align-items-center">
                                        <Col md={3}>{image && <Image src={process.env.REACT_APP_API_URL + image}
                                                                     alt={item.product?.name || "Product"}
                                                                     style={{
                                                                         width: "100px",
                                                                         height: "100px",
                                                                         objectFit: "contain"
                                                                     }} />}</Col>
                                        <Col md={5}>
                                            <div className='fw-semibold mb-1'>{item.product?.name || "Product unavailable"}</div>
                                            <div className='text-muted mb-1'>Qty: {item.quantity}</div>
                                            <div className='text-muted mb-1'>Price for one product: {Number(item.price).toFixed(2)} PLN</div>
                                        </Col>
                                        <Col md={4}>
                                            <Button disabled={!item.product} onClick={(e) => {
                                                if(item.product){
                                                    navigate(`${PRODUCT_ROUTE}/${item.product.id}`)}
                                            }}
                                                    variant="dark">View product details</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        }

                    )}
                    <h4 className='mt-4 mb-3 ms-1'>Delivery details</h4>
                    <Card className="border-0 shadow-sm rounded-4 mb-4 p-4">
                        <Row className='d-flex justify-content-center align-items-center'>
                            <Col className='border-end' md={6}>
                                <div className='mb-2'>Delivery company</div>
                                <div className='mb-2'>Delivery price</div>
                                <div className='mb-2'>Delivery address</div>
                                <div className='mb-2'>Delivery tracking number</div>
                            </Col>

                            <Col md={6}>
                                <div className="d-flex justify-content-end mb-2">{order.delivery.company_name}</div>
                                <div className="d-flex justify-content-end mb-2">{Number(order.delivery.delivery_price).toFixed(2)} PLN</div>
                                <div className="d-flex justify-content-end mb-2">{order.delivery.delivery_address}</div>
                                <div className="d-flex justify-content-end mb-2">
                                    {!order.delivery.tracking_number ?
                                        <div className="d-flex justify-content-end align-items-center">
                                            <div className='me-2'>Not available yet</div>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip>
                                                        The tracking number will be available once your order has been shipped
                                                    </Tooltip>
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 border-0"
                                                    aria-label="Tracking number information"
                                                >
                                                    <Image src={info} width={25} height={25} alt="" />
                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                        :
                                        <div>
                                            {order.delivery.tracking_number}
                                        </div>
                                    }
                                </div>
                            </Col>
                            {trackingWebsites && (
                                <Button
                                    as="a"
                                    href={trackingWebsites}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="dark"
                                    className="mt-4"
                                >
                                    Go to the delivery company website
                                </Button>
                            )}
                        </Row>
                    </Card>
                </Col>
                <Col md={4}>
                    <div className='d-flex justify-content-between align-items-center p-2'>
                        <h4 className='ms-1'>Order summary</h4>
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
                    <Card className="border-0 shadow-sm rounded-4 mb-4 p-4">
                        <Row className='d-flex justify-content-center align-items-center'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex flex-column'>
                                    <div className='mb-1'>Products</div>
                                    <div>Delivery</div>
                                </div>
                                <div>
                                    <div className='mb-1'>{Number(productsTotal).toFixed(2)} PLN</div>
                                    <div>{Number(order.delivery.delivery_price).toFixed(2)} PLN</div>
                                </div>
                            </div>
                            <hr className="mt-3"/>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>Total</div>
                                <div>{Number(order.total_price).toFixed(2)} PLN</div>
                            </div>

                        </Row>
                    </Card>

                    

                    {/*{!["Cancelled", "Delivered"].includes(order.status) && (*/}
                    {/*    <Button variant='danger' onClick={()=>{*/}
                    {/*        setChangeError('')*/}
                    {/*        setChangeVisible(true)*/}
                    {/*    }}>Cancel order</Button>*/}
                    {/*)}*/}
                    {/*<UpdateOrderStatus*/}
                    {/*    onConfirm={updateOrderStatus}*/}
                    {/*    show={changeVisible}*/}
                    {/*    onHide={() => setChangeVisible(false)}*/}
                    {/*    loading={changeLoading}*/}
                    {/*    order={order}*/}
                    {/*    selectedStatus={selectedStatus}*/}
                    {/*    onStatusChange={setSelectedStatus}*/}
                    {/*    changeError={changeError}*/}
                    {/*/>*/}
                </Col>
            </Row>
            {/*<NotificationToast*/}
            {/*    show={toastVisible}*/}
            {/*    onClose={()=> setToastVisible(false)}*/}
            {/*    title="Order status updated"*/}
            {/*    message={toastMessage}*/}
            {/*    variant="success"*/}
            {/*/>*/}
        </Container>
    );
};

export default AdminOneOrderPage;