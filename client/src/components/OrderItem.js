import {Card, Col, Row} from "react-bootstrap";



const OrderItem = ({order}) => {


    return (
            <Card>
                <Row>
                    <Col md={2}>{order.id}</Col>
                    <Col md={2}>{order.user}</Col>
                    <Col md={2}>{order.products.map(product=>
                    <div key={product} className='m-2' style={{border: 'solid 1px', padding: '5px'}}>{product}</div>
                    )}</Col>
                    <Col md={2}>{order.address}</Col>
                    <Col md={2}>{order.creationDate}</Col>
                    <Col md={2}>{order.status}</Col>
                </Row>
            </Card>
    );
};

export default OrderItem;
