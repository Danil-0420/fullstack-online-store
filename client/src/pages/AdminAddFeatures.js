import { useState } from "react";
import { Button, Container } from "react-bootstrap";

import CreateType from "../components/Modals/CreateType";
import CreateBrand from "../components/Modals/CreateBrand";
import CreateProduct from "../components/Modals/CreateProduct";

const AdminAddFeatures = () => {
    const [typeVisible, setTypeVisible] = useState(false);
    const [brandVisible, setBrandVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);

    return (
        <Container className="d-flex flex-column">
            <Button
                variant="outline-dark"
                className="mt-4 p-2"
                onClick={() => setTypeVisible(true)}
            >
                Add a new type
            </Button>

            <Button
                variant="outline-dark"
                className="mt-4 p-2"
                onClick={() => setBrandVisible(true)}
            >
                Add a new brand
            </Button>

            <Button
                variant="outline-dark"
                className="mt-4 p-2"
                onClick={() => setProductVisible(true)}
            >
                Add a new product
            </Button>

            <CreateType
                show={typeVisible}
                onHide={() => setTypeVisible(false)}
            />

            <CreateBrand
                show={brandVisible}
                onHide={() => setBrandVisible(false)}
            />

            <CreateProduct
                show={productVisible}
                onHide={() => setProductVisible(false)}
            />
        </Container>
    );
};

export default AdminAddFeatures;