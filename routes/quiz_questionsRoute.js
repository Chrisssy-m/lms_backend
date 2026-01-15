const express = require("express");
const Quiz_QuestionsController = require("../controllers/quiz_questions");



const router = express.Router();

router.get("/", Quiz_QuestionsController.getAll); //get
router.get("/:id", Quiz_QuestionsController.getById); //single get

router.delete("/:id", Quiz_QuestionsController.delete); //delete

router.put("/:id", Quiz_QuestionsController.update); //update 
router.post("/", Quiz_QuestionsController.create); //create

module.exports = router;