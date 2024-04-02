import React from 'react';

const SingleProduct = ({ product }) => {
  return (
    <li key={product.id}>
      <h3>{product.name}</h3>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price}</p>
      <img src={product.image} alt={product.name} />
    </li>
  );
};

export default SingleProduct;