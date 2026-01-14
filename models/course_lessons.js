// const pool = require("./connection");

const pool = require("../connection");

const Course_LessonsModel = {

    create: async ({ userId, courseId, lessonId }) => {

        await pool.query(
            `INSERT INTO lesson_progress (user_id, course_id, lesson_id, is_completed, completed_at)
       VALUES ($1, $2, $3, TRUE, NOW())
       ON CONFLICT (user_id, lesson_id, course_id)
       DO UPDATE SET is_completed = TRUE, completed_at = NOW()`,
            [userId, courseId, lessonId]
        );

        return "Lesson marked completed"
    },


    update: async ({ course_id, lesson_id }) => {



        await pool.query("BEGIN");

        // 1️⃣ Delete old lessons
        await pool.query(
            "DELETE FROM course_lessons WHERE course_id = $1",
            [course_id]
        );

        // 2️⃣ Insert updated lessons with new order
        const insertQuery = `
      INSERT INTO course_lessons (course_id, lesson_id, lesson_order)
      VALUES ($1, $2, $3)
    `;
        for (let i = 0; i < lesson_id.length; i++) {
            await pool.query(insertQuery, [course_id, lesson_id[i], i + 1]);
        }

        await pool.query("COMMIT");
        return "Course lessons updated successfully";

    },
    findById: async (id) => {
        const { rows } = await pool.query(
            `SELECT lesson_id
   FROM course_lessons
   WHERE course_id = $1
   ORDER BY lesson_order`,
            [id]
        );
        const output = {
            courseId: Number(id),
            lessonId: rows.map(row => row.lesson_id)
        };
        return output;

    },

    deleteById: async (id) => {
        const { rows } = await pool.query(
            "DELETE FROM course_lessons WHERE _id = $1 RETURNING *;",
            [id]
        );
        return rows[0];
    },

    findAll: async () => {
        const { rows } = await pool.query(
            "SELECT * FROM course_lessons"
        );
        return rows;
    }

};

module.exports = Course_LessonsModel;
