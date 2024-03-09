const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const PORT = 3000;

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_users_db')
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

    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(20)
    );
    CREATE TABLE favorites(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      CONSTRAINT unique_user_id_and_product_id UNIQUE (user_id, product_id)
    );
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
    const product = product.find(p => p.id === id);
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
//app.listen(PORT, () => {
   // console.log(`Server is running on http://localhost:${PORT}`);
//});


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
  //  // Mock database
const users = [
    { id: 1, email: 'john@example.com', password: 'password1', admin: false },
    { id: 2, email: 'jane@example.com', password: 'password2', admin: true },
    { id: 3, email: 'bob@example.com', password: 'password3', admin: true }
  ];
  
  // Routes
  app.get('/users', async (req, res) => {
    try {
        const SQL = `
          SELECT * from notes;
        `
        const response = await client.query(SQL)
        res.send(response.rows)
      } catch (ex) {
        next(ex)
      }
  });
  
  app.get('/admin/users', (req, res) => {
    const adminUsers = users.filter(user => user.admin);
    res.json(adminUsers);
  });
  
  app.get('/users/:email', (req, res) => {
    const userEmail = req.params.email;
    const user = users.find(user => user.email === userEmail);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });    //

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

