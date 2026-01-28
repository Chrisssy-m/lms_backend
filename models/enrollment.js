// const pool = require("./connection");
const { getTotalRec, getPaginatedData } = require("./utils");
const pool = require("../connection");

const EnrollmentModel = {

    create: async ({ user_id, course_id, status, payment }) => {
        const query = `
      INSERT INTO enrollments (user_id, course_id, status, payment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

        const values = [user_id, course_id, status, payment ?? '100% Complete',];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    update: async (data) => {

        const { user_id, course_id, status, payment } = data;

        const singleGet = await pool.query(
            "SELECT * FROM enrollments WHERE user_id = $1 AND  course_id = $2",
            [user_id, course_id]
        );

        if (singleGet.rows.length === 0) {
            throw new Error("Enrollment not found");
        }
        const record = singleGet?.rows[0]
        const id = record?._id
        const query = `
            UPDATE enrollments
        SET 
        status = $1,
        payment = $2
        WHERE _id = $3
        RETURNING *;

          `;

        const values = [
            status, payment ?? record?.payment, id
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
        // SELECT c.*
        // FROM enrollments e
        // INNER JOIN courses c ON c._id = e.course_id
        // WHERE e.user_id = $1
        const query = `
  SELECT 
      c.*, 
      e.payment,
      e.status
  FROM enrollments e
  INNER JOIN courses c ON c._id = e.course_id
  WHERE e.user_id = $1;
`;


        const { rows } = await pool.query(query, [id]);
        return rows
    },

    deleteById: async (id) => {
        const { rows } = await pool.query(
            "DELETE FROM enrollments WHERE _id = $1 RETURNING *;",
            [id]
        );
        return rows[0];
    },
    findFilterRecords: async ({ col, row }) => {
        let query;
        let values;

        if (col === "_id" || col === 'course_id' || col === 'user_id') {
            query = `
    SELECT *
    FROM enrollments
    WHERE ${col} = $1
  `;
            values = [Number(row)];
        } else {
            query = `
    SELECT *
    FROM enrollments
    WHERE ${col} ILIKE $1
  `;
            values = [`%${row}%`];
        }

        const { rows } = await pool.query(query, values);
        return rows;
    },
    findAll: async ({ page, size }) => {
        const reqPage = page || 1;
        const limit = size || 10;

        const offset = (reqPage - 1) * limit;

        const totalRec = await pool.query(
            getTotalRec('enrollments')
        );

        const query = getPaginatedData('enrollments')
        const values = [limit, offset];
        const { rows } = await pool.query(query, values);
        return { data: rows, totalRecords: totalRec?.rows[0].count || null };

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
