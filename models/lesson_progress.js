// const pool = require("./connection");

const pool = require("../connection");

const Lesson_progressModel = {

  create: async ({ user_id, course_id, lesson_id }) => {

    const query = `
    INSERT INTO lesson_progress (user_id, course_id, lesson_id, is_completed, completed_at)
VALUES ($1, $2, $3, TRUE, NOW())
ON CONFLICT (user_id, lesson_id, course_id)
DO UPDATE SET is_completed = TRUE, completed_at = NOW();

    `;

    const values = [user_id, course_id, lesson_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  update: async (data) => {

    const { _id, user_id, course_id, lesson_id, is_completed } = data;

    const query = `
    UPDATE lesson_progress
    SET
      user_id       = COALESCE($1, user_id),
      course_id = COALESCE($2, course_id),
      lesson_id      = COALESCE($3, lesson_id),
      is_completed       = COALESCE($4, is_completed)
    WHERE _id = $5
    RETURNING _id, user_id, course_id, lesson_id, is_completed
  `;

    const values = [
      user_id, course_id, lesson_id, is_completed, _id
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
      "SELECT * FROM lesson_progress"
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

module.exports = Lesson_progressModel;
