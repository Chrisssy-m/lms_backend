const express = require("express");
const CourseController = require("../controllers/course");
// const UserController = require("../controllers/user.controller");

const router = express.Router();

router.get("/", CourseController.getAll); //get
router.get("/:id", CourseController.getById); //single get

router.delete("/:id", CourseController.delete); //delete

router.put("/:id", CourseController.update); //update 
router.post("/", CourseController.create); //create


module.exports = router;
