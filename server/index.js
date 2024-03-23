const {
  
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchCart_products,
  createCart_products,
  destroyCart_products,
  authenticate,
  findUserByToken
} = require('./db');

const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const pg = require('pg');
const bodyParser = require('body-parser');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

//const Product = require('./ Product');
//const jwt = require('jsonwebtoken');
//const {createTables} = require('./db.js')

const isLoggedIn = async(req, res, next)=> {
  try {
    req.user = await findUserByToken(req.headers.authorization);
    next();
  }
  catch(ex){
    next(ex);
  }
};
// Administrator routes
// Add, edit, and remove products
// View list of all products
  
// View list of all users

// Dummy database to store products, users, and carts

const products = [
  { id: 1, name: 'Dell laptop',description:'inspiron16.0,16gb' ,price: 950 ,qty:4, imageUrl:'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/16-7640/media-gallery-ai-key/fpr/laptop-inspiron-16-plus-7640nt-bl-dis-fpr-ai-key-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=572&qlt=100,1&resMode=sharp2&size=572,402&chrss=full',admin: false },
  { id: 2, name: 'iphone15',description:'black, oled display',price: 1200 ,qty: 6,  imageUrl:'https://www.att.com/scmsassets/global/devices/phones/apple/apple-iphone-15/carousel/black-1.png', admin: false },
  { id: 3, name: 'snaptain drone',description:'grey,remote controller' ,price: 1200 ,qty: 2,  imageUrl:'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6534/6534909cv11d.jpg;maxHeight=640;maxWidth=550',admin: true },
  { id: 4, name: 'sony alpha IV',description:'black camera with sel2870 lens' ,price: 2699 ,qty:4, imageUrl:'https://m.media-amazon.com/images/I/71vpzW1nQJL.__AC_SY300_SX300_QL70_FMwebp_.jpg', admin: false }
  
];

const users = [
  { id: 1,  name: 'max',email: 'max@example.com', password: 'password1', admin: false },
  { id: 2, name: 'noel',email: 'noel@example.com', password: 'password2', admin: true },
  { id: 3, name: 'john', email: 'john@example.com', password: 'password3', admin: true },
  { id: 4, name: 'joy', email: 'john@example.com', password: 'password4', admin: false},
  { id: 5, name: 'nathan', email: 'john@example.com', password: 'password5', admin: true }

];

const cart_products = [
  { id: 1, name:'max', productId: 1, quantity: 2 ,admin: false},
  { id: 2,name: 'noel', productId: 2, quantity: 1,admin: false },
  {id: 3, name: 'john' ,productId: 3, quantity: 2 ,admin: false},
  {id: 4,name: 'joy', productId: 4, quantity: 1,admin: true },
  // Add more items to the cart as needed
];

//View all available products
app.get('/api/products',async (req, res) => {
  try {
    // Retrieve all products from the database
    //const products = await product.find();

    // Send the products as a response
    res.json(products);
} catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
} 
  
});
app.get('/api/users',async (req, res, next) => {
  try {
    
    // Send the users as a response
    res.json(users);
} catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Product not found' });
} 
  
});

app.post('/api/users', (req, res) => {
  // Extract data from the request body
  const { username, email } = req.body;

  // Create a new user in the database
  // This is a placeholder for actual database logic
  const newUser = {
      username: username,
      email: email
  };

  // Send a success response back to the client
  res.status(201).json({ message: 'User created successfully', user: newUser });
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
app.get('/api/cart_products',async (req, res, next) => {
  try {
    
    // Send the users as a response
    res.json(cart_products);
} catch (error) {
    console.error('Error fetching cart_products:', error);
    res.status(500).json({ message: 'Internal server error' });
} 
  
});

app.post('/api/cart_products', (req, res) => {
  // Extract product data from the request body
  const { productId, quantity } = req.body;

  // Add the product to the user's cart
  cart_products.push({ productId, quantity });

  // Send a success response back to the client
  res.status(200).json({ message: 'Product added to cart successfully' })
});


app.put('/api/cart_products', (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Find the user by userId
  const user = users.find(user => user.id === userId);

  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }

  // Find the product in the user's cart
  const productIndex = user.cart.findIndex(item => item.productId === productId);

  if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
  }

  // Update the quantity of the product in the cart
  user.cart[productIndex].quantity = quantity;

  // Send a success response
  res.json({ message: 'Product quantity updated successfully' });
});

// User registration
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
  try {
      const result = await client.query(query, [username, hashedPassword, email]);
      const user = result.rows[0];
      const token = jwt.sign({ user }, 'secret');
      res.json({ message: 'User registered successfully', token });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = $1';
  try {
      const result = await client.query(query, [username]);
      const user = result.rows[0];
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }
      const token = jwt.sign({ user }, 'secret');
      res.json({ message: 'Login successful', token });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/auth/me', async(req, res, next)=> {
  try {
    res.send(await findUserWithToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});
// Start the server
// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded.user;
      next();
  });
};
// Routes
app.get('/api/products',isLoggedIn, async (req, res, next) => {
    try {
      const SQL = `
        SELECT * from products;
      `
      const response = await client.query(SQL)
      res.send(response.rows)
    } catch (ex) {
      next(ex)
    }
  })
  //  // Mock database
 
  
  // Routes
  app.get('/users', async (req, res) => {
    try {
        const SQL = `
          SELECT * from users;
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
  //app.listen(PORT, () => {
  //  console.log(`Server is running on http://localhost:${PORT}`);
  //});    //

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
 // Perform checkout process (e.g., update inventory, create order record, etc.)
    // Dummy implementation for demonstration purposes
    app.post('/api/cart/checkout', authenticateUser, (req, res) => {
      const userCart = carts.filter(item => item.userId === req.user.id);
     carts = carts.filter(item => item.userId !== req.user.id);
      res.json({ message: 'Checkout successful', cart: userCart });
  });
const init = async() => {
  await client.connect() 
  console.log('connected to database');
 await createTables();
 console.log('tables created');

 const [max, noel, john, joy, nathan, ] = await Promise.all([
   { id: 1,  username: 'max',email: 'max@example.com', password: 'password1', admin: false },
   { id: 2, username: 'noel',email: 'noel@example.com', password: 'password2', admin: true },
   { id: 3,username: 'john', email: 'john@example.com', password: 'password3', admin: true },
   { id: 4,username: 'joy', email: 'john@example.com', password: 'password4', admin: true },
   { id: 5,username: 'nathan', email: 'john@example.com', password: 'password5', admin: true }


 ]);
 console.log(`max has an email of ${max.email}`);
 console.log(`noel has an id of ${noel.id}`);
 console.log(`joy has an password of ${john.password}`);

}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

init()