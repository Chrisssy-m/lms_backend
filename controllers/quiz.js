const QuizModel = require("../models/quiz");


const QuizController = {

    create: async (req, res) => {
        try {
            const { name, questions } = req.body;



            const quiz = await QuizModel.create({
                name, questions
            });



            res.status(201).json({
                message: "Quiz added successfully!",
                quiz
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    update: async (req, res) => {
        try {
            const { _id, name, questions } = req.body;

            // update user
            const quiz = await QuizModel.update({
                _id, name, questions
            });

            res.status(201).json({
                message: "Quiz updated successfully",
                quiz
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const quiz = await QuizModel.findAll();
            res.status(200).json(quiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const quiz = await QuizModel.findById(req.params.id);
            if (!quiz) {
                return res.status(404).json({ message: "Quiz not found" });
            }
            res.json(quiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const quiz = await QuizModel.deleteById(req.params.id);
            if (!quiz) {
                return res.status(400).json({ message: "Quiz not found!" });
            }
            return res.status(200).json({ message: "Quiz deleted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getFinalExamQuiz: async (req, res) => {
        try {
            const quiz = await QuizModel.findFinalExam(req.params.id);
            res.status(200).json(quiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = QuizController;
