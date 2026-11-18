import {Button, Form, Modal} from "react-bootstrap";
import {createType} from "../../http/productAPI";
import {useState} from "react";

const CreateType = ({ show, onHide })=> {
    const [type, setType] = useState('')

    const addType = () => {
        createType({name: type}).then(data => {
                setType(data)
                onHide()
        }
        )
    }

    return(
        <Modal
        show={show}
        onHide={onHide}
        centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Add new type</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Control value={type} onChange={(e) => setType(e.target.value)} placeholder="Enter type Name"/>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant='outline-danger' onClick={onHide}>close</Button>
                <Button variant='outline-success' onClick={addType}>Add new type</Button>
            </Modal.Footer>

        </Modal>
    )
}

export default CreateType