const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_auth_users_db"
);
const uuid = require('uuid');
const bcrypt = require("bcrypt");
//app.use(bodyParser.json());

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS cart_products;
    DROP TABLE IF EXISTS favorites;
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
      name VARCHAR(20) UNIQUE NOT NULL,
      price INTEGER DEFAULT 0,
      description VARCHAR(225),
      PRIMARY KEY (id)
    );
    CREATE TABLE cart_products(
      id UUID DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      qty INTEGER DEFAULT 0,
      CONSTRAINT unique_user_id_and_product_id UNIQUE (user_id, product_id),
      PRIMARY KEY (id)
    );
  `;
  await client.query(SQL);
  //console.log(createTables)
};

const createUser = async ({ username, password, email }) => {
  const SQL = `
    INSERT INTO users(id, username, email, password) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    email,
    await bcrypt.hash(password, 5)]
  );
  return response.rows[0];
};

const createProduct = async ({ name }) => {
  const SQL = `
    INSERT INTO products(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createCart_products = async ({ user_id, product_id }) => {
  const SQL = `
    INSERT INTO cart_products(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
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
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return { token: token };
};

const findUserByToken = async (token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
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

  return { token: token };
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

const fetchCart_products = async (user_id) => {
  const SQL = `
    SELECT * FROM cart_products where user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  fetchCart_products,
  createCart_products,
  destroyCart_products,
  authenticate,
  findUserByToken,
};
