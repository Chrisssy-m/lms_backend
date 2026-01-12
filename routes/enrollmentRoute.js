const express = require("express");
const EnrollmentController = require("../controllers/enrollment");


const router = express.Router();

router.get("/", EnrollmentController.getAll); //get
router.get("/:id", EnrollmentController.getById); //single get

router.delete("/:id", EnrollmentController.delete); //delete

router.put("/:id", EnrollmentController.update); //update 
router.post("/", EnrollmentController.create); //create

router.get("/courses/:id", EnrollmentController.getEnrolledCourses); // get enrolled courses by id


module.exports = router;
