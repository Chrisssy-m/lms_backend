
const LessonsModel = require("../models/lessons");

const LessonsController = {

    create: async (req, res) => {
        try {
            const { title, url, quizid, outline } = req.body;



            // create user
            const lesson = await LessonsModel.create({
                title, url, quizid, outline
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
            const { _id, title, url, quizid, outline} = req.body;
            // update user
            const lesson = await LessonsModel.update({
                _id, title, url, quizid, outline
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
            const { page, size } = req.query
            const lessons = await LessonsModel.findAll({ page, size });
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
    getFilters: async (req, res) => {
        try {
            const { col, row } = req.query; // ✅ FIX

            if (!col || !row) {
                return res.status(400).json({ error: 'col and row are required' });
            }

            const users = await LessonsModel.findFilterRecords({ col, row });

            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = LessonsController;
