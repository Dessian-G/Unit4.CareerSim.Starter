const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_nots_db')
//const PORT = process.env.PORT || 3000;




// Dummy database to store products, users, and carts
//let products = [
   // { id: uuidv4(), name: 'Product 1', description: 'Description of Product 1', price: 10 },
   // { id: uuidv4(), name: 'Product 2', description: 'Description of Product 2', price: 20 },
    // Add more products as needed
///;

//let users = [];
//let carts = [];

const init = async() => {
    await client.connect();

    const SQL =`
    DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
      id SERIAL PRIMARY KEY,
      txt VARCHAR(255),
     starred BOOLEAN DEFAULT FALSE
    );
    INSERT INTO notes(txt, starred) VALUES('learn express', false);
    INSERT INTO notes(txt, starred) VALUES('write SQL queries', true);
   INSERT INTO notes(txt) VALUES('create routes');
  `;

    

    await client.query(SQL);
    console.log('data seeded');
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
     console.log(`listening on port ${PORT}`)
    })
  }
  
  init();


//View all available products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// View details for a specific product
app.get('/api/products/:id', (req, res, next) => {
    const { id } = req.params;
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// User registration
app.post('/api/register', (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        res.status(400).json({ message: 'Please provide username, password, and email' });
    } else {
        const newUser = { id: uuidv4(), username, password, email };
        users.push(newUser);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
});

// User login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    const user = users.find(u => u.token === token);
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        req.user = user;
        next();
    }
};

// Routes
app.get('/api/notes', async (req, res, next) => {
    try {
      const SQL = `
        SELECT * from notes;
      `
      const response = await client.query(SQL)
      res.send(response.rows)
    } catch (ex) {
      next(ex)
    }
  })

// Add product to cart
app.post('/api/cart/add', authenticateUser, (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        const existingCartItem = carts.find(item => item.userId === req.user.id && item.productId === productId);
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            carts.push({ userId: req.user.id, productId, quantity });
        }
        res.json({ message: 'Product added to cart successfully' });
    }
});

// Edit cart (change quantity or remove product)
app.put('/api/cart/edit', authenticateUser, (req, res) => {
    const { productId, quantity } = req.body;
    const cartItem = carts.find(item => item.userId === req.user.id && item.productId === productId);
    if (!cartItem) {
        res.status(404).json({ message: 'Product not found in cart' });
    } else {
        if (quantity === 0) {
            carts = carts.filter(item => !(item.userId === req.user.id && item.productId === productId));
        } else {
            cartItem.quantity = quantity;
        }
        res.json({ message: 'Cart updated successfully' });
    }
});

// Checkout
app.post('/api/cart/checkout', authenticateUser, (req, res) => {
    const userCart = carts.filter(item => item.userId === req.user.id);
    // Perform checkout process (e.g., update inventory, create order record, etc.)
    // Dummy implementation for demonstration purposes
    carts = carts.filter(item => item.userId !== req.user.id);
    res.json({ message: 'Checkout successful', cart: userCart });
});

// Administrator routes
// Add, edit, and remove products
// View list of all products
// View list of all users

