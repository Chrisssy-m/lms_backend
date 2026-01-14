const Lesson_progressModel = require("../models/lesson_progress");



const Lesson_progressController = {
  
  create: async (req, res) => {
    
    try {
     
        const { title, description, author, price, lessons } = req.body;

        // create course
        const course = await Lesson_progressModel.create({
          title,
          description,
          author,
          price,
          thumbnail: '',
          lessons:''
        });

        res.status(201).json({
          message: "Course created successfully",
          course
        });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  update: async (req, res) => {

    try {

      const file = req?.files?.thumbnail;
     
        const { _id, title, description, author, price, thumbnail, lessons } = req.body;
        const course = await Lesson_progressModel.update({
          _id, title, description, author, price, thumbnail, lessons: JSON.parse(lessons)
        });

        res.status(201).json({
          message: "Course updated successfully",
          course
        });
      



    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const lesson_progress = await Lesson_progressModel.findAll();
      res.status(200).json(lesson_progress);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const course = await Lesson_progressModel.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const course = await Lesson_progressModel.deleteById(req.params.id);
      if (!course) {
        return res.status(400).json({ message: "Course not found!" });
      }
      return res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

 
};

module.exports = Lesson_progressController;
