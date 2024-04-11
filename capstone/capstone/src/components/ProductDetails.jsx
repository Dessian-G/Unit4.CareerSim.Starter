import React from 'react';

const ProductDetail = ({ products }) => {
  return (
    <div className="product-display">
      <h2>All Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product">
            <img src={product.image} alt={product.name} />
            <div className="product-details">
              <h3>{product.title}</h3>
              <p>Description: {product.description}</p>
              <p>Price: ${product.price}</p>
              {/* Add to cart button */}
              <button>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;

