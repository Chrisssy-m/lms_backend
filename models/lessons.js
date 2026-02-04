// const pool = require("./connection");

const pool = require("../connection");
const { getTotalRec, getPaginatedData } = require("./utils");
const LessonsModel = {

  create: async ({ title, url, quizid, outline }) => {
    const query = `
      INSERT INTO lessons(title, url, quizid, outline)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [title, url, quizid, outline];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  update: async (data) => {
    
    const { _id, title, url, quizid, outline } = data;

    const query = `
    UPDATE lessons
    SET
      title = COALESCE($1, title),
      url = COALESCE($2, url),
      quizid = $3,
      outline = COALESCE($4, outline)
    WHERE _id = $5
    RETURNING *
  `;

    const values = [
      title ?? null,
      url ?? null,
      quizid ?? null,
      outline ?? null,
      _id
    ];

    const { rows } = await pool.query(query, values);

    console.log("Updated row:", rows[0]); // ✅ debug
    return rows[0];
  },


  findById: async (id) => {
    const { rows } = await pool.query(
      "SELECT * FROM lessons WHERE _id = $1",
      [id]
    );
    return rows[0];
  },

  deleteById: async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM lessons WHERE _id = $1 RETURNING *;",
      [id]
    );
    return rows[0];
  },
  findFilterRecords: async ({ col, row }) => {
    let query;
    let values;

    if (col === "_id") {
      query = `
    SELECT *
    FROM lessons
    WHERE _id = $1
  `;
      values = [Number(row)];
    } else {
      query = `
    SELECT *
    FROM lessons
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
      getTotalRec('lessons')
    );

    const query = getPaginatedData('lessons')
    const values = [limit, offset];
    const { rows } = await pool.query(query, values);
    return { data: rows, totalRecords: totalRec?.rows[0].count || null };
  }

};

module.exports = LessonsModel;
