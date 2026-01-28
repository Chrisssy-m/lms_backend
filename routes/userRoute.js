const express = require("express");
const UserController = require("../controllers/user");
const { verifyJWT } = require("../middlewares/authenticate");
// const UserController = require("../controllers/user.controller");

const router = express.Router();

router.get("/", verifyJWT, UserController.getAll); //get
router.get("/:id", verifyJWT, UserController.getById); //single get

router.delete("/:id", verifyJWT, UserController.delete); //delete

router.put("/register/:id", verifyJWT, UserController.update); //update 
router.post("/register", UserController.create); //create

router.post("/login", UserController.login); //login

router.post("/search", verifyJWT, UserController.getFilters);

router.post("/email", verifyJWT, UserController.sendEmail);

module.exports = router;