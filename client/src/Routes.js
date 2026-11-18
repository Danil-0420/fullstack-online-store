import Order from './pages/OrderPage'
import Basket from './pages/Basket'
import Auth from './pages/Auth'
import Shop from './pages/Shop'
import Product from './pages/ProductPage'
import Support from './pages/Support'
import Checkout from './pages/Checkout'
import OrderInfoPage from "./pages/OrderInfoPage";
import AdminOrders from './pages/AdminOrders'
import AdminAddFeatures from './pages/AdminAddFeatures'
import AdminAnalytics from './pages/AdminAnalytics'
import {
    BASKET_ROUTE, CHECKOUT_ROUTE,
    LOGIN_ROUTE, ORDER_INFO_ROUTE,
    ORDER_ROUTE,
    PRODUCT_ROUTE,
    REGISTRATION_ROUTE,
    SHOP_ROUTE, SUPPORT_ROUTE
} from "./utils/const";
import AdminOneOrderPage from "./pages/AdminOneOrderPage";


export const adminRoutes = [
    {
        path: 'orders',
        Component: AdminOrders
    },
    {
        path: 'product',
        Component: AdminAddFeatures
    },
    {
        path: 'analytics',
        Component: AdminAnalytics
    },
    {
        path: 'orders/:id' ,
        Component: AdminOneOrderPage
    }
]

export const authRoutes = [
    {
        path: ORDER_ROUTE,
        Component: Order
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: CHECKOUT_ROUTE,
        Component: Checkout
    },
    {
        path: ORDER_INFO_ROUTE,
        Component: OrderInfoPage
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth,
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth,
    },
    {
        path: SHOP_ROUTE,
        Component: Shop,
    },
    {
        path: `${PRODUCT_ROUTE}/:id`,
        Component: Product,
    },
    {
        path: `${SUPPORT_ROUTE}`,
        Component: Support,
    }

]