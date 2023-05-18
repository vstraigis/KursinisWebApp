const router = require("express").Router();
const db = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    try {
      // req.user has the payload
      const user = await db.user.findUnique({
        where: { id: req.user },
      });
      res.json({ user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error during dashboard");
    }
  });


module.exports = router;