const router = require('express').Router();
const { Prisma } = require('@prisma/client');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validinfo = require('../middleware/validinfo');
const authorization = require('../middleware/authorization');


// register route

router.post("/register", validinfo, async (req, res) => {
    try {
        //1. destructure req.body

        const { name, email, password } = req.body;

        //2. check if user exists in database with prisma (if user exists then throw error)

        const countExisting = await db.user.count({ where: { email: email } });

        if (countExisting > 0) {
            return res.status(401).send("User already exists!");
        }

        //3. bcrypt the user password

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. enter the new user inside our database

        const newUser = await db.user.create({
            data: {
                name: name,
                email: email,
                password: bcryptPassword
            }
        });

        //res.json(newUser);

        //5. generating our jwt token

        const token = jwtGenerator(newUser.id);

        res.json({ token });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error during registration");
    }
});

// login route

router.post("/login", validinfo, async (req, res) => {
    try {

        //1. destructure req.body

        const { email, password } = req.body;


        //2. check if user doesn't exist (if not then throw error)

        const countExisting = await db.user.count({ where: { email: email } });

        if (countExisting === 0) {
            return res.status(401).send("User does not exist!");
        }

        //3. check if incoming password is the same as the database password

        const user = await db.user.findUnique({ where: { email: email } });

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).send("Password is incorrect!");
        }

        //4. give them the jwt token

        const token = jwtGenerator(user.id);

        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error during login");
    }
});

// verify route

router.get("/verify", authorization, async (req, res) => {
    try {

        res.json(true);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error during verification");
    }
});

module.exports = router;