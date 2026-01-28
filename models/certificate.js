// const pool = require("./connection");

const pool = require("../connection");
const { getTotalRec, getPaginatedData } = require("./utils");
const CertificateModel = {

    create: async ({ course_id, url }) => {

        const query = `
      INSERT INTO certificate (course_id, url)
      VALUES ($1, $2)
      RETURNING *
    `;

        const values = [course_id, url];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    findFilterRecords: async ({ col, row }) => {
        let query;
        let values;

        if (col === "_id") {
            query = `
    SELECT *
    FROM certificate
    WHERE _id = $1
  `;
            values = [Number(row)];
        } else {
            query = `
    SELECT *
    FROM certificate
    WHERE ${col} ILIKE $1
  `;
            values = [`%${row}%`];
        }

        const { rows } = await pool.query(query, values);
        return rows;

    },
    update: async (data) => {

        const { _id, course_id, url } = data;

        const query = `
    UPDATE certificate
    SET
      course_id  = COALESCE($1, course_id),
      url = $2
    WHERE _id = $3
    RETURNING *
  `;

        const values = [
            course_id, url, _id
        ];

        const { rows } = await pool.query(query, values);

        console.log("Updated row:", rows[0]); // ✅ debug
        return rows[0];
    },


    findById: async (id) => {
        const { rows } = await pool.query(
            "SELECT * FROM certificate WHERE _id = $1",
            [id]
        );
        return rows[0];
    },
    findCourseById: async (id) => {
        const { rows } = await pool.query(
            "SELECT * FROM certificate WHERE course_id = $1",
            [id]
        );
        return rows[0];
    },
    deleteById: async (id) => {
        const { rows } = await pool.query(
            "DELETE FROM certificate WHERE _id = $1 RETURNING *;",
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
                getTotalRec('certificate')
            );

            const query = getPaginatedData('certificate')
            const values = [limit, offset];
            const { rows } = await pool.query(query, values);
            return { data: rows, totalRecords: totalRec?.rows[0].count || null };
        } else {
            const { rows } = await pool.query('SELECT * FROM certificate');
            return rows
        }


    },


};

module.exports = CertificateModel;
