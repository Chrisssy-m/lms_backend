// const pool = require("./connection");

const pool = require("../connection");

const QuizModel = {

    create: async ({ name, questions }) => {
        const query = `
      INSERT INTO quiz (name, questions)
      VALUES ($1, $2)
      RETURNING *
    `;
        const values = [name, questions ? JSON.stringify(questions) : null];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    update: async (data) => {

        const { _id, name, questions } = data;

        const query = `
    UPDATE quiz
SET
    name     = COALESCE($1, name),      
    questions    = COALESCE($2, questions)            
WHERE _id = $3                                      
RETURNING *;
  `;

        const values = [name, questions ? JSON.stringify(questions) : null, _id];

        const { rows } = await pool.query(query, values);
        return rows[0];
    },


    findById: async (id) => {
        const { rows } = await pool.query(
            "SELECT * FROM quiz WHERE _id = $1",
            [id]
        );
        return rows[0];
    },

    deleteById: async (id) => {
        const { rows } = await pool.query(
            "DELETE FROM quiz WHERE _id = $1 RETURNING *;",
            [id]
        );
        return rows[0];
    },

    findAll: async () => {
        const { rows } = await pool.query(
            "SELECT * FROM quiz"
        );
        return rows;
    },

    findFinalExam: async (id) => {
        const { rows } = await pool.query(
            `
      SELECT
  q._id AS quiz_id,
  q.name,
  COALESCE(
    json_agg(qq.*),
    '[]'
  ) AS questions
FROM quiz q
LEFT JOIN quiz_questions qq
  ON qq._id IN (
    SELECT jsonb_array_elements_text(q.questions)::int
  )
WHERE q._id = $1
GROUP BY q._id, q.name;
      `, [id]
        )
        return rows
    }
};

module.exports = QuizModel;
