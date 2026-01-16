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

  // findLessonsById: async ({ userId, courseId }) => {

  //   const result = await pool.query(
  //     `
  //   SELECT 
  //     cl.lesson_id, 
  //     l.title, 
  //     l.type, 
  //     l.url,
  //     cl.lesson_order, 
  //     cl.quizid, 
  //     COALESCE(lp.is_completed, FALSE) AS is_completed
  // FROM course_lessons cl
  // JOIN lessons l ON l._id = cl.lesson_id
  // LEFT JOIN lesson_progress lp 
  //     ON lp.user_id = $1 
  //    AND lp.course_id = cl.course_id 
  //    AND lp.lesson_id = cl.lesson_id
  // WHERE cl.course_id = $2
  // ORDER BY cl.lesson_order

  //   `,
  //     [userId, courseId]
  //   );

  //   // lock logic: first incomplete lesson unlocked, others locked
  //   let firstIncompleteFound = false;
  //   const lessons = result.rows.map(row => {
  //     let locked = false;
  //     if (!row.is_completed) {
  //       if (!firstIncompleteFound) {
  //         firstIncompleteFound = true; // first incomplete lesson unlocked
  //       } else {
  //         locked = true;
  //       }
  //     }
  //     return { ...row, locked };
  //   });

  //   return lessons;
  // },


  findLessonsById: async ({ userId, courseId }) => {

    // 1️⃣ Lessons + progress
    const result = await pool.query(
      `
    SELECT 
      cl.lesson_id, 
      l.title, 
      l.type, 
      l.url,
      cl.lesson_order, 
      cl.quizid, 
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

    // 2️⃣ Lock logic (first incomplete unlocked)
    let firstIncompleteFound = false;

    const lessons = result.rows.map(row => {
      let locked = false;

      if (!row.is_completed) {
        if (!firstIncompleteFound) {
          firstIncompleteFound = true;
        } else {
          locked = true;
        }
      }

      return { ...row, locked };
    });

    // 3️⃣ quizid extract (same for all lessons)
    const quizId = lessons[0]?.quizid || null;

    let quiz = null;

    // 4️⃣ Quiz + questions (ONLY ONE TIME)
    if (quizId) {
      const quizResult = await pool.query(
        `
  SELECT 
  q._id,
  q.name,
  COALESCE(
    (
      SELECT jsonb_agg(qq.*)
      FROM quiz_questions qq
      JOIN LATERAL jsonb_array_elements_text(q.questions) AS qid(id) ON qq._id = qid.id::int
    ),
    '[]'::jsonb
  ) AS questions
FROM quiz q
WHERE q._id = $1;


      `,
        [quizId]
      );

      quiz = quizResult.rows[0] || null;
    }

    // 5️⃣ Final exam lock logic
    const allLessonsCompleted = lessons.every(l => l.is_completed);

    // 6️⃣ FINAL RESPONSE
    return {
      data: lessons,
      quiz: quiz
        ? {
          ...quiz,
          locked: !allLessonsCompleted
        }
        : null
    };
  },


};

module.exports = CourseModel;
