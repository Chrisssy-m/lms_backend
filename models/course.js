// const pool = require("./connection");

const pool = require("../connection");

const CourseModel = {

  create: async ({ title, description, author, price, thumbnail, lessons }) => {
    const query = `
      INSERT INTO courses (title, description, author, price, thumbnail, lessons)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb)
      RETURNING _id, title, description, author, price, thumbnail, lessons
    `;

    const values = [title, description, author, price, thumbnail, lessons];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  update: async (data) => {
    
    const { _id, title, description, author, price, thumbnail, lessons } = data;

    const query = `
    UPDATE courses
    SET
      title       = COALESCE($1, title),
      description = COALESCE($2, description),
      author      = COALESCE($3, author),
      price       = COALESCE($4, price),
      thumbnail   = $5,
      lessons     = COALESCE($6::jsonb, lessons)
    WHERE _id = $7
    RETURNING _id, title, description, author, price, thumbnail, lessons
  `;

    const values = [
      title ?? null,
      description ?? null,
      author ?? null,
      price ?? null,
      thumbnail || null,
      lessons ? JSON.stringify(lessons) : null,
      _id
    ];

    const { rows } = await pool.query(query, values);

    console.log("Updated row:", rows[0]); // ✅ debug
    return rows[0];
  },


  findById: async (id) => {
    const { rows } = await pool.query(
      "SELECT _id, title, description, author, price, thumbnail, lessons FROM courses WHERE _id = $1",
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
      "SELECT * FROM courses"
    );
    return rows;
  }

};

module.exports = CourseModel;
