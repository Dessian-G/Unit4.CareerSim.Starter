
import React,{createContext, useState, useEffect} from "react";


  export const ProductContext = createContext ();

  const ProductProvider = ({children}) => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchProducts = async() =>{
            const response = await fetch('http://localhost:3000/api/products');

            const data = await response.json();
            console.log(data);
        };
        fetchProducts();

    }, []);
    return <ProductContext.Provider>{children}</ProductContext.Provider>;

};

export default ProductProvider;