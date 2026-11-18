import {
    Button,
    Card,
    Container,
    Dropdown,
    Form
} from "react-bootstrap";
import { useState } from "react";

const Support = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [category, setCategory] = useState("");

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "calc(100vh - 54px)" }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h3>Send us your question 😊</h3>
                <div>We will respond as soon as possible</div>

                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Name and surname"
                    />

                    <Form.Control
                        className="mt-3"
                        type="email"
                        placeholder="E-mail"
                    />

                    <Form.Control
                        className="mt-3"
                        type="tel"
                        placeholder="Phone number (optional)"
                    />

                    <Dropdown className="mt-3">
                        <Dropdown.Toggle className="w-100">
                            {category || "Choose category"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                            <Dropdown.Item
                                onClick={() => setCategory("Orders")}
                            >
                                Orders
                            </Dropdown.Item>

                            <Dropdown.Item
                                onClick={() => setCategory("Products")}
                            >
                                Products
                            </Dropdown.Item>

                            <Dropdown.Item
                                onClick={() => setCategory("Complaints and returns")}
                            >
                                Complaints and returns
                            </Dropdown.Item>

                            <Dropdown.Item
                                onClick={() => setCategory("Other")}
                            >
                                Other
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Form.Control
                        className="mt-3"
                        as="textarea"
                        rows={5}
                        style={{ resize: "none" }}
                        placeholder="Describe your problem"
                    />

                    <Form.Group className="mt-3">
                        <Form.Label>Attachment</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>

                    <Form.Check
                        className="mt-3"
                        type="checkbox"
                        label="Accept Terms and Conditions"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />

                    <Button
                        className="mt-3"
                        type="submit"
                        disabled={!isChecked}
                    >
                        Send
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default Support;