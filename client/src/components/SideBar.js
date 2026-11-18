import {NavLink} from "react-router-dom";


const SideBar = () => {

    return (
        <aside className="admin-sidebar">
            <nav>
                <NavLink className='d-flex flex-column text-black text-decoration-none fs-5' to='/admin/orders'>
                    All orders
                </NavLink>
                <NavLink className='d-flex flex-column text-black text-decoration-none fs-5' to='/admin/product'>
                    Add features
                </NavLink>
                <NavLink className='d-flex flex-column text-black text-decoration-none fs-5' to='/admin/analytics'>
                    Analytics
                </NavLink>
            </nav>
        </aside>
    )
}

export default SideBar;