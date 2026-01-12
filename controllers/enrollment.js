


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

            const file = req?.files?.thumbnail;
            if (file) {
                cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
                    fs.unlinkSync(file.tempFilePath);
                    console.log('result', result);

                    const { title, description, author, price, lessons } = req.body;

                    const _id = parseInt(req.params.id, 10);
                    const thumbnail = result?.url || null;
                    const course = await EnrollmentModel.update({
                        _id,
                        title,
                        description,
                        author,
                        price,
                        thumbnail,
                        lessons: JSON.parse(lessons)
                    });

                    res.status(201).json({
                        message: "Course updated successfully",
                        course
                    });
                })
            } else {
                const { _id, title, description, author, price, thumbnail, lessons } = req.body;
                const course = await EnrollmentModel.update({
                    _id, title, description, author, price, thumbnail, lessons: JSON.parse(lessons)
                });

                res.status(201).json({
                    message: "Course updated successfully",
                    course
                });
            }



        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const enrollment = await EnrollmentModel.findAll();
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
};

module.exports = EnrollmentController;
