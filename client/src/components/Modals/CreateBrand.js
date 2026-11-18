import { Button, Form, Modal } from "react-bootstrap";
import {useState} from "react";
import {createBrand} from "../../http/productAPI";

const CreateBrand = ({ show, onHide }) => {

    const [brand, setBrand] = useState('')
    const addBrand = () => {
        createBrand({name: brand}).then(data => {
            setBrand(data)
            onHide()
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Add a new brand</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Control
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        placeholder="Enter brand name"
                    />
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="outline-danger"
                    onClick={onHide}
                >
                    Close
                </Button>

                <Button variant="outline-success" onClick={addBrand}>
                    Add a new brand
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBrand;