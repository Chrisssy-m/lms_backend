const express = require("express");

const Course_LessonsController = require("../controllers/course_lessons");


const router = express.Router();


router.get("/:id", Course_LessonsController.getById); //single get

router.delete("/:id", Course_LessonsController.delete); //delete

router.put("/:id", Course_LessonsController.update); //update 


router.get("/", Course_LessonsController.getAll); //get
router.post("/", Course_LessonsController.create); //create



module.exports = router;