const router = require("express").Router();
const galleryController = require("../controllers/gallery.controllers");

router.post("/keywords", galleryController.addKeywords);

module.exports = router;
