// const pool = require("./connection");

const pool = require("../connection");
const { getTotalRec, getPaginatedData } = require("./utils");
const CourseModel = {

  create: async ({ title, description, author, price, thumbnail }) => {

    const query = `
      INSERT INTO courses (title, description, author, price, thumbnail)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING _id, title, description, author, price, thumbnail
    `;

    const values = [title, description, author, price, thumbnail];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  findFilterRecords: async ({ col, row }) => {
    let query;
    let values;

    if (col === "_id") {
      query = `
    SELECT *
    FROM courses
    WHERE _id = $1
  `;
      values = [Number(row)];
    } else {
      query = `
    SELECT *
    FROM courses
    WHERE ${col} ILIKE $1
  `;
      values = [`%${row}%`];
    }

    const { rows } = await pool.query(query, values);
    return rows;

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

  findAll: async ({ page, size }) => {
    if (page && size) {
      const reqPage = page || 1;
      const limit = size || 10;

      const offset = (reqPage - 1) * limit;

      const totalRec = await pool.query(
        getTotalRec('courses')
      );

      const query = getPaginatedData('courses')
      const values = [limit, offset];
      const { rows } = await pool.query(query, values);
      return { data: rows, totalRecords: totalRec?.rows[0].count || null };
    } else {
      const { rows } = await pool.query('SELECT * FROM courses');
      return rows
    }


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

  getCourseFullDetail: async (courseId) => {
    const query = `
  SELECT
    c.*,

    COALESCE(r.reviews, '[]')  AS reviews,
    COALESCE(e.events, '[]')   AS events,
    COALESCE(l.lessons, '[]')  AS lessons

  FROM courses c

  
  LEFT JOIN LATERAL (
    SELECT json_agg(r) AS reviews
    FROM reviews r
    WHERE r.course_id = c._id
  ) r ON true

 
  LEFT JOIN LATERAL (
    SELECT json_agg(e) AS events
    FROM events e
    WHERE e.course_id = c._id
  ) e ON true

  
 LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      '_id', l._id,
      'title', l.title,
      'url', l.url
    ) ORDER BY cl.lesson_order
  ) AS lessons
  FROM course_lessons cl
  JOIN lessons l ON l._id = cl.lesson_id
  WHERE cl.course_id = c._id
) l ON true



  WHERE c._id = $1;
`;


    const { rows } = await pool.query(query, [courseId]);
    return rows[0];
  },

  //   findLessonsById: async ({ userId, courseId }) => {

  //     // 1️⃣ Lessons + progress
  //     const result = await pool.query(
  //       `
  //     SELECT 
  //       cl.lesson_id, 
  //       l.title, 
  //       l.type, 
  //       l.url,
  //       cl.lesson_order, 
  //       cl.quizid, 
  //       COALESCE(lp.is_completed, FALSE) AS is_completed
  //     FROM course_lessons cl
  //     JOIN lessons l ON l._id = cl.lesson_id
  //     LEFT JOIN lesson_progress lp 
  //       ON lp.user_id = $1 
  //      AND lp.course_id = cl.course_id 
  //      AND lp.lesson_id = cl.lesson_id
  //     WHERE cl.course_id = $2
  //     ORDER BY cl.lesson_order
  //     `,
  //       [userId, courseId]
  //     );

  //     // 2️⃣ Lock logic (first incomplete unlocked)
  //     let firstIncompleteFound = false;

  //     const lessons = result.rows.map(row => {
  //       let locked = false;

  //       if (!row.is_completed) {
  //         if (!firstIncompleteFound) {
  //           firstIncompleteFound = true;
  //         } else {
  //           locked = true;
  //         }
  //       }

  //       return { ...row, locked };
  //     });

  //     // 3️⃣ quizid extract (same for all lessons)
  //     const quizId = lessons[0]?.quizid || null;

  //     let quiz = null;

  //     // 4️⃣ Quiz + questions (ONLY ONE TIME)
  //     if (quizId) {
  //       const quizResult = await pool.query(
  //         `
  //   SELECT 
  //   q._id,
  //   q.name,
  //   COALESCE(
  //     (
  //       SELECT jsonb_agg(qq.*)
  //       FROM quiz_questions qq
  //       JOIN LATERAL jsonb_array_elements_text(q.questions) AS qid(id) ON qq._id = qid.id::int
  //     ),
  //     '[]'::jsonb
  //   ) AS questions
  // FROM quiz q
  // WHERE q._id = $1;


  //       `,
  //         [quizId]
  //       );

  //       quiz = quizResult.rows[0] || null;
  //     }

  //     // 5️⃣ Final exam lock logic
  //     const allLessonsCompleted = lessons.every(l => l.is_completed);

  //     // 6️⃣ FINAL RESPONSE
  //     return {
  //       data: lessons,
  //       quiz: quiz
  //         ? {
  //           ...quiz,
  //           locked: !allLessonsCompleted
  //         }
  //         : null
  //     };
  //   },

  findLessonsById: async ({ userId, courseId }) => {

    /**
     * 1️⃣ Lessons + progress + lesson quiz
     */
    const result = await pool.query(
      `
    SELECT 
      cl.lesson_id, 
      l.title, 
      l.outline, 
      l.url,
      cl.lesson_order, 
      l.quizid       AS lesson_quizid,
      cl.quizid      AS final_quizid,
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

    /**
     * 2️⃣ Lesson locking
     */
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

      return {
        lesson_id: row.lesson_id,
        title: row.title,
        outline: row.outline,
        url: row.url,
        lesson_order: row.lesson_order,
        quizid: row.lesson_quizid,
        is_completed: row.is_completed,
        locked
      };
    });

    /**
     * 3️⃣ Extract quiz IDs
     */
    const lessonQuizIds = [
      ...new Set(
        lessons
          .map(l => l.quizid)
          .filter(Boolean)
      )
    ];

    const finalQuizId = result.rows[0]?.final_quizid || null;

    const allQuizIds = [
      ...new Set([...lessonQuizIds, finalQuizId].filter(Boolean))
    ];

    /**
     * 4️⃣ Fetch all quizzes (LESSON + FINAL)
     */
    let quizMap = {};

    if (allQuizIds.length) {
      const quizResult = await pool.query(
        `
      SELECT 
        q._id,
        q.name,
        COALESCE(
          (
            SELECT jsonb_agg(qq.*)
            FROM quiz_questions qq
            JOIN LATERAL jsonb_array_elements_text(q.questions) AS qid(id)
              ON qq._id = qid.id::int
          ),
          '[]'::jsonb
        ) AS questions
      FROM quiz q
      WHERE q._id = ANY($1::int[])
      `,
        [allQuizIds]
      );

      quizResult.rows.forEach(q => {
        quizMap[q._id] = q;
      });
    }

    /**
     * 5️⃣ Inject lesson quiz
     */
    const lessonsWithQuiz = lessons.map(lesson => {
      const quiz = lesson.quizid
        ? quizMap[lesson.quizid] || null
        : null;

      return {
        ...lesson,
        quiz: quiz
          ? {
            ...quiz,
            locked: !lesson.is_completed
          }
          : null
      };
    });

    /**
     * 6️⃣ FINAL EXAM LOCK
     */
    const allLessonsCompleted = lessons.every(l => l.is_completed);

    const finalQuiz = finalQuizId
      ? {
        ...quizMap[finalQuizId],
        locked: !allLessonsCompleted
      }
      : null;

    /**
     * 7️⃣ Final response
     */
    return {
      lessons: lessonsWithQuiz,
      finalQuiz
    };
  }


};

module.exports = CourseModel;
