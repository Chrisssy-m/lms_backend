const Course_LessonsModel = require("../models/course_lessons");



const Course_LessonsController = {

    create: async (req, res) => {
        try {
            const { course_id, lesson_id, quizid } = req.body;
            const table = await Course_LessonsModel.findAll();
            const dups = table?.map(x => x.course_id) || []

            if (dups?.includes(course_id)) {
                return res.status(400).json({ message: "This course is alreay exist in table!" });
            } else {
                if (!course_id || !Array.isArray(lesson_id) || lesson_id.length === 0) {
                    return res.status(400).json({ message: "Invalid payload" });
                }

                // create 
                const course_lesson = await Course_LessonsModel.create({
                    course_id, lesson_id, quizid
                });

                res.status(201).json({
                    message: course_lesson,

                });
            }


        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    update: async (req, res) => {
        try {
            const { course_id, lesson_id, quizid } = req.body;

            if (!course_id || !Array.isArray(lesson_id) || lesson_id.length === 0) {
                return res.status(400).json({ message: "Invalid payload" });
            }

            // create 
            const course_lesson = await Course_LessonsModel.update({
                course_id, lesson_id, quizid
            });

            res.status(201).json({
                message: course_lesson,

            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {

            const course_lessons = await Course_LessonsModel.findAll();
            res.status(200).json(course_lessons);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const course_lesson = await Course_LessonsModel.findById(req.params.id);
            if (!course_lesson) {
                return res.status(404).json({ message: "courseId not found" });
            }
            res.json(course_lesson);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const course_lesson = await Course_LessonsModel.deleteById(req.params.id);
            if (!course_lesson) {
                return res.status(400).json({ message: "Course not found!" });
            }
            return res.status(200).json({ message: "Course deleted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = Course_LessonsController;
