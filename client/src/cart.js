// cart.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pg = require('pg');

// Initialize PostgreSQL client
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost:5432/ecommerce_db');
client.connect();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded.user;
        next();
    });
};

// Route for adding a product to the cart
router.post('/add', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const query = 'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
    try {
        const result = await client.query(query, [userId, productId, quantity]);
        const cartItem = result.rows[0];
        res.json({ message: 'Product added to cart successfully', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for updating the quantity of a product in the cart
router.put('/edit', verifyToken, async (req, res) => {
    const { cartItemId, quantity } = req.body;
    const userId = req.user.id;
    const query = 'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
    try {
        const result = await client.query(query, [quantity, cartItemId, userId]);
        const updatedCartItem = result.rows[0];
        if (!updatedCartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        res.json({ message: 'Cart updated successfully', updatedCartItem });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for removing a product from the cart
router.delete('/remove/:id', verifyToken, async (req, res) => {
    const cartItemId = req.params.id;
    const userId = req.user.id;
    const query = 'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *';
    try {
        const result = await client.query(query, [cartItemId, userId]);
        const deletedCartItem = result.rows[0];
        if (!deletedCartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        res.json({ message: 'Product removed from cart successfully', deletedCartItem });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add more routes for cart management, such as viewing cart items, checking out, etc.

module.exports = router;
