// const pool = require("./connection");

const pool = require("../connection");

const Quiz_QuestionsModel = {

  create: async ({ question, answers }) => {
    const query = `
      INSERT INTO quiz_questions (question, answers)
      VALUES ($1, $2)
      RETURNING _id, question, answers
    `;
    const values = [question, answers];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  update: async (data) => {
    
    const { _id, question, answers } = data;

    const query = `
    UPDATE quiz_questions
SET
    question  = COALESCE($1, question),      
    answers   = COALESCE($2, answers)           
WHERE _id = $3                                      
RETURNING *;
  `;

    const values = [question, answers, _id];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },


  findByEmail: async (email) => {
    const { rows } = await pool.query(
      "SELECT * FROM quiz_questions WHERE email = $1",
      [email]
    );
    return rows[0];
  },

  findById: async (id) => {
    const { rows } = await pool.query(
      "SELECT * FROM quiz_questions WHERE _id = $1",
      [id]
    );
    return rows[0];
  },

  deleteById: async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM quiz_questions WHERE _id = $1 RETURNING *;",
      [id]
    );
    return rows[0];
  },

  findAll: async () => {
    const { rows } = await pool.query(
      "SELECT * FROM quiz_questions"
    );
    return rows;
  }

};

module.exports = Quiz_QuestionsModel;
