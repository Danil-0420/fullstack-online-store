import {Button, Container, Form, Row, Col, Card} from "react-bootstrap";
import {useEffect, useState} from "react";

import {getBasket} from "../http/basketAPI";
import {createOrder} from "../http/orderAPI";
import {useNavigate} from "react-router-dom";
import {ORDER_ROUTE} from "../utils/const";

const deliveryPrices = {
    Inpost: {
        Parcel: 15.99,
        Courier: 19.99
    },
    DHL: {
        Courier: 24.99
    },
    "Poczta Polska": {
        Courier: 17.99
    }
}

const Checkout = () => {

    const navigate = useNavigate()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [deliveryCompany, setDeliveryCompany] = useState('')
    const [deliveryMethod, setDeliveryMethod] = useState('')
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        getBasket().then(data => {setProducts(data.basket.basket_items)}).
        catch(() => {setError("Failed to load basket")}).
        finally(() => {setLoading(false)})
    }, [])


    const subtotal = products.reduce((total, item) => {
        return total + Number(item.basketProduct.price) * item.quantity
    }, 0)

    const deliveryPrice = deliveryPrices?.[deliveryCompany]?.[deliveryMethod] ?? 0

    const totalPrice = subtotal + deliveryPrice


    const handleSubmit = async (e) =>{
            e.preventDefault()
            const orderData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                company_name: deliveryCompany,
                delivery_method: deliveryMethod,
                delivery_address: deliveryAddress,
                payment_method: paymentMethod
            }
            setSubmitting(true)

            try{
                const data = await createOrder(orderData)

                navigate(`/order/ ${data.order.id}`, {
                    state: {
                        orderCreated: true
                    }
                })

            }catch(error){
                console.log("Failed to create order", error)
            }finally {
                setSubmitting(false)
            }

    }


    return (
        <Container style={{maxWidth: "1100px"}} className="py-4">
            <div className="mb-4">
                <div className="text-muted small mb-2">
                    Home / Basket / Checkout
                </div>
                <h2 className="fw-semibold">Checkout</h2>
                <p className="text-muted">
                    Complete your details to place your order.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="alert alert-warning">
                    Your basket is empty.
                </div>
            )}

            <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Body className="p-4">
                                <h5 className="mb-4">
                                    Contact information
                                </h5>

                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>First name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="First name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Last name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Last name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control
                                                required
                                                type="email"
                                                placeholder="Email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Phone number</Form.Label>
                                            <Form.Control
                                                required
                                                type="tel"
                                                placeholder="Phone number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Body className="p-4">
                                <h5 className="mb-4">
                                    Delivery information
                                </h5>

                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Delivery company</Form.Label>
                                            <Form.Select
                                                required
                                                value={deliveryCompany}
                                                onChange={(e) => {
                                                    setDeliveryCompany(e.target.value);
                                                    setDeliveryMethod('');
                                                }}
                                            >
                                                <option value="">Choose company</option>
                                                <option value="Inpost">Inpost</option>
                                                <option value="DHL">DHL</option>
                                                <option value="Poczta Polska">Poczta Polska</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Delivery method</Form.Label>
                                            <Form.Select
                                                required
                                                disabled={!deliveryCompany}
                                                value={deliveryMethod}
                                                onChange={(e) => setDeliveryMethod(e.target.value)}
                                            >
                                                <option value="">Choose method</option>
                                                <option value="Courier">Courier</option>
                                                {deliveryCompany === "Inpost" && (
                                                    <option value="Parcel">Parcel</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label>Delivery address</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Street, building, apartment, city, postal code"
                                                value={deliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-4">
                            <Card.Body className="p-4">
                                <h5 className="mb-4">Payment method</h5>

                                <Row className="g-3">
                                    {["Card", "BLIK", "Bank transfer"].map((method) => (
                                        <Col md={4} key={method}>
                                            <label
                                                htmlFor={`payment-${method.replace(/\s+/g, "-")}`}
                                                className="border rounded-3 p-3 w-100 h-100 d-block"
                                                style={{
                                                    cursor: "pointer",
                                                    backgroundColor: paymentMethod === method
                                                        ? "#f5f6f7"
                                                        : "#fff",
                                                    borderColor: paymentMethod === method
                                                        ? "#212529"
                                                        : "#dee2e6"
                                                }}
                                            >
                                                <Form.Check
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id={`payment-${method.replace(/\s+/g, "-")}`}
                                                    label={method}
                                                    value={method}
                                                    required
                                                    checked={paymentMethod === method}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                            </label>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className="border-0 shadow-sm rounded-4">
                            <Card.Body className="p-4">
                                <h5 className="mb-4">Order summary</h5>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Subtotal</span>
                                    <span>{subtotal.toFixed(2)} PLN</span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Delivery</span>
                                    <span>
                                    {deliveryMethod
                                        ? `${deliveryPrice.toFixed(2)} PLN`
                                        : "Not selected"}
                                </span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="fw-semibold">Total</span>
                                    <h4 className="fw-bold mb-0">
                                        {totalPrice.toFixed(2)} PLN
                                    </h4>
                                </div>

                                <Button
                                    variant="dark"
                                    type="submit"
                                    className="w-100 py-3"
                                    disabled={
                                        loading ||
                                        !!error ||
                                        products.length === 0 ||
                                        submitting
                                    }
                                >
                                    {submitting ? "Placing order..." : "Place order"}
                                </Button>

                                <p className="text-muted small text-center mt-3 mb-0">
                                    Review your details before placing the order.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );

}

export default Checkout