
import {Container, Row, Col} from 'react-bootstrap'
import TypeBar from "../components/TypeBar"
import BrandBar from "../components/BrandBar"
import ProductList from "../components/ProductList";
import {useContext, useEffect} from "react";
import {fetchBrands, fetchTypes, fetchProducts} from "../http/productAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Shop = observer(() => {
    const {product} = useContext(Context)
    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data))
        fetchBrands().then(data => product.setBrands(data))
        fetchProducts().then(data => {product.setProducts(data.rows)})
    }, [product])
    return(
        <div className="d-flex">
            <Container className="mt-4">
                <Row>
                    <Col md={3}>
                        <TypeBar/>
                    </Col>
                    <Col md={9}>
                        <BrandBar/>
                        <ProductList />
                    </Col>
                </Row>
            </Container>
        </div>
    )
})

export default Shop;