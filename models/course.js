// const pool = require("./connection");

const pool = require("../connection");

const CourseModel = {

  create: async ({ title, description, author, price, thumbnail }) => {
    debugger
    const query = `
      INSERT INTO courses (title, description, author, price, thumbnail)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING _id, title, description, author, price, thumbnail
    `;

    const values = [title, description, author, price, thumbnail];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  update: async (data) => {
    
    const { _id, title, description, author, price, thumbnail } = data;

    const query = `
    UPDATE courses
    SET
      title       = COALESCE($1, title),
      description = COALESCE($2, description),
      author      = COALESCE($3, author),
      price       = COALESCE($4, price),
      thumbnail   = $5
    WHERE _id = $6
    RETURNING _id, title, description, author, price, thumbnail
  `;

    const values = [
      title ?? null,
      description ?? null,
      author ?? null,
      price ?? null,
      thumbnail || null,
      _id
    ];

    const { rows } = await pool.query(query, values);

    console.log("Updated row:", rows[0]); // ✅ debug
    return rows[0];
  },


  findById: async (id) => {
    const { rows } = await pool.query(
      "SELECT * FROM courses WHERE _id = $1",
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

  findLessonsById: async ({ userId, courseId }) => {
    debugger
    const result = await pool.query(
      `
    SELECT 
      cl.lesson_id, 
      l.title, 
      l.type, 
      l.url,
      cl.lesson_order, 
      COALESCE(lp.is_completed, FALSE) AS is_completed
  FROM course_lessons cl
  JOIN lessons l ON l._id = cl.lesson_id
  LEFT JOIN lesson_progress lp 
      ON lp.user_id = $1 
     AND lp.course_id = cl.course_id 
     AND lp.lesson_id = cl.lesson_id
  WHERE cl.course_id = $2
  ORDER BY cl.lesson_order

    `,
      [userId, courseId]
    );

    // lock logic: first incomplete lesson unlocked, others locked
    let firstIncompleteFound = false;
    const lessons = result.rows.map(row => {
      let locked = false;
      if (!row.is_completed) {
        if (!firstIncompleteFound) {
          firstIncompleteFound = true; // first incomplete lesson unlocked
        } else {
          locked = true;
        }
      }
      return { ...row, locked };
    });

    return lessons;
  },


};

module.exports = CourseModel;
