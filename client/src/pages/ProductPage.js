import {Badge, Button, Card, Col, Container, Image, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {fetchOneProduct} from "../http/productAPI";
import {useParams} from "react-router-dom";
import {addProductToBasket} from "../http/basketAPI"

const ProductPage = () => {
    const [product, setProduct] = useState({
        info: [],
        product_imgs: []
    });

    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const {id} = useParams();

    const handleAddToBasket = async() => {
        try{
            await addProductToBasket(product.id, 1);
            alert('Product added to basket successfully.');
        }catch(e){
            alert(e.response.message || "Failed to add a product")
        }
    }

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError("");
        setActiveImage(0);
        setProduct(null);

        fetchOneProduct(id)
            .then(data => {
                if (!cancelled) {
                    if (!data) {
                        setError("Product not found");
                    } else {
                        setProduct(data);
                    }
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Failed to load product");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);



    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <p className="text-danger">{error}</p>
            </Container>
        );
    }

    const images = product.product_imgs || [];
    const characteristics = product.info || [];
    const selectedImage = images[activeImage];

    const inStock = Number(product.stock) > 0;

    return (
        <Container className="py-4">

            {/* Product title */}
            <div className="mb-4">
                <div className="text-secondary small mb-2">
                    Home / Products / {product.name}
                </div>

                <h2 className="fw-semibold mb-0">
                    {product.name}
                </h2>
            </div>

            <Row className="g-4">

                {/* Product gallery */}
                <Col lg={7}>
                    <div
                        className="d-flex align-items-center justify-content-center rounded-4 p-4"
                        style={{
                            height: 460,
                            backgroundColor: "#f8f9fa"
                        }}
                    >
                        {selectedImage ? (
                            <Image
                                src={
                                    process.env.REACT_APP_API_URL +
                                    selectedImage.img
                                }
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain"
                                }}
                            />
                        ) : (
                            <span className="text-secondary">
                                No image available
                            </span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="d-flex gap-2 flex-wrap mt-3">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                onClick={() => setActiveImage(index)}
                                className="rounded-3 p-2"
                                style={{
                                    width: 78,
                                    height: 78,
                                    cursor: "pointer",
                                    backgroundColor: "#f8f9fa",
                                    border: activeImage === index
                                        ? "2px solid #212529"
                                        : "1px solid #dee2e6"
                                }}
                            >
                                <Image
                                    src={
                                        process.env.REACT_APP_API_URL +
                                        image.img
                                    }
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain"
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Product details */}
                <Col lg={5}>
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Body className="p-4">

                            <div className="text-secondary small mb-2">
                                Price
                            </div>

                            <h2 className="fw-bold mb-3">
                                {product.price} PLN
                            </h2>

                            <div className="mb-4">
                                <Badge
                                    bg={inStock ? "success" : "secondary"}
                                    className="px-3 py-2"
                                >
                                    {inStock
                                        ? `In stock (${product.stock})`
                                        : "Out of stock"}
                                </Badge>
                            </div>

                            <Button
                                variant="dark"
                                size="lg"
                                className="w-100 rounded-3 py-3"
                                disabled={!inStock}
                                onClick={handleAddToBasket}
                            >
                                Add to basket
                            </Button>

                            <hr className="my-4" />

                            <h5 className="fw-semibold mb-3">
                                Key specifications
                            </h5>

                            {characteristics.length > 0 ? (
                                characteristics.slice(0, 4).map(info => (
                                    <div
                                        key={info.id}
                                        className="d-flex justify-content-between gap-3 py-2 border-bottom"
                                    >
                                        <span className="text-secondary">
                                            {info.title}
                                        </span>

                                        <span className="fw-medium text-end">
                                            {info.description}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-secondary small">
                                    No specifications available
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Full specifications */}
            <section className="mt-5">
                <h3 className="fw-semibold mb-4">
                    Product specifications
                </h3>

                <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body className="p-4">
                        {characteristics.length > 0 ? (
                            characteristics.map((info, index) => (
                                <Row
                                    key={info.id}
                                    className="py-3 mx-0 rounded-2"
                                    style={{
                                        backgroundColor:
                                            index % 2 === 0
                                                ? "#f8f9fa"
                                                : "white"
                                    }}
                                >
                                    <Col sm={5} className="text-secondary">
                                        {info.title}
                                    </Col>

                                    <Col sm={7} className="fw-medium">
                                        {info.description}
                                    </Col>
                                </Row>
                            ))
                        ) : (
                            <p className="text-secondary mb-0">
                                No specifications available
                            </p>
                        )}
                    </Card.Body>
                </Card>
            </section>
        </Container>
    );
};

export default ProductPage;
