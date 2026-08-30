import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import Footer from "./components/Footer";
import Cart from "./components/Pages/Cart";
import Shop from "./components/Pages/Shop";
import ShopCategory from "./components/Pages/ShopCategory";
import Products from "./components/Products";
import LoginRegister from "./components/Pages/LoginRegister";
import women_banner from "./assets/lady2_icon.jpg"
import men_banner from "./assets/men_banner2.jpg"
import electronics_banner from "./assets/maro.jpg"
import SearchResults from './components/SearchResults';

function App() {
  return (
    <div>

      <Router>

        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/mens" element={<ShopCategory banner={men_banner} category="men's clothing" />} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} category="women's clothing" />} />
          <Route path="/electronics" element={<ShopCategory banner={electronics_banner} category="electronics" />} />

          <Route path='/products' element={<Products gender="products"/>}>
            <Route path=':productId' element={<Products />} />
          </Route>
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
         
          <Route path="/login" element={<LoginRegister/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
