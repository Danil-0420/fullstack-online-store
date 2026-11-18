import {observer} from "mobx-react-lite";
import {useContext} from "react";
import {ListGroup} from "react-bootstrap";
import {Context} from "../index";


const TypeBar = observer(() =>{
    const {product} = useContext(Context)
    return(
        <ListGroup>
            {product.types.map((type) => (
                <ListGroup.Item
                    key={type.id}
                    action
                    active={type.id === product.selectedType.id}
                    onClick={() => product.setSelectedType(type)}
                >
                    {type.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
})

export default TypeBar