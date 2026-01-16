const express = require("express");
const QuizController = require("../controllers/quiz");


const router = express.Router();

router.get("/", QuizController.getAll); //get
router.get("/:id", QuizController.getById); //single get

router.delete("/:id", QuizController.delete); //delete

router.put("/:id", QuizController.update); //update 
router.post("/", QuizController.create); //create

router.get("/final_exam/:id", QuizController.getFinalExamQuiz); //get



module.exports = router;