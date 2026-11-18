import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

import { Context } from "../index";
import {
    LOGIN_ROUTE,
    SHOP_ROUTE,
    SUPPORT_ROUTE, BASKET_ROUTE, ORDER_ROUTE, ADMINLTE_ROUTE
} from "../utils/const";

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const logout = () => {
        user.setUser({})
        user.setIsAuth(false)
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <NavLink
                    style={{ color: "white" }}
                    to={SHOP_ROUTE}
                >
                    Tech
                </NavLink>

                {user.isAuth ? (
                    <Nav className="ms-auto">

                        <Button
                            variant="outline-light"
                            className='me-2'
                            onClick={() => navigate(ADMINLTE_ROUTE)}
                        >
                            Admin panel
                        </Button>

                        <Button
                        variant="outline-light"
                        className='me-2'
                        onClick={()=>navigate(BASKET_ROUTE)}
                        >
                            Basket
                        </Button>

                        <Button
                        variant="outline-light"
                        className='me-2'
                        onClick={()=> navigate(ORDER_ROUTE)}
                        >
                            Order
                        </Button>

                        <Button
                            variant="outline-light"
                            className='me-2'
                            onClick={() => logout()}
                        >
                            Log out
                        </Button>
                    </Nav>
                ) : (
                    <Nav className="ms-auto">
                        <Button
                            variant="outline-light"
                            className='me-2'
                            onClick={() => navigate(LOGIN_ROUTE)}
                        >
                            Log in
                        </Button>
                    </Nav>
                )
                }
                <Nav>
                    <Button
                        variant="outline-light"
                        className='me-2'
                        onClick={() => navigate(SUPPORT_ROUTE)}
                    >
                        Support
                    </Button>
                </Nav>
            </Container>
        </Navbar>
    );
});

export default NavBar;