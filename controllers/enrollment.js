


const EnrollmentModel = require("../models/enrollment");

const EnrollmentController = {

    create: async (req, res) => {
        try {

            const { user_id, course_id, status } = req.body;

            // create course
            const enrollment = await EnrollmentModel.create({
                user_id, course_id, status
            });

            res.status(201).json({
                message: "Enrolled successfully",
                enrollment
            });



        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    update: async (req, res) => {

        try {


            const { user_id, course_id, status } = req.body;
            const enrollment = await EnrollmentModel.update({
                user_id, course_id, status
            });

            res.status(201).json({
                message: "Enrollment updated successfully",
                enrollment
            });




        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const { page, size } = req.query
            const enrollment = await EnrollmentModel.findAll({ page, size });
            res.status(200).json(enrollment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {

            const enrollment = await EnrollmentModel.findById(req.params.id);
            if (!enrollment) {
                return res.status(404).json({ message: "enrollment not found" });
            }
            res.json(enrollment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getEnrolledCourses: async (req, res) => {
        try {
            const enrollment = await EnrollmentModel.findCourseById(req.params.id);
            if (!enrollment) {
                return res.status(404).json({ message: "enrollment not found" });
            }
            res.json(enrollment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
           
            const course = await EnrollmentModel.deleteById(req.params.id);
            if (!course) {
                return res.status(400).json({ message: "Course not found!" });
            }
            return res.status(200).json({ message: "Course deleted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getLessons: async (req, res) => {
        try {
            const course = await EnrollmentModel.findLessonsById(req.params.id);
            if (!course) {
                return res.status(404).json({ message: "course not found" });
            }
            res.json(course);
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

            const users = await EnrollmentModel.findFilterRecords({ col, row });

            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = EnrollmentController;
