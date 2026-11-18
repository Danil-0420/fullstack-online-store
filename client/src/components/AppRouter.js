import {useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {SHOP_ROUTE} from "../utils/const";
import {adminRoutes, authRoutes, publicRoutes} from "../Routes";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import AdminPage from "../pages/AdminPage";

const AppRouter = observer(() => {
    const {user} = useContext(Context);

    return (
        <Routes>
            {user.isAuth && authRoutes.map(({path, Component}) =>
                <Route
                    key={path}
                    path={path}
                    element={<Component />}
                />
            )}

            {publicRoutes.map(({path, Component}) =>
                <Route
                    key={path}
                    path={path}
                    element={<Component />}
                />
            )}

            {user.isAuth && user.user?.role === "ADMIN" && (
                <Route path='/admin' element={<AdminPage />}>
                    <Route index element={<h3>Welcome to admin panel</h3>}/>
                    {adminRoutes.map(({path, Component})=> (
                        <Route
                        key={path}
                        path={path}
                        element={<Component />}
                        />
                    ))}
                </Route>
            )}

            <Route
                path="*"
                element={<Navigate to={SHOP_ROUTE} replace />}
            />
        </Routes>
    );
});

export default AppRouter;