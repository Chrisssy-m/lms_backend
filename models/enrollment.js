// const pool = require("./connection");

const pool = require("../connection");

const EnrollmentModel = {

    create: async ({ user_id, course_id, status }) => {
        const query = `
      INSERT INTO enrollments (user_id, course_id, status)
      VALUES ($1, $2, $3)
      RETURNING user_id, course_id, enrolled_at, status
    `;

        const values = [user_id, course_id, status];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    update: async (data) => {

        const { user_id, course_id, status } = data;

        const query = `
    UPDATE enrollments
SET status = $3
WHERE user_id = $1 AND course_id = $2
RETURNING user_id, course_id, enrolled_at, status;

  `;

        const values = [
            user_id, course_id, status
        ];

        const { rows } = await pool.query(query, values);

        console.log("Updated row:", rows[0]); // ✅ debug
        return rows[0];
    },


    findById: async (id) => {
        const { rows } = await pool.query(
            "SELECT * FROM enrollments WHERE _id = $1",
            [id]
        );
        return rows[0];
    },

    findCourseById: async (id) => {
        const query = `
    SELECT c.*
    FROM enrollments e
    INNER JOIN courses c ON c._id = e.course_id
    WHERE e.user_id = $1
  `;

        const { rows } = await pool.query(query, [id]);
        return rows
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
            "SELECT * FROM enrollments"
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

module.exports = EnrollmentModel;
