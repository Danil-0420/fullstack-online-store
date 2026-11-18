import {useContext, useEffect, useState} from "react";
import { Context } from "../../index";
import {
    Button,
    Col,
    Dropdown,
    Form,
    Modal,
    Row
} from "react-bootstrap";
import {createProduct, fetchBrands, fetchTypes} from "../../http/productAPI";
import {observer} from "mobx-react-lite";


const CreateProduct = observer(({ show, onHide }) => {
    const { product } = useContext(Context);

    const [info, setInfo] = useState([]);
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [files, setFiles] = useState([])

    const selectFiles = (e) => {
        if(e.target.files.length <= 10){
            setFiles(Array.from(e.target.files))
        }else{
            alert("Max 10 files")
        }
    }


    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data))
        fetchBrands().then(data => product.setBrands(data))
    }, [])

    const addInfo = () => {
        setInfo([
            ...info,
            {
                title: "",
                description: "",
                number: Date.now()
            }
        ]);
    };

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? {...i, [key]: value} : i))
    }

    const addProduct = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price)
        files.forEach((file) => {formData.append('img', file)})
        formData.append('typeId', product.selectedType.id)
        formData.append('brandId', product.selectedBrand.id)
        formData.append('info', JSON.stringify(info))
        createProduct(formData).then(data => onHide())
    }

    const removeInfo = (number) => {
        setInfo(info.filter((i) => i.number !== number));
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Add new product</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Dropdown className="mb-3">
                        <Dropdown.Toggle>
                            {product.selectedType.name || 'Choose type'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {product.types.map((type) => (
                                <Dropdown.Item key={type.id} onClick={e => product.setSelectedType(type)}>
                                    {type.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown className="mb-3">
                        <Dropdown.Toggle>
                            {product.selectedBrand.name || 'Choose brand'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {product.brands.map((brand) => (
                                <Dropdown.Item key={brand.id} onClick={() => product.setSelectedBrand(brand)}>
                                    {brand.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Form.Control
                        className="mb-3"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter product name"
                    />

                    <Form.Control
                        className="mb-3"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        placeholder="Enter product price"
                        type="number"
                    />

                    <Form.Control
                        accept="image/*"
                        className="mb-3"
                        type="file"
                        onChange={selectFiles}
                        multiple
                    />

                    <hr />

                    <Button
                        type="button"
                        variant="outline-dark"
                        onClick={addInfo}
                    >
                        Add a new characteristic
                    </Button>

                    {info.map((i) => (
                        <Row
                            className="mt-3"
                            key={i.number}
                        >
                            <Col>
                                <Form.Control value={i.title} onChange={(e) => changeInfo('title', e.target.value, i.number)} placeholder="Enter title" />
                            </Col>

                            <Col>
                                <Form.Control value={i.description} onChange={(e) => changeInfo('description', e.target.value, i.number)} placeholder="Enter description" />
                            </Col>

                            <Col>
                                <Button
                                    type="button"
                                    variant="outline-danger"
                                    onClick={() => removeInfo(i.number)}
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="button"
                    variant="outline-dark"
                    onClick={onHide}
                >
                    Close
                </Button>

                <Button
                    type="button"
                    variant="outline-success"
                    onClick={addProduct}
                >
                    Add a new product
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;