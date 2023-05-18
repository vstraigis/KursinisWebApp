const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

module.exports = async (req, res, next) => {
    try {
        // 1. destructure the req.header to get the token
        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // 2. verify the token
        const payload = jwt.verify(jwtToken, process.env.jwt_secret);
        const userId = payload.user;

        // 3. query the database for the user
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        // 4. check if user is admin
        if (user.role !== "ADMIN") {
            return res.status(403).json({ message: "Not authorized" });
        }
       

        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: "Not authorized" });
    }
};
