const pg = require("pg");
const client = new pg.Client({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost/acme_auth_users_db",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "shhh";

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS cart_products;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id UUID DEFAULT gen_random_uuid(),
      username VARCHAR(20) UNIQUE NOT NULL,
      Payment_info VARCHAR(16),
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      PRIMARY KEY (id)
    );
    CREATE TABLE products(
      id UUID DEFAULT gen_random_uuid(),
      name VARCHAR(150) UNIQUE NOT NULL,
      price NUMERIC DEFAULT 0,
      description TEXT,
      category VARCHAR(50),
      image TEXT,
      PRIMARY KEY (id)
    );
    CREATE TABLE cart_products(
      id UUID DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      qty INTEGER DEFAULT 1,
      CONSTRAINT unique_user_id_and_product_id UNIQUE (user_id, product_id),
      PRIMARY KEY (id)
    );
  `;
  await client.query(SQL);
};

const createUser = async ({ username, password, email }) => {
  const SQL = `
    INSERT INTO users(id, username, email, password) VALUES($1, $2, $3, $4) RETURNING id, username, email
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    email,
    await bcrypt.hash(password, 10),
  ]);
  return response.rows[0];
};

const deleteUser = async (username) => {
  const SQL = `
    DELETE FROM users WHERE username=$1
  `;
  await client.query(SQL, [username]);
};

const createProduct = async ({ name, price, description, category, image }) => {
  const SQL = `
    INSERT INTO products(id, name, price, description, category, image) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    price,
    description,
    category,
    image,
  ]);
  return response.rows[0];
};

const updateProducts = async ({ id, name, price, description, category, image }) => {
  const SQL = `
    UPDATE products
    SET name=$1, price=$2, description=$3, category=$4, image=$5
    WHERE id=$6
    RETURNING *
  `;
  const result = await client.query(SQL, [name, price, description, category, image, id]);
  return result.rows[0];
};

const createCart_products = async ({ user_id, product_id, qty = 1 }) => {
  const SQL = `
    INSERT INTO cart_products(id, user_id, product_id, qty) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id, qty]);
  return response.rows[0];
};

const updateCart_products = async (user_id, product_id, qty) => {
  const SQL = `
    UPDATE cart_products
    SET qty=$1
    WHERE user_id=$2 AND product_id=$3
    RETURNING *
  `;
  const result = await client.query(SQL, [qty, user_id, product_id]);
  return result.rows[0];
};

const destroyCart_products = async ({ user_id, id }) => {
  const SQL = `
    DELETE FROM cart_products WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, password, username
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [username]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = jwt.sign(
    { id: response.rows[0].id, username: response.rows[0].username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { token };
};

const findUserByToken = async (token) => {
  let id;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    id = payload.id;
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username
    FROM users
    WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProductById = async (id) => {
  const SQL = `
    SELECT * FROM products WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const fetchCart_products = async (user_id) => {
  const SQL = `
    SELECT cart_products.id, cart_products.qty, products.id AS product_id,
           products.name, products.price, products.description, products.image
    FROM cart_products
    JOIN products ON cart_products.product_id = products.id
    WHERE cart_products.user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createUser,
  deleteUser,
  createProduct,
  updateProducts,
  fetchUsers,
  fetchProducts,
  fetchProductById,
  fetchCart_products,
  createCart_products,
  updateCart_products,
  destroyCart_products,
  authenticate,
  findUserByToken,
};
