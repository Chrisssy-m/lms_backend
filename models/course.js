// const pool = require("./connection");

const pool = require("../connection");

const CourseModel = {
  
  create: async ({ title, description, author, price, thumbnail, lessons }) => {
      debugger
    const query = `
      INSERT INTO courses (title, description, author, price, thumbnail, lessons)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb)
      RETURNING _id, title, description, author, price, thumbnail, lessons
    `;

    const values = [title, description, author, price, thumbnail, lessons ? JSON.stringify(lessons) : null];
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
      `
       SELECT 
      c.*,
      COALESCE(json_agg(l.*) FILTER (WHERE l._id IS NOT NULL), '[]') AS lessons_data
    FROM courses c
    LEFT JOIN lessons l
      ON l._id = ANY (
        SELECT jsonb_array_elements_text(c.lessons)::INT
      )
    WHERE c._id = $1
    GROUP BY c._id;
      `,
      [id]
    );
    return rows[0];
  },

  deleteById: async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM courses WHERE _id = $1 RETURNING *;",
      [id]
    );
    return rows[0];
  },

  findAll: async () => {
    const { rows } = await pool.query(
      "SELECT _id, title, author, price, description, thumbnail FROM courses"
    );
    return rows;
  },

  findLessonsById: async (id) => {
    const { rows } = await pool.query(
      `SELECT 
  COALESCE(
    json_agg(l.*) 
      FILTER (WHERE l._id IS NOT NULL), 
    '[]'
  ) AS lessons
FROM courses c
LEFT JOIN lessons l
  ON l._id = ANY (
    SELECT jsonb_array_elements_text(c.lessons)::INT
  )
WHERE c._id = $1;`,
      [id]
    );

    return rows[0];
  },


};

module.exports = CourseModel;
