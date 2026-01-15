// const pool = require("./connection");

const pool = require("../connection");

const Course_LessonsModel = {

    create: async ({ course_id, lesson_id }) => {
        const { rows } = await pool.query(
            "SELECT _id FROM courses"
        );
        const courseIds = rows?.map(x => x._id)
        console.log('dupIds', courseIds)
        if (courseIds.includes(course_id)) {
            return 'This course already exist in table try updating it!'
        } else {
            await pool.query("BEGIN");
            const insertQuery = `
          INSERT INTO course_lessons (course_id, lesson_id, lesson_order)
          VALUES ($1, $2, $3)
        `;
            for (let i = 0; i < lesson_id.length; i++) {
                await pool.query(insertQuery, [course_id, lesson_id[i], i + 1]);
            }

            await pool.query("COMMIT");
        }

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
