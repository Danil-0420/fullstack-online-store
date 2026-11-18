import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/NavBar";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {check} from "./http/userAPI";
import {Spinner} from "react-bootstrap";
import {observer} from "mobx-react-lite";

const App = observer(() => {

    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        check()
            .then(data => {
                user.setUser(data);
                user.setIsAuth(true);
            })
            .catch(() => {
                localStorage.removeItem('token');
                user.setUser({});
                user.setIsAuth(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user]);

    if(loading){
        return (<Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>)
    }
  return (
      <BrowserRouter>
          <Navbar/>
          <AppRouter/>
      </BrowserRouter>
  )
})

export default App;
