const jwt = require("jsonwebtoken");
require("dotenv").config();


module.exports = async (req, res, next) => {
    try {

        //1. destructure the req.header to get the token

        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json({ message: "Not authorized" });
        }

        //2. verify the token

        const payload = jwt.verify(jwtToken, process.env.jwt_secret);

        req.user = payload.user;

        next();

    } catch (error) {
        // console.error(error.message);
        res.status(403).json({ message: "Not authorized" });
    }
};