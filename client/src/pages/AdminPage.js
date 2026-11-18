
import SideBar from "../components/SideBar";
import {Outlet} from "react-router-dom";


const AdminPage = () => {

    return (
        <div className="admin-layout">
            <SideBar />

            <main className="admin-content">
                <Outlet/>
            </main>
        </div>

    )
}

export default AdminPage;