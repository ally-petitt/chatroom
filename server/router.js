const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("home route is working")
})

module.exports = router;