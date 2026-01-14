
const LessonsModel = require("../models/lessons");

const LessonsController = {

    create: async (req, res) => {
        try {
            const { title, url, quizId, type } = req.body;



            // create user
            const lesson = await LessonsModel.create({
                title, url, quizId, type
            });

            res.status(201).json({
                message: "Lesson registered successfully",
                lesson
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    update: async (req, res) => {
        try {
            const { _id, title, url, quizId, type } = req.body;
            // update user
            const lesson = await LessonsModel.update({
                _id, title, url, quizId, type
            });

            res.status(201).json({
                message: "Lesson updated successfully",
                lesson
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const lessons = await LessonsModel.findAll();
            res.status(200).json(lessons);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const lesson = await LessonsModel.findById(req.params.id);
            if (!lesson) {
                return res.status(404).json({ message: "lesson not found" });
            }
            res.json(lesson);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const lesson = await LessonsModel.deleteById(req.params.id);
            if (!lesson) {
                return res.status(400).json({ message: "Lesson not found!" });
            }
            return res.status(200).json({ message: "Lesson deleted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = LessonsController;
