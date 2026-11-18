import { Button, Col, Row, Image} from "react-bootstrap";


const BasketItem = ({ product, quantity, basketItemId, onIncrease, onDecrease, onDelete}) => {

    const totalPrice = Number(product.price) * quantity;

    return (
        <Row
            className="d-flex align-items-center mb-3"
            style={{ border: "1px solid lightgray", padding: 10 }}
        >
            <Col md={2}>
                <Image
                    width={100}
                    height={100}
                    src={product.product_imgs?.[0] ? process.env.REACT_APP_API_URL + product.product_imgs[0].img : undefined}
                />
            </Col>

            <Col md={6}>
                {product.name}
            </Col>

            <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
            >
                {totalPrice.toFixed(2)}$

                <div className="d-flex align-items-center gap-2 ms-3">
                    <Button variant="outline-dark" size="sm" onClick={() => onDecrease(basketItemId)}>
                        −
                    </Button>

                    <span className="fw-semibold">{quantity}</span>

                    <Button
                        variant="outline-dark"
                        size="sm"
                        disabled={product.stock !== null && quantity >= product.stock}
                        onClick={() => onIncrease(product.id)}
                    >
                        +
                    </Button>
                </div>

                <Button
                    variant="outline-danger"
                    className="ms-2"
                    onClick={()=> onDelete(basketItemId)}
                >
                    Delete
                </Button>
            </Col>
        </Row>
    );
};

export default BasketItem;