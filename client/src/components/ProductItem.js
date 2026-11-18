import { Card, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from "../utils/const";
import star from "../assets/star.png";


const ProductItem = ({ product }) => {

    const navigate = useNavigate();

    return (
        <Col md={3} className="mt-3 d-flex">
            <Card
                className="w-100 h-100 p-2"
                style={{ cursor: "pointer" }}
                border="light"
                onClick={() => navigate(`${PRODUCT_ROUTE}/${product.id}`)}
            >
                <Image
                    style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "contain"
                    }}
                    src={
                        product.product_imgs?.[0]?.img
                            ? process.env.REACT_APP_API_URL + product.product_imgs[0].img
                            : undefined
                    }
                />

                <div className="d-flex justify-content-between align-items-center mt-2 text-black-50">
                    <div className="d-flex align-items-center gap-1">
                        <span>{product.rating}</span>
                        <Image width={15} height={15} src={star} />
                    </div>
                </div>

                <div
                    className="mt-2"
                    style={{
                        minHeight: "48px",
                        fontSize: "14px"
                    }}
                >
                    {product.name}
                </div>

                <div className="mt-auto fw-bold">
                    {product.price} PLN
                </div>
            </Card>
        </Col>
    );
};

export default ProductItem;