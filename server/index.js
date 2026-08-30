const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  fetchProductById,
  fetchCart_products,
  createCart_products,
  updateCart_products,
  destroyCart_products,
  authenticate,
  findUserByToken,
} = require("./db");
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../capstone/capstone/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../capstone/capstone/dist/assets"))
);

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserByToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const product = await fetchProductById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.send(product);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await createUser({ username, email, password });
    res.status(201).send(user);
  } catch (ex) {
    if (ex.code === "23505") {
      return res.status(400).send({ message: "Username or email already exists" });
    }
    next(ex);
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/me", isLoggedIn, async (req, res) => {
  res.send(req.user);
});

app.get("/api/cart_products", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await fetchCart_products(req.user.id));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/cart_products", isLoggedIn, async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const cartItem = await createCart_products({
      user_id: req.user.id,
      product_id: productId,
      qty,
    });
    res.status(201).send(cartItem);
  } catch (ex) {
    if (ex.code === "23505") {
      return res.status(400).send({ message: "Product already in cart" });
    }
    next(ex);
  }
});

app.put("/api/cart_products", isLoggedIn, async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const cartItem = await updateCart_products(req.user.id, productId, qty);
    if (!cartItem) {
      return res.status(404).send({ message: "Product not found in cart" });
    }
    res.send(cartItem);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/cart_products/:id", isLoggedIn, async (req, res, next) => {
  try {
    await destroyCart_products({ user_id: req.user.id, id: req.params.id });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message || "Internal Server Error" });
});

const products = [
  {
    name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  },
  {
    name: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
  },
  {
    name: "Mens Cotton Jacket",
    price: 55.99,
    description:
      "Great outerwear jacket for Spring/Autumn/Winter, suitable for many occasions such as working, hiking, camping, or traveling.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
  },
  {
    name: "Mens Casual Slim Fit",
    price: 15.99,
    description:
      "The color could be slightly different between the screen and in practice. Body builds vary by person, so review the size chart.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
  },
  {
    name: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    price: 109,
    description:
      "Easy upgrade for faster boot up, shutdown, application load and response compared to a 5400 RPM SATA hard drive.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
  },
  {
    name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    description:
      "Faux leather material for style and comfort, 2 front pockets, hooded denim-style faux leather jacket with button detail on waist.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
  },
  {
    name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    description:
      "Lightweight, perfect for trips or casual wear, long sleeve with hood, adjustable drawstring waist, 2 side pockets.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
  },
  {
    name: "MBJ Women's Solid Short Sleeve Boat Neck V",
    price: 9.85,
    description:
      "95% rayon 5% spandex, lightweight fabric with great stretch for comfort, ribbed sleeves and neckline.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
  },
  {
    name: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    description:
      "100% polyester, machine wash, lightweight and roomy with moisture-wicking fabric and a comfortable V-neck collar.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
  },
  {
    name: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    description:
      "95% cotton, 5% spandex, casual short sleeve letter print V-neck tee, soft fabric with some stretch.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
  },
  {
    name: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
    price: 999.99,
    description:
      "49 inch super ultrawide 32:9 curved gaming monitor with QLED technology, HDR support, and 144Hz refresh rate.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
  },
  {
    name: "Dell laptop",
    price: 950,
    description: "Inspiron 16.0, 16gb",
    category: "electronics",
    image:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/16-7640/media-gallery-ai-key/fpr/laptop-inspiron-16-plus-7640nt-bl-dis-fpr-ai-key-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=572&qlt=100,1&resMode=sharp2&size=572,402&chrss=full",
  },
  {
    name: "iphone15",
    price: 1200,
    description: "Black, OLED display",
    category: "electronics",
    image: "https://www.att.com/scmsassets/global/devices/phones/apple/apple-iphone-15/carousel/black-1.png",
  },
  {
    name: "Snaptain drone",
    price: 1200,
    description: "Grey, with remote controller",
    category: "electronics",
    image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6534/6534909cv11d.jpg;maxHeight=640;maxWidth=550",
  },
  {
    name: "Sony Alpha IV",
    price: 2699,
    description: "Black camera with SEL2870 lens",
    category: "electronics",
    image: "https://m.media-amazon.com/images/I/71vpzW1nQJL.__AC_SY300_SX300_QL70_FMwebp_.jpg",
  },
];

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");

  await Promise.all([
    createUser({ username: "max", email: "max@example.com", password: "password1" }),
    createUser({ username: "noel", email: "noel@example.com", password: "password2" }),
    createUser({ username: "john", email: "john@example.com", password: "password3" }),
    createUser({ username: "joy", email: "joy@example.com", password: "password4" }),
    createUser({ username: "nathan", email: "nathan@example.com", password: "password5" }),
  ]);
  console.log("users seeded");

  await Promise.all(products.map((product) => createProduct(product)));
  console.log("products seeded");
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

init();
