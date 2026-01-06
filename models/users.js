// const pool = require("./connection");

const pool = require("../connection");

const UserModel = {

  create: async ({ name, email, password, role }) => {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING _id, name, email, role
    `;
    const values = [name, email, password, role || "student"];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  update: async (data) => {
    const { _id, name, email, password, role } = data;

    const query = `
    UPDATE users
SET
    name     = COALESCE($1, name),      
    email    = COALESCE($2, email),
    password = COALESCE($3, password), 
    role     = COALESCE($4, role)              
WHERE _id = $5                                      
RETURNING _id, name, email, role;
  `;

    const values = [name, email, password, role, _id];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },


  findByEmail: async (email) => {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return rows[0];
  },

  findById: async (id) => {
    const { rows } = await pool.query(
      "SELECT _id, name, email, password, role FROM users WHERE _id = $1",
      [id]
    );
    return rows[0];
  },

  deleteById: async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE _id = $1 RETURNING *;",
      [id]
    );
    return rows[0];
  },

  findAll: async () => {
    const { rows } = await pool.query(
      "SELECT * FROM users"
    );
    return rows;
  }

};

module.exports = UserModel;
