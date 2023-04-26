const router = require("express").Router();
const db = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    try {

        //req.user has the payload
        res.json(req.user);


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error during dashboard");
    }
});


module.exports = router;