const express = require("express");
const UserController = require("../controllers/user");
// const UserController = require("../controllers/user.controller");

const router = express.Router();

router.get("/", UserController.getAll); //get
router.get("/:id", UserController.getById); //single get

router.delete("/:id", UserController.delete); //delete

router.put("/register/:id", UserController.update); //update 
router.post("/register", UserController.create); //create

router.post("/login", UserController.login); //login

module.exports = router;