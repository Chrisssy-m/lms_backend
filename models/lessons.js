// const pool = require("./connection");

const pool = require("../connection");

const LessonsModel = {

  create: async ({ title, url, quizId, type }) => {
    const query = `
      INSERT INTO lessons(title,url,quizId,type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [title, url, quizId, type];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  update: async (data) => {
    
    const { _id, title, url, quizId, type} = data;

    const query = `
    UPDATE lessons
    SET
      title = COALESCE($1, title),
      url = COALESCE($2, url),
      quizId = COALESCE($3, quizId),
      type = COALESCE($4, type),
    WHERE _id = $5
    RETURNING *
  `;

    const values = [
      title ?? null,
      url ?? null,
      quizId ?? null,
      type ?? null,
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

  findAll: async () => {
    const { rows } = await pool.query(
      "SELECT * FROM lessons"
    );
    return rows;
  }

};

module.exports = LessonsModel;
