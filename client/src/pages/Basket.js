
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import BasketItem from "../components/BasketItem";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getBasket, addProductToBasket, decreaseProductAmount, deleteProductFromBasket} from "../http/basketAPI";
import {CHECKOUT_ROUTE} from "../utils/const";

const Basket = () => {

    const [promoVisible, setPromoVisible] = useState(false);

    const togglePromo = ()=>
    {
        setPromoVisible(prev => !prev);
    }

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleIncrease = async (productId) => {
        try{
            await addProductToBasket(productId, 1);

            const data = await getBasket();
            setProducts(data.basket.basket_items)
        }catch(e){
            alert(e.response?.data?.message || "Failed to increase quantity");
        }
    }

    const handleDecrease = async (basketItemId) => {
        try{
            await decreaseProductAmount(basketItemId);

            const data = await getBasket();
            setProducts(data.basket.basket_items)
        }catch(e){
            alert(e.response?.data?.message || "Failed to decrease quantity");
        }
    }

    const handleDelete = async (basketItemId) => {
        try{
            await deleteProductFromBasket(basketItemId)

            const data = await getBasket();
            setProducts(data.basket.basket_items)
        }catch(e){
            alert(e.response?.data?.message || "Failed to decrease quantity");
        }
    }

    useEffect(() => {
        getBasket().then(data => {
            setProducts(data.basket.basket_items);
        }).catch(e => {
            setError('Failed to load basket');
            console.log(e)
        }).finally(() => {setLoading(false)});
    }, [])

    const totalPrice = products.reduce((total, item) => {
        return total + Number(item.basketProduct.price) * item.quantity
    }, 0)

    return (

        <Container className="mt-3">
            <Row className="d-flex justify-content-between align-items-start">
                <Col md={7}>
                    <h2>Your basket</h2>
                    {loading ? (
                        <p>Loading basket...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : products.length === 0 ? (
                        <p>Your basket is empty</p>
                    ) : (
                        products.map((item) => (
                            <BasketItem
                                key={item.id}
                                product={item.basketProduct}
                                quantity={item.quantity}
                                basketItemId={item.id}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </Col>
                <Col md={4} className="d-flex flex-column align-items-start">
                    {promoVisible ? (<Form>
                            <Button onClick={togglePromo}>Enter the promotional code</Button>
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <Form.Control style={{width:'250px'}} placeholder="Enter your promotional code"/>
                                <Button className='ms-2'>Activate</Button>
                            </div>
                        </Form>
                    ) :
                        (<Button type='button' onClick={togglePromo}>Do you have a promotional code?</Button>)
                    }
                    <div className='mt-3'>To be paid: {totalPrice.toFixed(2)} $</div>
                    <Button type='button' className='mt-3' disabled={loading || products.length === 0} onClick={() => navigate(CHECKOUT_ROUTE)}>Go to delivery</Button>
                </Col>
            </Row>
        </Container>

    );
};

export default Basket;