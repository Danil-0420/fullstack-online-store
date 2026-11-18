import OrderItem from "./OrderItem"
import {Card} from "react-bootstrap";



const OrderList = ({orders}) => {

    return (
        <Card>
            {orders.map(order =>
            <OrderItem key={order.id} order={order}/>
            )}
        </Card>
    );
};

export default OrderList;