const express = require("express");
const Lesson_progressController = require("../controllers/lesson_progress");



const router = express.Router();

router.get("/", Lesson_progressController.getAll); //get
router.get("/:id", Lesson_progressController.getById); //single get

router.delete("/:id", Lesson_progressController.delete); //delete

router.put("/:id", Lesson_progressController.update); //update 
router.post("/", Lesson_progressController.create); //create



module.exports = router;
