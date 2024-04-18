import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SingleProduct = () => {
  const { id } = useParams(); // Get the product ID from URL params
  const [product, setProduct] = useState(null); // State to store the product data
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    // Function to fetch the product data
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data); // Update product state with fetched data
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false); // Set loading status to false when fetch completes
      }
    };

    fetchProduct(); // Call the fetchProduct function
  }, [id]); // Run the effect whenever the product ID changes

  // Render loading message while product data is being fetched
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Render product details once data is available
  return (
    <div>
      <h2>{product.name}</h2>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price}</p>
      {/* Add more product details as needed */}
    </div>
  );
};

export default SingleProduct;
