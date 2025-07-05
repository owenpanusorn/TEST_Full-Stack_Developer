const router = require("express").Router();
const galleryController = require("../controllers/gallery.controllers");

router.get("/gallery", galleryController.fetchGallery)
router.get("/tags", galleryController.fetchTags)

router.post("/tags", galleryController.generateTags);
router.post("/imageUrl", galleryController.generateImages);
router.post("/imageTags", galleryController.generateMatchImageAndKeywords)

module.exports = router;
