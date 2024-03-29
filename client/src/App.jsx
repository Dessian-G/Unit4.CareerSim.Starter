import { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Link  } from 'react-router-dom';
import Logo from './assets/logo.png';
import Navigations from './components/Navigations';
//import Products from './components/Products';
//import Cart_products from './components/Cart_products';
////import Login from './components/Login';
//import Register from './components/Register';
import Users from './components/Users';

import './index.css'
import SingleBook from './components/SingleBook';


function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({})

  return (
    <Router>
      <>
        <h1><img id='logo-image' src={storeLogo} alt="Library Logo" />Library App</h1>
        <div id= "container">
        <Navigations isAuthenticated={token !== null} />
        <div id="main section">
        <Routes>
          <Route path="/"element={<Homes />}/>
          <Route path="/login"element={<Login setUser={setUser} token={token} setToken={setToken}/>} />
          <Route path="/register" element={<Register setUser={setUser} token={token} setToken={setToken}/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/products/:productsId" element={<productid token={token} user={user}/>} />
          <Route path='/account' element={<Account/>} />
          
        </Routes>
          </div>
        </div>
          
      </>
    </Router>
  ); 
}


export default App;
