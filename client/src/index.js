import {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import ProductStore from './store/ProductStore';

const user = new UserStore();
const product = new ProductStore();

console.log(process.env.REACT_APP_API_URL)

export const Context = createContext({
    user,
    product
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{user, product}}>
        <App/>
    </Context.Provider>,
);


