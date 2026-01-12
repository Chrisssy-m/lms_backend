
const CourseModel = require("../models/course");
const cloudinary = require("cloudinary").v2
const fs = require('fs')
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure_distribution: 'mydomain.com',
  // upload_prefix: 'https://api-eu.cloudinary.com'
});
const CourseController = {
  
  create: async (req, res) => {
    
    try {
      const file = req.files.thumbnail;
      cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        
        fs.unlinkSync(file.tempFilePath);
        console.log('result', result);
        const { title, description, author, price, lessons } = req.body;

        // create course
        const course = await CourseModel.create({
          title,
          description,
          author,
          price,
          thumbnail: result.url,
          lessons: JSON.parse(lessons)
        });

        res.status(201).json({
          message: "Course created successfully",
          course
        });
      })


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
          const course = await CourseModel.update({
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
        const course = await CourseModel.update({
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
      const users = await CourseModel.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const course = await CourseModel.findById(req.params.id);
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
      const course = await CourseModel.deleteById(req.params.id);
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
      const course = await CourseModel.findLessonsById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CourseController;
