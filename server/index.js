const {
  client,
  createTables,
  
  createUser,
  createProduct,
  fetchUsers,
  fetchCart_products,
  createCart_products,
  destroyCart_products,
  //fetchUserCartItems,
  authenticate,
  findUserByToken,


} = require("./db");
const bcrypt = require('bcrypt')
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
app.use(require("morgan")("dev"));
const path = require("path");
const pg = require("pg");
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "shhh"

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

//const Product = require('./ Product');
//const jwt = require('jsonwebtoken');
//const {createTables} = require('./db.js')

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserByToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};
// Administrator routes
// Add, edit, and remove products
// View list of all products

// View list of all users

// Dummy database to store products, users, and carts

const products = [
  {
    id: 16,
    name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    admin: true,
  },
  {
    id: 15,
    name: "Mens Casual Premium Slim Fit T-Shirts ",
    price: 22.3,
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    category: "men's clothing",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    admin: true,
  },
  {
    id: 14,
    name: "Mens Cotton Jacket",
    price: 55.99,
    description:
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    admin: true,
  },
  {
    id: 13,
    name: "Mens Casual Slim Fit",
    price: 15.99,
    description:
      "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    admin: true,
  },
  {
    id: 8,
    name: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    price: 109,
    description:
      "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    admin: true,
  },
  {
    id: 8,
    name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    description:
      "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
    admin: true,
  },

  {
    id: 3,
    name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    description:
      "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
    admin: true,
  },
  {
    id: 6,
    name: "MBJ Women's Solid Short Sleeve Boat Neck V ",
    price: 9.85,
    description:
      "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
    admin: true,
  },
  {
    id: 10,
    name: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    description:
      "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
    admin: true,
  },
  {
    id: 2,
    name: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    description:
      "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
    admin: true,
  },
  {
    id: 12,
    name: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ",
    price: 999.99,
    description:
      "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
    admin: true,
  },
  {
    id: "1",
    name: "Dell laptop",
    description: "inspiron16.0,16gb",
    price: 950,
    qty: 4,
    image:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/16-7640/media-gallery-ai-key/fpr/laptop-inspiron-16-plus-7640nt-bl-dis-fpr-ai-key-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=572&qlt=100,1&resMode=sharp2&size=572,402&chrss=full",
    admin: false,
  },
  {
    id: "11",
    name: "iphone15",
    description: "black, oled display",
    category: "electronics",
    price: 1200,
    qty: 6,
    image:
      "https://www.att.com/scmsassets/global/devices/phones/apple/apple-iphone-15/carousel/black-1.png",
    admin: false,
  },
  {
    id: "7",
    name: "snaptain drone",
    description: "grey,remote controller",
    category: "electronics",
    price: 1200,
    qty: 2,
    image:
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6534/6534909cv11d.jpg;maxHeight=640;maxWidth=550",
    admin: true,
  },
  {
    id: "4",
    name: "sony alpha IV",
    description: "black camera with sel2870 lens",
    category: "electronics",
    price: 2699,
    qty: 4,
    image:
      "https://m.media-amazon.com/images/I/71vpzW1nQJL.__AC_SY300_SX300_QL70_FMwebp_.jpg",
    admin: false,
  },
];

const user = [
  {
    id: "1",
    name: "max",
    email: "max@gmail.com",
    password: "password1",
    admin: false,
  },
  {
    id: "2",
    name: "noel",
    email: "noel@gmail.com",
    password: "password2",
    admin: true,
  },
  {
    id: "3",
    name: "john",
    email: "john@gmail.com",
    password: "password3",
    admin: true,
  },
  {
    id: "4",
    name: "joy",
    email: "joy@gmail.com",
    password: "password4",
    admin: false,
  },
  {
    id: "5",
    name: "nathan",
    email: "nathan@gmail.com.",
    password: "password5",
    admin: true,
  },
];

const cart_products = [
  { id: "1", name: "max", productId: 1, quantity: 4, price: 950,"image": "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/16-7640/media-gallery-ai-key/fpr/laptop-inspiron-16-plus-7640nt-bl-dis-fpr-ai-key-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=572&qlt=100,1&resMode=sharp2&size=572,402&chrss=full",
  description: "inspiron16.0,16gb", admin: false },

  { id: "2", name: "noel", productId: 2, quantity: 1, 
  
    price: 12.99,
    description:
      "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
   
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg", admin: false },
  { id: "3", name: "john", productId: 3, quantity: 10, 
  price: 39.99,
  description:
    "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
 
    
  image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg", admin: false },

  { id: "4", name: "joy", productId: 4, quantity: 1,
  description: "black camera with sel2870 lens",
 
  price: 2699,

  image:
    "https://m.media-amazon.com/images/I/71vpzW1nQJL.__AC_SY300_SX300_QL70_FMwebp_.jpg", admin: true },
];


app.get('/api/products', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Product not found" });
  }
});

app.post("/api/users", (req, res) => {
  // Extract data from the request body
  const { username, email } = req.body;
  // create user in DB
  const newUser = {
    username: username,
    email: email,
  };
  res.status(201).send({ message: "User created successfully", user: newUser });
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
      const SQL = `
      SELECT * from products
      WHERE id=$1;
    `
      const result = await client.query(SQL, [req.params.id])
      res.send(product.Id)
  } catch (ex) {
      next(ex)
  }
});
app.post('/api/addtocart', fetchuser, async (req, res) => {
	console.log("Add Cart");
    let userData = await user.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Added")
  })

app.post('/api/getcart', fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await user.findOne({_id:req.user.id});
  res.json(userData.cartData);

  })
app.get("/api/cart_products", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * from cart_products
    WHERE id=$1;
  `
    res.send(cart_products);
  } catch (error) {
    console.error("Error fetching cart_products:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/api/cart_products", (req, res) => {
  const { productId, quantity } = req.body;
  const SQL = `
  SELECT * from cart_products
  WHERE id=$1;
`
  cart_products.push({ productId, quantity });

  res.status(200).send({ message: "Product added to cart successfully" });
});

app.put("/api/cart_products", (req, res) => {
  const { userId, productId, quantity } = req.body;

  const SQL = `
  SELECT * from cart_products
  WHERE id=$1;
`
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  const productIndex = user.cart.findIndex(
    (item) => item.productId === productId
  );

  if (productIndex === -1) {
    return res.status(404).send({ message: "Product not found in cart" });
  }
  user.cart[productIndex].quantity = quantity;
  res.send({ message: "Product quantity updated successfully" });
});

app.post('/api/regidter', async (req, res) => {
  console.log("Sign Up");
        let success = false;
        let check = await user.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: success, errors: "existing user found with this email" });
        }
        let cart = {};
          for (let i = 0; i < 300; i++) {
          cart[i] = 0;
        }
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });
        await user.save();
        const data = {
            user: {
                id: user.id
            }
        }
        
        const token = jwt.sign(data, 'secret_ecom');
        success = true; 
        res.json({ success, token })
    })


app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Insert new user into database
   const user = await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
console.log(user, "line 441")
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'could not register' });
  }
});


const login =async ({username, password}) => {

console.log(username,password);
  const USER_SQL_QUERY = `SELECT * FROM users WHERE username = $1;`
  

  const user = await client.query(USER_SQL_QUERY, [username]);
  console.log(user.rows, 'LINE 459')
  if (!user.rows.length || await bcrypt.compare(password, user.rows[0].password) === false) {
    const error = new Error('Invalid email || password');
    error.status = 401;
    throw error;
  }
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  return token;
}


// User login
app.post("/api/login", async (req, res) => {
  // const { username, password } = req.body;


  try {
    const userResult = await login(req.body) ;
    res.send(userResult)
  } catch(e) {
    console.log(e)
  }
  
 
    // If authentication fails, send an error response
    
  
});



app.get("/api/auth/me", async (req, res, next) => {
  try {
    res.send(await findUserByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});
// Start the server
// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    req.user = decoded.user;
    next();
  });
};
// Routes
app.get("/api/products", isLoggedIn, async (req, res, next) => {
  try {
    const SQL = `
        SELECT * from products;
      `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

app.get("api/users", async (req, res) => {
  try {
    const SQL = `
          SELECT * from users;
        `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

app.get("/admin/users", (req, res) => {
  // get from DB
  const adminUsers = users.filter((user) => user.admin);
  res.send(adminUsers);
});

app.get("/users/:email", (req, res) => {
  const userEmail = req.params.email;
  // get from DB
  const user = users.find((user) => user.email === userEmail);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Add product to cart
app.post("/api/cart/add", authenticateUser, (req, res) => {
  const { productId, quantity } = req.body;
  // get products from DB
  const product = products.find((p) => p.id === productId);
  if (!product) {
    res.status(404).send({ message: "Product not found" });
  } else {
    const existingCartItem = carts.find(
      (item) => item.userId === req.user.id && item.productId === productId
    );
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      carts.push({ userId: req.user.id, productId, quantity });
    }
    res.send({ message: "Product added to cart successfully" });
  }
});

// Edit cart (change quantity or remove product)
app.put("/api/cart/edit", authenticateUser, (req, res) => {
  const { productId, quantity } = req.body;
  // use from DB
  const cartItem = carts.find(
    (item) => item.userId === req.user.id && item.productId === productId
  );
  if (!cartItem) {
    res.status(404).send({ message: "Product not found in cart" });
  } else {
    if (quantity === 0) {
      carts = carts.filter(
        (item) => !(item.userId === req.user.id && item.productId === productId)
      );
    } else {
      cartItem.quantity = quantity;
    }
    res.send({ message: "Cart updated successfully" });
  }
});

app.post('/api/addtocart',  async (req, res) => {
	console.log("Add Cart");
    let userData = await user.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Added")

  })

  app.post('/api/removefromcart', fetchuser, async (req, res) => {
    console.log("Remove Cart");
      let userData = await Users.findOne({_id:req.user.id});
      if(userData.cartData[req.body.itemId]!=0)
      {
        userData.cartData[req.body.itemId] -= 1;
      }
      await user.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
      res.send("Removed");
    })

// Checkout
app.post("/api/users/:id/checkout", async (rep, res, next) => {
  try {
    const { id } = req.params;
    const order = await Checkout(id);
    res.send(order);
  } catch (ex) {
    next(ex);
  }
});
app.post("/api/checkout", async (req, res, next) => {
  try {
    const { userId } = req.body;

    const userCartItems = await fetchUserCartItems(userId);

    await processCartItems(userCartItems);

    await clearUserCart(userId);

    res.status(200).send({ message: "Checkout successful" });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send({ message: "An error occurred during checkout" });
  }
});

app.post("/api/cart_products/checkout", authenticateUser, (req, res) => {
  const userCart = carts.filter((item) => item.userId === req.user.id);
  carts = carts.filter((item) => item.userId !== req.user.id);
  res.send({ message: "Checkout successful", cart: userCart });
});
app.put("api/cart_products/checkout", authenticateUser, (req, res) => {
  //

  const cartItems = req.body.cartItems; // Assuming the request body contains the items in the cart
  const totalPrice = calculateTotalPrice(cartItems); // Calculate the total price of the items in the cart
  res
    .status(200)
    .send({ message: "Checkout successful", totalPrice: totalPrice });
});

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();

  console.log("tables created");

  const [max, noel, john, joy, nathan] = await Promise.all([
    createUser({
      username: "max",
      email: "max@example.com",
      password: "password1",
    }),
    createUser({
      username: "noel",
      email: "noel@gmail.com",
      password: "password2",
    }),
    createUser({
      username: "john",
      email: "john@gmail.com",
      password: "password3",
    }),
    createUser({
      username: "joy",
      email: "joy@gmail.com",
      password: "password4",
    }),
    createUser({
      username: "nathan",
      email: "nathan@gmail.com",
      password: "password5",
    }),
  ]);
  console.log(max);
};
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

init();
