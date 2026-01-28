const express = require("express");

const { verifyJWT } = require("../middlewares/authenticate");
const CertificateController = require("../controllers/certificate");


const router = express.Router();

router.get("/", verifyJWT,CertificateController.getAll); //get
router.get("/:id",verifyJWT,CertificateController.getById); //single get

router.delete("/:id", verifyJWT,CertificateController.delete); //delete

router.put("/:id", verifyJWT,CertificateController.update); //update 
router.post("/", verifyJWT,CertificateController.create); //create

router.post("/search", verifyJWT,CertificateController.getFilters);
module.exports = router;
