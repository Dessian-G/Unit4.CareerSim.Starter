const API_BASE = 'http://localhost:3000/api';

export const addToCart = async (productId) => {
  const token = localStorage.getItem('auth-token');
  if (!token) {
    alert('Please log in to add items to your cart.');
    return false;
  }
  try {
    const response = await fetch(`${API_BASE}/cart_products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth-token');
        alert('Your session has expired. Please log in again.');
        return false;
      }
      const data = await response.json().catch(() => ({}));
      alert(data.message || 'Could not add product to cart');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return false;
  }
};

export const fetchCartProducts = async () => {
  const token = localStorage.getItem('auth-token');
  if (!token) {
    return null;
  }
  try {
    const response = await fetch(`${API_BASE}/cart_products`, {
      headers: { Authorization: token },
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth-token');
      }
      throw new Error('Error fetching cart products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart products:', error);
    return null;
  }
};

export const removeFromCart = async (cartItemId) => {
  const token = localStorage.getItem('auth-token');
  if (!token) {
    return false;
  }
  try {
    const response = await fetch(`${API_BASE}/cart_products/${cartItemId}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });
    return response.ok;
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return false;
  }
};
