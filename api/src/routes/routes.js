const router = require("express").Router();

router.use("/api", require("./gallery.route"))

module.exports = router;